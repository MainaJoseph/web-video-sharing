import React from "react";
import { useMutationData } from "@/hooks/useMutationData";
import { useSearch } from "@/hooks/useSearch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { inviteMembers } from "@/actions/user";
import Loader from "../loader";

type Props = {
  workspaceId: string;
};

const Search = ({ workspaceId }: Props) => {
  const { query, onSearchQuery, isFetching, onUsers } = useSearch(
    "get-users",
    "USERS"
  );

  //Wire up invite users
  const { mutate, isPending } = useMutationData(
    ["invite-member"],
    (data: { recieverId: string; email: string }) =>
      inviteMembers(workspaceId, data.recieverId, data.email)
  );

  return (
    <div className="flex flex-col gap-y-5">
      <Input
        onChange={onSearchQuery}
        value={query}
        className="bg-transparent border-2 border-zinc-200 dark:border-zinc-800 outline-none
          text-zinc-900 dark:text-zinc-100"
        placeholder="Search for your user..."
        type="text"
      />

      {isFetching ? (
        <div className="flex flex-col gap-y-2">
          <Skeleton className="w-full h-8 rounded-xl" />
        </div>
      ) : !onUsers ? (
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          No Users Found
        </p>
      ) : (
        <div>
          {onUsers.map((user) => (
            <div
              key={user.id}
              className="flex gap-x-3 items-center border-2 border-zinc-200 dark:border-zinc-800 w-full p-3 rounded-xl"
            >
              <Avatar>
                <AvatarImage src={user.image as string} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <h3 className="text-bold text-lg capitalize text-zinc-900 dark:text-zinc-100">
                  {user.firstname} {user.lastname}
                </h3>
                <p className="lowercase text-xs bg-white dark:bg-zinc-900 px-2 rounded-lg text-zinc-900 dark:text-zinc-100">
                  {user.subscription?.plan}
                </p>
              </div>
              <div className="flex-1 flex justify-end items-center">
                <Button
                  onClick={() =>
                    mutate({ recieverId: user.id, email: user.email })
                  }
                  variant={"default"}
                  className="w-5/12 font-bold"
                >
                  <Loader state={isPending} color="#000">
                    Invite
                  </Loader>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
