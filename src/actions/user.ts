"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function revalidateVideoPage(videoId: string) {
  revalidatePath(`/video/${videoId}`);
}

// Authenticate User with clerk
export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    // check if user exists
    const userExist = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
      },
    });
    if (userExist) {
      return { status: 200, user: userExist };
    }

    //create new user
    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspace: {
          where: {
            User: {
              clerkid: user.id,
            },
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (newUser) {
      return { status: 201, user: newUser };
    }
    return { status: 400 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

/**
 * Server action that fetches notifications for the current user.
 * Retrieves all notifications and their total count associated with the user.
 * Returns 200 & notifications if found, 404 if no user/notifications exist, or 400 if query fails.
 */

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const notifications = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });

    if (notifications && notifications.notification.length > 0)
      return { status: 200, data: notifications };
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 400, data: [] };
  }
};

/**
 * Server action that searches for users based on a query string.
 * Searches through first name, last name, and email fields.
 * Excludes current user from results and includes subscription details.
 * Returns 200 & users if found, 404 if no user/matches exist, or 500 if query fails.
 */
export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { email: { contains: query } },
          { lastname: { contains: query } },
        ],
        NOT: [{ clerkid: user.id }],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstname: true,
        lastname: true,
        image: true,
        email: true,
      },
    });

    if (users && users.length > 0) {
      return { status: 200, data: users };
    }

    return { status: 404, data: undefined };
  } catch (error) {
    return { status: 500, data: undefined };
  }
};

/**
 * Retrieves a user's profile ID and image from the database using their Clerk ID.
 * Uses the currentUser() helper to get the authenticated user, then queries the database.
 * Returns:
 * - {status: 404} if no authenticated user found
 * - {status: 200, data: {id, image}} if profile exists
 * - {status: 400} if error occurs during lookup
 */

export const getUserProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const profileIdAndImage = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    });

    if (profileIdAndImage) return { status: 200, data: profileIdAndImage };
  } catch (error) {
    return { status: 400 };
  }
};

/**
 * Fetches comments for a video or comment thread, including nested replies.
 * Looks for comments where either videoId or commentId matches the input Id,
 * but only root-level comments (commentId is null).
 * Includes the user data for both comments and replies.
 * Returns:
 * - {status: 200, data: comments[]} if successful
 * - {status: 400} if query fails
 */
export const getVideoComments = async (Id: string) => {
  try {
    const comments = await client.comment.findMany({
      where: {
        OR: [{ videoId: Id }, { commentId: Id }],
        commentId: null,
      },
      select: {
        id: true,
        comment: true,
        createdAt: true,
        commentId: true,
        userId: true,
        videoId: true,
        isEdited: true,
        User: true,
        reply: {
          select: {
            id: true,
            comment: true,
            createdAt: true,
            commentId: true,
            userId: true,
            videoId: true,
            isEdited: true,
            User: true,
          },
        },
      },
    });

    return { status: 200, data: comments };
  } catch (error) {
    return { status: 400 };
  }
};

/**
 * Configures and returns email transport and options using nodemailer.
 * Uses Gmail SMTP with secure connection (port 465).
 * Requires MAILER_EMAIL and MAILER_PASSWORD env variables.
 *
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param text - Plain text email body
 * @param html - Optional HTML email body
 * @returns {transporter, mailOptions} Email transport and configuration
 */

// export const sendEmail = async (
//   to: string,
//   subject: string,
//   text: string,
//   html?: string
// ) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: process.env.MAILER_EMAIL,
//       pass: process.env.MAILER_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     to,
//     subject,
//     text,
//     html,
//   };
//   return { transporter, mailOptions };
// };

/**
 * Creates either a new comment on a video or a reply to an existing comment.
 * If commentId provided, adds reply to existing comment.
 * If no commentId, creates new root-level comment on video.
 *
 * @param userId - ID of user creating comment/reply
 * @param comment - Comment text content
 * @param videoId - ID of video being commented on
 * @param commentId - Optional ID of parent comment for replies
 * Returns:
 * - {status: 200, data: string} Success message
 * - {status: 400} If operation fails
 */
export const createCommentAndReply = async (
  userId: string,
  comment: string,
  videoId: string,
  commentId?: string | undefined
) => {
  try {
    if (commentId) {
      const reply = await client.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId,
              videoId,
            },
          },
        },
      });
      if (reply) {
        return { status: 200, data: "Reply posted" };
      }
    }

    const newComment = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        Comment: {
          create: {
            comment,
            userId,
          },
        },
      },
    });
    if (newComment) return { status: 200, data: "New comment added" };
  } catch (error) {
    return { status: 400 };
  }
};

/**
 * Retrieves user's subscription plan information from the database.
 * Requires authenticated user.
 * Only returns the subscription plan details if available.
 *
 * Returns:
 * - {status: 404} if no authenticated user
 * - {status: 200, data: {subscription}} if user and plan found
 * - {status: 400} if query fails
 */
export const getPaymentInfo = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const payment = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: { plan: true },
        },
      },
    });
    if (payment) {
      return { status: 200, data: payment };
    }
  } catch (error) {
    return { status: 400 };
  }
};

/**
 * Retrieves user's billing information including subscription and payment history.
 * Requires authenticated user.
 * Returns subscription details and last 10 payment transactions.
 *
 * Returns:
 * - {status: 404} if no authenticated user
 * - {status: 200, data: {subscription, paymentHistory}} if data found
 * - {status: 400} if query fails
 */
export const getBillingDetails = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    // First get the user's ID from the database
    const dbUser = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        id: true,
      },
    });

    if (!dbUser) return { status: 404 };

    // Now fetch subscription and payment history using the user's ID
    const [subscription, paymentHistory] = await Promise.all([
      client.subscription.findUnique({
        where: {
          userId: dbUser.id,
        },
        select: {
          plan: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      client.paymentHistory.findMany({
        where: {
          userId: dbUser.id,
        },
        select: {
          id: true,
          amount: true,
          status: true,
          description: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
    ]);

    return {
      status: 200,
      data: {
        subscription,
        paymentHistory,
      },
    };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 400 };
  }
};

/**
 * Retrieves user's firstView setting from database.
 * FirstView determines if user receives notifications on first video view.
 * Requires authenticated user.
 *
 * Returns:
 * - {status: 404} if no authenticated user
 * - {status: 200, data: boolean} if user found, returns firstView setting
 * - {status: 400, data: false} if user not found or query fails
 */
export const getFirstView = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const userData = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        firstView: true,
      },
    });
    if (userData) {
      return { status: 200, data: userData.firstView };
    }
    return { status: 400, data: false };
  } catch (error) {
    return { status: 400 };
  }
};

/**
 * Updates user's firstView notification setting.
 * Toggles whether user receives notifications when their video gets first view.
 * Requires authenticated user.
 *
 * @param state - Boolean to enable/disable firstView notifications
 * Returns:
 * - {status: 404} if no authenticated user
 * - {status: 200, data: string} if setting updated successfully
 * - {status: 400} if update fails
 */
export const enableFirstView = async (state: boolean) => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

    const view = await client.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        firstView: state,
      },
    });

    if (view) {
      return { status: 200, data: "Setting updated" };
    }
  } catch (error) {
    return { status: 400 };
  }
};

/**
 * Updates an existing comment with new content.
 * Marks the comment as edited.
 *
 * @param commentId - ID of comment to edit
 * @param newComment - Updated comment text
 * Returns:
 * - {status: 200, data: Comment} if update successful
 * - {status: 400} if update fails
 */
// actions/user.ts
export const editComment = async (commentId: string, newComment: string) => {
  try {
    const updatedComment = await client.comment.update({
      where: {
        id: commentId,
      },
      data: {
        comment: newComment,
        isEdited: true,
        editedAt: new Date(),
      },
      select: {
        id: true,
        comment: true,
        createdAt: true,
        commentId: true,
        userId: true,
        videoId: true,
        isEdited: true,
        editedAt: true,
        User: true,
        reply: {
          select: {
            id: true,
            comment: true,
            createdAt: true,
            commentId: true,
            userId: true,
            videoId: true,
            isEdited: true,
            User: true,
          },
        },
      },
    });

    if (updatedComment) {
      // Revalidate the path here
      revalidatePath(`/video/${updatedComment.videoId}`);
      return { status: 200, data: updatedComment };
    }
    return { status: 400 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 400 };
  }
};
