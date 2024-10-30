"use client";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import Loader from "../loader";
import FolderDuotone from "@/components/icons/folder-duotone";
import { useMutationData, useMutationDataState } from "@/hooks/useMutationData";
import { renameFolders } from "@/actions/workspace";
import { Input } from "@/components/ui/input";

type Props = {
  name: string;
  id: string;
  optimistic?: boolean;
  count?: number;
};

const Folder = ({ id, name, optimistic, count }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const folderCardRef = useRef<HTMLDivElement | null>(null);
  const pathName = usePathname();
  const router = useRouter();
  const [onRename, setOnRename] = useState(false);

  const Rename = () => setOnRename(true);
  const Renamed = () => setOnRename(false);

  const { mutate, isPending } = useMutationData(
    ["rename-folders"],
    (data: { name: string }) => renameFolders(id, data.name),
    "workspace-folders",
    Renamed
  );

  const { latestVariables } = useMutationDataState(["rename-folders"]);

  const handleFolderClick = () => {
    if (onRename) return;
    router.push(`${pathName}/folder/${id}`);
  };

  const handleNameDoubleClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation();
    Rename();
  };

  const updateFolderName = (e: React.FocusEvent<HTMLInputElement>) => {
    if (inputRef.current) {
      if (inputRef.current.value) {
        mutate({ name: inputRef.current.value, id });
      } else Renamed();
    }
  };

  return (
    <div
      onClick={handleFolderClick}
      ref={folderCardRef}
      className={cn(
        "flex items-center gap-2 justify-between min-w-[250px] py-4 px-4 rounded-lg",
        "border border-zinc-200 dark:border-zinc-800",
        "bg-white dark:bg-zinc-950",
        "hover:bg-zinc-50 dark:hover:bg-zinc-800/80",
        "transition duration-150 cursor-pointer",
        "group",
        optimistic && "opacity-60"
      )}
    >
      <Loader state={isPending}>
        <div className="flex flex-col gap-[1px]">
          {onRename ? (
            <Input
              onBlur={updateFolderName}
              autoFocus
              placeholder={name}
              className={cn(
                "border-none text-base w-full p-0",
                "bg-transparent",
                "text-zinc-700 dark:text-zinc-300",
                "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
                "focus-visible:ring-0 focus-visible:ring-offset-0"
              )}
              ref={inputRef}
            />
          ) : (
            <p
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={handleNameDoubleClick}
              className="text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
            >
              {latestVariables &&
              latestVariables.status === "pending" &&
              latestVariables.variables.id === id
                ? latestVariables.variables.name
                : name}
            </p>
          )}
          <span className="text-sm text-zinc-500 dark:text-zinc-500">
            {count || 0} videos
          </span>
        </div>
      </Loader>
      <div className="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400">
        <FolderDuotone />
      </div>
    </div>
  );
};

export default Folder;
