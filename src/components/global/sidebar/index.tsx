"use client";

import React from "react";
import { getWorkSpaces } from "@/actions/workspace";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { NotificationProps, WorkspaceProps } from "@/types/index.type";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Modal from "../modal";
import { Menu, PlusCircle } from "lucide-react";
import Search from "../search";
import { MENU_ITEMS } from "@/constants";
import SidebarItem from "./sidebar-item";
import { getNotifications } from "@/actions/user";
import { useQueryData } from "@/hooks/useQueryData";
import WorkspacePlaceholder from "./workspace-placeholder";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDispatch } from "react-redux";
import GlobalCard from "../global-card";
import PaymentButton from "../payment-button";
import InfoBar from "../info-bar";
import { WORKSPACES } from "@/redux/slices/workspaces";

type Props = {
  activeWorkspaceId: string;
};

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useDispatch();

  const { data, isFetched } = useQueryData(["user-workspaces"], getWorkSpaces);
  const menuItems = MENU_ITEMS(activeWorkspaceId);

  const { data: notifications } = useQueryData(
    ["user-notifications"],
    getNotifications
  );

  const { data: workspace } = data as WorkspaceProps;
  const { data: count } = notifications as NotificationProps;

  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`);
  };

  const currentWorkspace = workspace.workspace.find(
    (s) => s.id === activeWorkspaceId
  );

  if (isFetched && workspace) {
    dispatch(WORKSPACES({ workspaces: workspace.workspace }));
  }

  const SidebarSection = (
    <div
      className="bg-white dark:bg-zinc-950 flex-none relative p-4 h-full w-[250px] 
      flex flex-col gap-4 items-center overflow-hidden border-r border-zinc-200 dark:border-zinc-800"
    >
      <div
        className="bg-white dark:bg-zinc-950 p-4 flex gap-2 justify-center items-center mb-4 
        absolute top-0 left-0 right-0 border-b border-zinc-200 dark:border-zinc-800"
      >
        <Image src="/nova-logo.svg" height={40} width={40} alt="logo" />
        <p className="text-2xl text-zinc-900 dark:text-white">Nova</p>
      </div>

      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={onChangeActiveWorkspace}
      >
        <SelectTrigger
          className="mt-16 text-zinc-600 dark:text-zinc-400 bg-transparent 
          border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          <SelectValue placeholder="Select a workspace" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
          <SelectGroup>
            <SelectLabel className="text-zinc-900 dark:text-zinc-100">
              Workspaces
            </SelectLabel>
            <Separator className="bg-zinc-200 dark:bg-zinc-800" />
            {workspace.workspace.map((workspace) => (
              <SelectItem
                value={workspace.id}
                key={workspace.id}
                className="text-zinc-700 dark:text-zinc-300 focus:bg-zinc-100 dark:focus:bg-zinc-900"
              >
                {workspace.name}
              </SelectItem>
            ))}
            {workspace.members.length > 0 &&
              workspace.members.map(
                (workspace) =>
                  workspace.WorkSpace && (
                    <SelectItem
                      value={workspace.WorkSpace.id}
                      key={workspace.WorkSpace.id}
                      className="text-zinc-700 dark:text-zinc-300 focus:bg-zinc-100 dark:focus:bg-zinc-900"
                    >
                      {workspace.WorkSpace.name}
                    </SelectItem>
                  )
              )}
          </SelectGroup>
        </SelectContent>
      </Select>

      <p className="w-full text-zinc-500 dark:text-zinc-400 font-bold mt-4">
        Menu
      </p>
      <nav className="w-full">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem
              href={item.href}
              icon={item.icon}
              selected={pathName === item.href}
              title={item.title}
              key={item.title}
              notifications={
                item.title === "Notifications" &&
                count?._count?.notification > 0
                  ? count._count.notification
                  : undefined
              }
            />
          ))}
        </ul>
      </nav>

      <Separator className="w-4/5 bg-zinc-200 dark:bg-zinc-800" />

      <p className="w-full text-zinc-500 dark:text-zinc-400 font-bold mt-4">
        Workspaces
      </p>

      {workspace.workspace.length === 1 && workspace.members.length === 0 && (
        <div className="w-full mt-[-10px]">
          <p className="text-zinc-400 dark:text-zinc-600 font-medium text-sm">
            {workspace.subscription?.plan === "FREE"
              ? "Upgrade to create workspaces"
              : "No Workspaces"}
          </p>
        </div>
      )}

      <nav className="w-full">
        <ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer">
          {workspace.workspace.length > 0 &&
            workspace.workspace.map(
              (item) =>
                item.type !== "PERSONAL" && (
                  <SidebarItem
                    href={`/dashboard/${item.id}`}
                    selected={pathName === `/dashboard/${item.id}`}
                    title={item.name}
                    notifications={undefined}
                    key={item.name}
                    icon={
                      <WorkspacePlaceholder>
                        {item.name.charAt(0)}
                      </WorkspacePlaceholder>
                    }
                  />
                )
            )}
          {workspace.members.length > 0 &&
            workspace.members.map((item) => (
              <SidebarItem
                href={`/dashboard/${item.WorkSpace.id}`}
                selected={pathName === `/dashboard/${item.WorkSpace.id}`}
                title={item.WorkSpace.name}
                notifications={undefined}
                key={item.WorkSpace.name}
                icon={
                  <WorkspacePlaceholder>
                    {item.WorkSpace.name.charAt(0)}
                  </WorkspacePlaceholder>
                }
              />
            ))}
        </ul>
      </nav>

      <Separator className="w-4/5 bg-zinc-200 dark:bg-zinc-800" />

      {workspace.subscription?.plan === "FREE" && (
        <GlobalCard
          title="Upgrade to Pro"
          description="Unlock AI features like transcription, AI summary, and more."
          footer={<PaymentButton />}
        />
      )}
    </div>
  );

  return (
    <div className="full">
      <InfoBar />
      <div className="md:hidden fixed my-4">
        <Sheet>
          <SheetTrigger asChild className="ml-2">
            <Button
              variant="ghost"
              className="mt-[2px] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-fit h-full">
            {SidebarSection}
          </SheetContent>
        </Sheet>
      </div>
      <div className="md:block hidden h-full">{SidebarSection}</div>
    </div>
  );
};

export default Sidebar;
