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

/**
 * Creates a new folder with default name "Untitled" in a specified workspace
 *
 * This function:
 * 1. Updates a workspace by creating a new folder
 * 2. Uses a default name of "Untitled" for the new folder
 * 3. Returns success/error status with appropriate messages
 *
 * @param workspaceId - The ID of the workspace where the folder will be created
 *
 * @returns
 * - {status: 200, message: "New Folder Created"} on successful creation
 * - {status: 500, message: "Oppse something went wrong"} if creation fails
 *
 * @example
 * ```typescript
 * const result = await createFolder("workspace123");
 * if (result.status === 200) {
 *   console.log("Folder created successfully");
 * }
 * ```
 */
export const createFolder = async (workspaceId: string) => {
  try {
    const isNewFolder = await client.workSpace.update({
      where: {
        id: workspaceId,
      },
      data: {
        folders: {
          create: { name: "Untitled" },
        },
      },
    });
    if (isNewFolder) {
      return { status: 200, message: "New Folder Created" };
    }
  } catch (error) {
    return { status: 500, message: "Oppse something went wrong" };
  }
};

/**
 * Renames a folder based on the provided folder ID and new name
 *
 * This function:
 * 1. Attempts to update the folder name in the database
 * 2. Returns success/error status with appropriate messages
 * 3. Handles cases where folder doesn't exist or update fails
 *
 * @param folderId - The unique identifier of the folder to rename
 * @param name - The new name for the folder
 *
 * @returns
 * - {status: 200, data: 'Folder Renamed'} on successful rename
 * - {status: 400, data: 'Folder does not exist'} if folder not found
 * - {status: 500, data: 'Opps! something went wrong'} on server error
 *
 * @example
 * ```typescript
 * const result = await renameFolders("folder123", "New Project");
 * if (result.status === 200) {
 *   console.log("Folder renamed successfully");
 * }
 * ```
 */
export const renameFolders = async (folderId: string, name: string) => {
  try {
    const folder = await client.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    });
    if (folder) {
      return { status: 200, data: "Folder Renamed" };
    }
    return { status: 400, data: "Folder does not exist" };
  } catch (error) {
    return { status: 500, data: "Opps! something went wrong" };
  }
};

/**
 * Retrieves folder information including name and video count
 *
 * This function:
 * 1. Queries the database for a specific folder
 * 2. Returns the folder name and count of associated videos
 * 3. Handles cases where folder doesn't exist
 *
 * @param folderId - The unique identifier of the folder to retrieve
 *
 * @returns
 * - {status: 200, data: {name: string, _count: {videos: number}}} on success
 * - {status: 400, data: null} if folder not found
 * - {status: 500, data: null} on server error
 *
 * @example
 * ```typescript
 * const result = await getFolderInfo("folder123");
 * if (result.status === 200) {
 *   console.log(`Folder ${result.data.name} has ${result.data._count.videos} videos`);
 * }
 * ```
 *
 * @typedef {Object} FolderInfo
 * @property {string} name - The name of the folder
 * @property {Object} _count - Count information
 * @property {number} _count.videos - Number of videos in the folder
 */

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await client.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });
    if (folder)
      return {
        status: 200,
        data: folder,
      };
    return {
      status: 400,
      data: null,
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
    };
  }
};

/**
 * Updates the title and description of a specified video
 *
 * This function:
 * 1. Attempts to update video metadata in the database
 * 2. Validates the video exists
 * 3. Returns appropriate success/error status
 *
 * @param videoId - The unique identifier of the video to update
 * @param title - The new title for the video
 * @param description - The new description for the video
 *
 * @returns
 * - {status: 200, data: "Video successfully updated"} on successful update
 * - {status: 404, data: "Video not found"} if video doesn't exist
 * - {status: 400} on validation or database error
 *
 * @example
 * ```typescript
 * const result = await editVideoInfo(
 *   "video123",
 *   "My Updated Video Title",
 *   "New description for my video"
 * );
 *
 * if (result.status === 200) {
 *   console.log("Video updated successfully");
 * }
 * ```
 *
 * @throws Returns error status if database operation fails
 */
export const editVideoInfo = async (
  videoId: string,
  title: string,
  description: string
) => {
  try {
    const video = await client.video.update({
      where: { id: videoId },
      data: {
        title,
        description,
      },
    });
    if (video) return { status: 200, data: "Video successfully updated" };
    return { status: 404, data: "Video not found" };
  } catch (error) {
    return { status: 400 };
  }
};

/**
 * Moves a video to a different workspace and/or folder
 *
 * This function:
 * 1. Updates a video's location by changing its workspace and folder assignments
 * 2. Handles cases where the folder is optional (null folderId moves to workspace root)
 * 3. Validates the operation success
 *
 * @param videoId - The unique identifier of the video to move
 * @param workSpaceId - The destination workspace ID
 * @param folderId - The destination folder ID (optional - null moves to workspace root)
 *
 * @returns
 * - {status: 200, data: 'folder changed successfully'} on successful move
 * - {status: 404, data: 'workspace/folder not found'} if destination not found
 * - {status: 500, data: 'Oops! something went wrong'} on server error
 *
 * @example
 * ```typescript
 * // Move video to a specific folder in a workspace
 * const result = await moveVideoLocation(
 *   "video123",
 *   "workspace456",
 *   "folder789"
 * );
 *
 * // Move video to workspace root (no folder)
 * const result = await moveVideoLocation(
 *   "video123",
 *   "workspace456",
 *   null
 * );
 *
 * if (result.status === 200) {
 *   console.log("Video moved successfully");
 * }
 * ```
 *
 * @throws Returns error status object if database operation fails
 */

export const moveVideoLocation = async (
  videoId: string,
  workSpaceId: string,
  folderId: string
) => {
  try {
    const location = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        folderId: folderId || null,
        workSpaceId,
      },
    });
    if (location) return { status: 200, data: "folder changed successfully" };
    return { status: 404, data: "workspace/folder not found" };
  } catch (error) {
    return { status: 500, data: "Oops! something went wrong" };
  }
};




/**
* Gets preview details for a video, including user info and ownership status.
* Requires authenticated user. Returns video title, metadata, stats, and creator details.
* Also determines if requesting user is the video author.
* Returns:
* - {status: 404} if no user found or video not found
* - {status: 200, data: video, author: boolean} if successful
* - {status: 400} if query fails
*/
export const getPreviewVideo = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        createdAt: true,
        source: true,
        description: true,
        processing: true,
        views: true,
        summery: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
            clerkid: true,
            trial: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });
    if (video) {
      return {
        status: 200,
        data: video,
        author: user.id === video.User?.clerkid ? true : false,
      };
    }

    return { status: 404 };
  } catch (error) {
    return { status: 400 };
  }
};
