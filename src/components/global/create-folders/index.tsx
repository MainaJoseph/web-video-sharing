"use client";
import FolderPlusDuotine from "@/components/icons/folder-plus-duotone";
import { Button } from "@/components/ui/button";
import { useCreateFolders } from "@/hooks/useCreateFolders";
import React from "react";

type Props = {
  workspaceId: string;
};

const CreateFolders = ({ workspaceId }: Props) => {
  const { onCreateNewFolder } = useCreateFolders(workspaceId);

  return (
    <Button
      onClick={onCreateNewFolder}
      className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80
        text-zinc-600 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300
        border border-zinc-200 dark:border-zinc-800
        flex items-center gap-2 py-6 px-4 rounded-2xl
        transition-all duration-200 group"
    >
      <span
        className="text-zinc-400 dark:text-zinc-600 
        group-hover:text-zinc-500 dark:group-hover:text-zinc-400
        transition-colors duration-200"
      >
        <FolderPlusDuotine />
      </span>
      <span className="font-medium">Create A folder</span>
    </Button>
  );
};

export default CreateFolders;
