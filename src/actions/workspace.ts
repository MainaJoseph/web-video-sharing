"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

//Verify if user has access to workspace
export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };

    const isUserInWorkspace = await client.workSpace.findUnique({
      where: {
        // If the user is the owner of the workspace (User.clerkid matches)
        id: workspaceId,
        // If the user is a member of the workspace (in the members list)
        OR: [
          {
            User: {
              clerkid: user.id,
            },
          },
          {
            members: {
              every: {
                User: {
                  clerkid: user.id,
                },
              },
            },
          },
        ],
      },
    });
    return {
      status: 200,
      data: { workspace: isUserInWorkspace },
    };
  } catch (error) {
    return {
      status: 403,
      data: { workspace: null },
    };
  }
};

/**
 * Server action that handles fetching all folders within a workspace.
 * Takes a workspace ID and returns all associated folders along with their video counts.
 * Returns 200 & folders if found, 404 if no folders exist, or 403 if query fails.
 */
export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const isFolders = await client.folder.findMany({
      where: {
        workSpaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });
    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: isFolders };
    }
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 403, data: [] };
  }
};

/**
 * Server action that retrieves all videos for a user in a workspace or specific folder.
 * Fetches videos along with folder details and user information.
 * Requires authenticated user and returns videos ordered by creation date.
 * Returns 200 & videos if found, 404 if no user/videos exist, or 400 if query fails.
 */
export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const videos = await client.video.findMany({
      where: {
        OR: [{ workSpaceId }, { folderId: workSpaceId }],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (videos && videos.length > 0) {
      return { status: 200, data: videos };
    }

    return { status: 404 };
  } catch (error) {
    return { status: 400 };
  }
};

/**
 * Server action that fetches all workspaces accessible to the current user.
 * Retrieves both owned workspaces and workspaces where user is a member.
 * Includes user's subscription plan details and workspace information.
 * Returns 200 & workspace data if found, 404 if no user exists, or 400 if query fails.
 */
export const getWorkSpaces = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

    const workspaces = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (workspaces) {
      return { status: 200, data: workspaces };
    }
  } catch (error) {
    return { status: 400 };
  }
};

/**
 * Creates a new workspace for a PRO user
 *
 * This function performs the following steps:
 * 1. Verifies if the user is authenticated
 * 2. Checks if the user has a PRO subscription
 * 3. Creates a new public workspace if authorized
 *
 * @param name - The name of the workspace to be created
 * @returns
 * - {status: 201, data: 'Workspace Created'} if successful
 * - {status: 404} if user not found
 * - {status: 401, data: 'You are not authorized...'} if not on PRO plan
 * - {status: 400} if there's an error during creation
 */
export const createWorkspace = async (name: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const authorized = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (authorized?.subscription?.plan === "PRO") {
      const workspace = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type: "PUBLIC",
            },
          },
        },
      });
      if (workspace) {
        return { status: 201, data: "Workspace Created" };
      }
    }
    return {
      status: 401,
      data: "You are not authorized to create a workspace.",
    };
  } catch (error) {
    return { status: 400 };
  }
};
