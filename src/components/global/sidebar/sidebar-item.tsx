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
          "hover:bg-zinc-100 dark:hover:bg-zinc-800/80",
          selected ? "bg-zinc-100 dark:bg-zinc-800/80" : ""
        )}
      >
        <div className="flex items-center gap-2 transition-all p-[5px] cursor-pointer">
          {icon}
          <span
            className={cn(
              "font-medium transition-all truncate w-32",
              "group-hover:text-zinc-900 dark:group-hover:text-zinc-300",
              selected
                ? "text-zinc-900 dark:text-zinc-300"
                : "text-zinc-500 dark:text-zinc-600"
            )}
          >
            {title}
          </span>
        </div>
        {}
      </Link>
    </li>
  );
};

export default SidebarItem;
