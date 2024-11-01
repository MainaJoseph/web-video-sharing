"use client";
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
import React from "react";
import Modal from "../modal";
import { Menu, PlusCircle } from "lucide-react";
import Search from "../search";
import { MENU_ITEMS } from "@/constants";
import SidebarItem from "./sidebar-item";
import { getNotifications } from "@/actions/user";
import { useQueryData } from "@/hooks/useQueryData";
import WorkspacePlaceholder from "./workspace-placeholder";
import GlobalCard from "../global-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import InfoBar from "../info-bar";
import { useDispatch } from "react-redux";
import { WORKSPACES } from "@/redux/slices/workspaces";
import PaymentButton from "../payment-button";
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

  const WorkspacesSection = () => {
    if (workspace.subscription?.plan === "FREE") {
      return (
        <>
          <p className="w-full text-zinc-500 dark:text-zinc-400 font-bold mt-4">
            Workspaces
          </p>
          <GlobalCard
            title="Upgrade to Pro"
            description="Unlock AI features like transcription, AI summary, and more."
            footer={<PaymentButton />}
          />
        </>
      );
    }

    return (
      <>
        <p className="w-full text-zinc-500 dark:text-zinc-400 font-bold mt-4">
          Workspaces
        </p>
        {workspace.workspace.length === 1 && workspace.members.length === 0 && (
          <div className="w-full mt-[-10px]">
            <p className="text-zinc-400 dark:text-zinc-600 font-medium text-sm">
              No Workspaces
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
      </>
    );
  };

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
        <p className="text-2xl">Nova</p>
      </div>
      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={onChangeActiveWorkspace}
      >
        <SelectTrigger className="mt-16 text-neutral-400 bg-transparent">
          <SelectValue placeholder="Select a workspace"></SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspace.workspace.map((workspace) => (
              <SelectItem value={workspace.id} key={workspace.id}>
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
                    >
                      {workspace.WorkSpace.name}
                    </SelectItem>
                  )
              )}
          </SelectGroup>
        </SelectContent>
      </Select>
      {currentWorkspace?.type === "PUBLIC" &&
        workspace.subscription?.plan === "PRO" && (
          <Modal
            trigger={
              <span
                className="text-sm cursor-pointer flex items-center justify-center 
  bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/90 dark:hover:bg-zinc-800/60 
  w-full rounded-sm p-[5px] gap-2"
              >
                <PlusCircle
                  size={15}
                  className="text-zinc-600 dark:text-zinc-400 fill-zinc-400 dark:fill-zinc-500"
                />
                <span className="text-zinc-600 dark:text-zinc-400 font-semibold text-xs">
                  Invite To Workspace
                </span>
              </span>
            }
            title="Invite To Workspace"
            description="Invite other users to your workspace"
          >
            <Search workspaceId={activeWorkspaceId} />
          </Modal>
        )}
      <p className="w-full text-[#9D9D9D] font-bold mt-4">Menu</p>
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
                (item.title === "Notifications" &&
                  count._count &&
                  count._count.notification) ||
                0
              }
            />
          ))}
        </ul>
      </nav>
      <Separator className="w-4/5 bg-zinc-200 dark:bg-zinc-800" />

      <WorkspacesSection />

      <Separator className="w-4/5 bg-zinc-200 dark:bg-zinc-800" />
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
