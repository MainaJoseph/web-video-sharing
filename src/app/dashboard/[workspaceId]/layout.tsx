import { onAuthenticateUser } from "@/actions/user";
import { verifyAccessToWorkspace } from "@/actions/workspace";
import { redirect } from "next/navigation";
import React from "react";

type LayoutProps = {
  params: { workspaceId: string };
  children: React.ReactNode;
};

// Remove the async from the component definition
const Layout = ({ params: { workspaceId }, children }: LayoutProps) => {
  // Move the async logic into a separate function
  const initializeLayout = async () => {
    const auth = await onAuthenticateUser();
    if (!auth.user?.workspace) redirect("/auth/sign-in");
    if (!auth.user.workspace.length) redirect("/auth/sign-in");

    //check if user has rights to see this workspace
    const hasAccess = await verifyAccessToWorkspace(workspaceId);
    return hasAccess;
  };

  // Use this to initialize the component
  initializeLayout();

  return <div>{children}</div>;
};

export default Layout;
