import React from "react";

type Props = { children: React.ReactNode };

const WorkspacePlaceholder = ({ children }: Props) => {
  return (
    <span
      className="bg-zinc-300 dark:bg-zinc-600 
      flex items-center font-bold justify-center 
      w-8 px-2 h-7 rounded-sm 
      text-zinc-700 dark:text-zinc-900"
    >
      {children}
    </span>
  );
};

export default WorkspacePlaceholder;
