"use client";
import FolderDuotone from "@/components/icons/folder-duotone";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import React from "react";
import Folder from "./folder";
import { useQueryData } from "@/hooks/useQueryData";
import { getWorkspaceFolders } from "@/actions/workspace";
import { useMutationDataState } from "@/hooks/useMutationData";
import Videos from "../videos";
import { useDispatch } from "react-redux";
import { FOLDERS } from "@/redux/slices/folders";

type Props = {
  workspaceId: string;
};

export type FoldersProps = {
  status: number;
  data: ({
    _count: {
      videos: number;
    };
  } & {
    id: string;
    name: string;
    createdAt: Date;
    workSpaceId: string | null;
  })[];
};

const Folders = ({ workspaceId }: Props) => {
  const dispatch = useDispatch();

  const { data, isFetched } = useQueryData(["workspace-folders"], () =>
    getWorkspaceFolders(workspaceId)
  );

  const { latestVariables } = useMutationDataState(["create-folder"]);

  const { status, data: folders } = data as FoldersProps;

  if (isFetched && folders) {
    dispatch(FOLDERS({ folders: folders }));
  }

  return (
    <div className="flex flex-col gap-4" suppressHydrationWarning>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-zinc-400 dark:text-zinc-500">
            <FolderDuotone />
          </div>
          <h2 className="text-xl font-medium text-zinc-700 dark:text-zinc-300">
            Folders
          </h2>
        </div>
        <div className="flex items-center gap-2 group cursor-pointer">
          <p className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
            See all
          </p>
          <ArrowRight className="h-4 w-4 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-4 overflow-x-auto w-full",
          "scrollbar-thin scrollbar-track-transparent",
          "scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800",
          status !== 200 && "justify-center"
        )}
      >
        {status !== 200 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            No folders in workspace
          </p>
        ) : (
          <>
            {latestVariables && latestVariables.status === "pending" && (
              <Folder
                name={latestVariables.variables.name}
                id={latestVariables.variables.id}
                optimistic
              />
            )}
            {folders.map((folder) => (
              <Folder
                name={folder.name}
                count={folder._count.videos}
                id={folder.id}
                key={folder.id}
              />
            ))}
          </>
        )}
      </div>

      <Videos
        workspaceId={workspaceId}
        folderId={workspaceId}
        videosKey="user-videos"
      />
    </div>
  );
};

export default Folders;
