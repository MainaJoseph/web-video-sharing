"use client";
import FormGenerator from "@/components/global/form-generator";
import Loader from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { useVideoComment } from "@/hooks/useVideo";
import { Send, X } from "lucide-react";
import React from "react";

type Props = {
  videoId: string;
  commentId?: string;
  author: string;
  close?: () => void;
};

const CommentForm = ({ author, videoId, close, commentId }: Props) => {
  const { errors, isPending, onFormSubmit, register } = useVideoComment(
    videoId,
    commentId
  );

  return (
    <form className="relative w-full" onSubmit={onFormSubmit}>
      <FormGenerator
        register={register}
        errors={errors}
        placeholder={`Respond to ${author}...`}
        name="comment"
        inputType="input"
        lines={8}
        type="text"
      />
      <Button
        className="p-0 bg-transparent absolute top-[1px] right-3 
          hover:bg-transparent"
        type="submit"
      >
        <Loader state={isPending}>
          <Send
            className="text-zinc-400 dark:text-zinc-500 
              hover:text-zinc-600 dark:hover:text-zinc-300
              transition-colors"
            size={18}
          />
        </Loader>
      </Button>
    </form>
  );
};

export default CommentForm;
