import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

type Props = {
  triggers: string[];
  children: React.ReactNode;
  defaultValue: string;
};

const TabMenu = ({ children, defaultValue, triggers }: Props) => {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="flex justify-start bg-transparent">
        {triggers.map((trigger) => (
          <TabsTrigger
            key={trigger}
            value={trigger}
            className="capitalize text-base 
              text-zinc-500 dark:text-zinc-400
              data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800/80
              data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100"
          >
            {trigger}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
};

export default TabMenu;
