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
