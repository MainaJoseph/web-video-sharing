import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  href: string;
  selected: boolean;
  notifications?: number;
};

const SidebarItem = ({ href, icon, selected, title, notifications }: Props) => {
  return (
    <li className="cursor-pointer my-[5px]">
      <Link
        href={href}
        className={cn(
          "flex items-center justify-between group rounded-lg",
          "transition-colors duration-200",
          "hover:bg-zinc-100 dark:hover:bg-zinc-800/80",
          selected ? "bg-zinc-100 dark:bg-zinc-800/80" : "bg-transparent"
        )}
      >
        <div className="flex items-center gap-2 p-[5px] cursor-pointer">
          <span
            className={cn(
              "transition-colors duration-200",
              selected
                ? "text-zinc-900 dark:text-zinc-300"
                : "text-zinc-500 dark:text-zinc-600"
            )}
          >
            {icon}
          </span>
          <span
            className={cn(
              "font-medium truncate w-32 transition-colors duration-200",
              "group-hover:text-zinc-900 dark:group-hover:text-zinc-300",
              selected
                ? "text-zinc-900 dark:text-zinc-300"
                : "text-zinc-500 dark:text-zinc-600"
            )}
          >
            {title}
          </span>
        </div>
        {notifications && notifications > 0 && (
          <div className="mr-2">
            <span
              className={cn(
                "bg-primary/10 text-primary",
                "px-2 py-0.5 rounded-full text-xs font-medium",
                "transition-colors duration-200"
              )}
            >
              {notifications}
            </span>
          </div>
        )}
      </Link>
    </li>
  );
};

export default SidebarItem;
