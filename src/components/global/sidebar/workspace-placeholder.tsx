import React from "react";

type Props = { children: React.ReactNode };

const WorkspacePlaceholder = ({ children }: Props) => {
  return (
    <span
      className="bg-zinc-200 dark:bg-zinc-700 
      flex items-center justify-center 
      w-8 px-2 h-7 rounded-sm 
      font-bold text-zinc-700 dark:text-zinc-300
      transition-colors duration-200
      group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600"
    >
      {children}
    </span>
  );
};

export default WorkspacePlaceholder;
