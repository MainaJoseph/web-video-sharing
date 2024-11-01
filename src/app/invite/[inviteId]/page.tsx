import { acceptInvite } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    inviteId: string;
  };
};

const Page = async ({ params: { inviteId } }: Props) => {
  const invite = await acceptInvite(inviteId);

  if (invite.status === 404) {
    if (invite.message === "Invitation not found") {
      return (
        <div className="h-screen container flex flex-col gap-y-2 justify-center items-center">
          <h2 className="text-6xl font-bold text-white">
            Invitation Not Found
          </h2>
          <p>This invitation doesn't exist or has been removed</p>
        </div>
      );
    }
    return redirect("/auth/sign-in");
  }

  if (invite?.status === 401) {
    return (
      <div className="h-screen container flex flex-col gap-y-2 justify-center items-center">
        <h2 className="text-6xl font-bold text-white">Not Authorized</h2>
        <p>You are not authorized to accept this invite</p>
      </div>
    );
  }

  if (invite?.status === 400) {
    return (
      <div className="h-screen container flex flex-col gap-y-2 justify-center items-center">
        <h2 className="text-6xl font-bold text-white">Already Accepted</h2>
        <p>{invite.message || "This invitation cannot be accepted"}</p>
      </div>
    );
  }

  if (invite?.status === 200) return redirect("/auth/callback");
};

export default Page;
