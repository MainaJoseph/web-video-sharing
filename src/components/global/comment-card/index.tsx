import React, { useState, useTransition } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CommentRepliesProps } from "@/types/index.type";
import { DotIcon, Edit2, Loader2 } from "lucide-react";
import CommentForm from "@/components/forms/comment-form";
import { Badge } from "@/components/ui/badge";
import { editComment } from "@/actions/user";

type Props = {
  comment: string;
  author: { image: string; firstname: string; lastname: string; id?: string };
  videoId: string;
  commentId?: string;
  reply: CommentRepliesProps[];
  isReply?: boolean;
  createdAt: Date;
  isEdited?: boolean;
  currentUserId?: string;
};

const CommentCard = ({
  author,
  comment: initialComment,
  reply,
  videoId,
  commentId,
  isReply,
  createdAt,
  isEdited: initialIsEdited = false,
  currentUserId,
}: Props) => {
  const [onReply, setOnReply] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedComment, setEditedComment] = useState(initialComment);
  const [isPending, startTransition] = useTransition();
  const [localComment, setLocalComment] = useState(initialComment);
  const [localIsEdited, setLocalIsEdited] = useState(initialIsEdited);
  const showEditedBadge = localIsEdited || initialIsEdited;

  const daysAgo = Math.floor(
    (new Date().getTime() - createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );

  const isAuthor = currentUserId === author.id;

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentId) return;

    setLocalComment(editedComment);
    setLocalIsEdited(true);

    startTransition(async () => {
      try {
        const result = await editComment(commentId, editedComment);
        if (result.status === 200) {
          setIsEditing(false);
        } else {
          setLocalComment(initialComment);
          setLocalIsEdited(initialIsEdited);
        }
      } catch (error) {
        console.error("Error updating comment:", error);
        setLocalComment(initialComment);
        setLocalIsEdited(initialIsEdited);
      }
    });
  };

  return (
    <Card
      className={cn(
        isReply
          ? "bg-white dark:bg-zinc-900 pl-10 border-none shadow-none"
          : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-none",
        "relative group"
      )}
    >
      <div className="flex gap-x-2 items-center">
        <Avatar>
          <AvatarImage src={author.image} alt="author" />
        </Avatar>
        <div className="flex items-center gap-2">
          <p className="capitalize text-sm text-zinc-700 dark:text-zinc-300 flex">
            {author.firstname} {author.lastname}
          </p>
          <div className="flex items-center">
            <DotIcon className="text-zinc-500 dark:text-zinc-500" size={16} />
            <span className="text-zinc-500 dark:text-zinc-500 text-xs">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </span>
          </div>
          {showEditedBadge && ( // Use the combined condition here
            <Badge variant="secondary" className="text-xs h-5">
              edited
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-2">
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="relative">
            <textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="w-full p-2 text-sm rounded-md border border-zinc-200 
                dark:border-zinc-700 bg-transparent focus:outline-none 
                focus:ring-2 focus:ring-blue-500 dark:text-zinc-300"
              rows={3}
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditedComment(localComment);
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isPending || editedComment.trim() === localComment}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="relative">
            <p className="text-zinc-700 dark:text-zinc-300 pr-8">
              {localComment}
            </p>
            {isAuthor && (
              <Button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity 
                  absolute top-0 right-0 p-1 h-auto bg-transparent hover:bg-transparent"
              >
                <Edit2
                  className="text-zinc-400 hover:text-zinc-600 
                    dark:text-zinc-500 dark:hover:text-zinc-300"
                  size={14}
                />
              </Button>
            )}
          </div>
        )}
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
              commentId={r.id}
              videoId={videoId}
              key={r.id}
              author={{
                id: r.User?.id,
                image: r.User?.image!,
                firstname: r.User?.firstname!,
                lastname: r.User?.lastname!,
              }}
              createdAt={r.createdAt}
              currentUserId={currentUserId}
              isEdited={r.isEdited}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default CommentCard;
