import { onAuthenticateUser } from "@/actions/user";
import { verifyAccessToWorkspace } from "@/actions/workspace";
import { redirect } from "next/navigation";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    workspaceId: string;
  };
}

// Mark the component as an async Server Component
async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) {
  const auth = await onAuthenticateUser();
  if (!auth.user?.workspace) redirect("/auth/sign-in");
  if (!auth.user.workspace.length) redirect("/auth/sign-in");

  //check if user has rights to see this workspace
  const hasAccess = await verifyAccessToWorkspace(params.workspaceId);

  return <div>{children}</div>;
}

export default Layout;
