import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMoveVideos } from "@/hooks/useFolders";
import Loader from "@/components/global/loader";

type Props = {
  videoId: string;
  currentFolder?: string;
  currentWorkSpace?: string;
  currentFolderName?: string;
};

const ChangeVideoLocation = ({
  videoId,
  currentFolder,
  currentWorkSpace,
}: Props) => {
  const {
    register,
    isPending,
    onFormSubmit,
    folders,
    workspaces,
    isFetching,
    isFolders,
  } = useMoveVideos(videoId, currentWorkSpace!);

  const folder = folders.find((f) => f.id === currentFolder);
  const workspace = workspaces.find((f) => f.id === currentWorkSpace);

  return (
    <form className="flex flex-col gap-y-5" onSubmit={onFormSubmit}>
      <div className="rounded-xl p-5 border">
        <h2 className="text-xs text-muted-foreground">Current Workspace</h2>
        {workspace && <p>{workspace.name}</p>}
        <h2 className="text-xs text-muted-foreground mt-4">Current Folder</h2>
        {folder ? <p>{folder.name}</p> : "This video has no folder"}
      </div>

      <Separator />

      <div className="flex flex-col gap-y-5 p-5 border rounded-xl">
        <h2 className="text-xs text-muted-foreground">To</h2>

        <div className="space-y-2">
          <Label>Workspace</Label>
          <Select {...register("workspace_id")}>
            <SelectTrigger>
              <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((space) => (
                <SelectItem key={space.id} value={space.id}>
                  {space.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isFetching ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="space-y-2">
            <Label>Folders in this workspace</Label>
            {isFolders && isFolders.length > 0 ? (
              <Select {...register("folder_id")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {isFolders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">
                This workspace has no folders
              </p>
            )}
          </div>
        )}
      </div>

      <Button type="submit">
        <Loader state={isPending} color="#000">
          Transfer
        </Loader>
      </Button>
    </form>
  );
};

export default ChangeVideoLocation;
