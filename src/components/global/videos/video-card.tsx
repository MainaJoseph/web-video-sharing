"use client";
import React from "react";
import Loader from "../loader";
import CardMenu from "./video-card-menu";
import ChangeVideoLocation from "@/components/forms/change-video-location";
import CopyLink from "./copy-link";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot, Share2, User } from "lucide-react";

type Props = {
  User: {
    firstname: string | null;
    lastname: string | null;
    image: string | null;
  } | null;
  id: string;
  Folder: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  title: string | null;
  source: string;
  processing: boolean;
  workspaceId: string;
};

const VideoCard = (props: Props) => {
  const daysAgo = Math.floor(
    (new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000)
  );

  return (
    <Loader
      className="bg-white dark:bg-zinc-900 flex justify-center items-center border border-zinc-200 dark:border-zinc-800 rounded-xl"
      state={props.processing}
    >
      <div className="group overflow-hidden cursor-pointer bg-white dark:bg-zinc-900 relative border border-zinc-200 dark:border-zinc-800 flex flex-col rounded-xl">
        <div className="absolute top-3 right-3 z-50 gap-x-3 hidden group-hover:flex">
          <CardMenu
            currentFolderName={props.Folder?.name}
            videoId={props.id}
            currentWorkspace={props.workspaceId}
            currentFolder={props.Folder?.id}
          />
          <CopyLink
            className="p-[5px] h-5 hover:bg-transparent bg-zinc-100 dark:bg-zinc-800"
            videoId={props.id}
          />
        </div>
        <Link
          href={`/dashboard/${props.workspaceId}/video/${props.id}`}
          className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition duration-150 flex flex-col justify-between h-full"
        >
          <video
            controls={false}
            preload="metadata"
            className="w-full aspect-video opacity-50 z-20"
          >
            <source
              src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}#t=1`}
            />
          </video>
          <div className="px-5 py-3 flex flex-col gap-7-2 z-20">
            <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              {props.title}
            </h2>
            <div className="flex gap-x-2 items-center mt-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={props.User?.image as string} />
                <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800">
                  <User className="text-zinc-500 dark:text-zinc-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="capitalize text-xs text-zinc-700 dark:text-zinc-300">
                  {props.User?.firstname} {props.User?.lastname}
                </p>
                <p className="text-zinc-500 dark:text-zinc-500 text-xs flex items-center">
                  <Dot /> {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <span className="flex gap-x-1 items-center">
                <Share2
                  fill="rgb(161 161 170)"
                  className="text-zinc-400 dark:text-zinc-500"
                  size={12}
                />
                <p className="text-xs text-zinc-400 dark:text-zinc-500 capitalize">
                  {props.User?.firstname}'s Workspace
                </p>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </Loader>
  );
};

export default VideoCard;
