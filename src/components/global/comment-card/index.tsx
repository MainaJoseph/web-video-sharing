"use client";
import CommentForm from "@/components/forms/comment-form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CommentRepliesProps } from "@/types/index.type";
import { Dot, DotIcon } from "lucide-react";
import React, { useState } from "react";

type Props = {
  comment: string;
  author: { image: string; firstname: string; lastname: string };
  videoId: string;
  commentId?: string;
  reply: CommentRepliesProps[];
  isReply?: boolean;
  createdAt: Date;
};

const CommentCard = ({
  author,
  comment,
  reply,
  videoId,
  commentId,
  isReply,
  createdAt,
}: Props) => {
  const [onReply, setOnReply] = useState<boolean>(false);
  const daysAgo = Math.floor(
    (new Date().getTime() - createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );

  return (
    <Card
      className={cn(
        isReply
          ? "bg-white dark:bg-zinc-900 pl-10 border-none shadow-none"
          : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-none",
        "relative"
      )}
    >
      <div className="flex gap-x-2 items-center">
        <Avatar>
          <AvatarImage src={author.image} alt="author" />
        </Avatar>
        <p className="capitalize text-sm text-zinc-700 dark:text-zinc-300 flex">
          {author.firstname} {author.lastname}{" "}
          <div className="flex items-center gap-[0]">
            <DotIcon className="text-zinc-500 dark:text-zinc-500" />
            <span className="text-zinc-500 dark:text-zinc-500 text-xs ml-[-6px]">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </span>
          </div>
        </p>
      </div>
      <div>
        <p className="text-zinc-700 dark:text-zinc-300">{comment}</p>
      </div>
      {!isReply && (
        <div className="flex justify-end mt-3">
          {!onReply ? (
            <Button
              onClick={() => setOnReply(true)}
              className="text-sm rounded-full bg-zinc-100 dark:bg-zinc-800 
                text-zinc-900 dark:text-zinc-100 
                hover:bg-zinc-200 dark:hover:bg-zinc-700
                hover:text-zinc-900 dark:hover:text-zinc-100 
                absolute z-[1] top-8"
            >
              Reply
            </Button>
          ) : (
            <CommentForm
              close={() => setOnReply(false)}
              videoId={videoId}
              commentId={commentId}
              author={author.firstname + " " + author.lastname}
            />
          )}
        </div>
      )}
      {reply.length > 0 && (
        <div className="flex flex-col gap-y-10 mt-5 border-l-2 border-zinc-200 dark:border-zinc-800">
          {reply.map((r) => (
            <CommentCard
              isReply
              reply={[]}
              comment={r.comment}
              commentId={r.commentId!}
              videoId={videoId}
              key={r.id}
              author={{
                image: r.User?.image!,
                firstname: r.User?.firstname!,
                lastname: r.User?.lastname!,
              }}
              createdAt={r.createdAt}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CommentCard;
