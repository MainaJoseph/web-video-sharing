import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const LandingPageNavBar = (props: Props) => {
  return (
    <div className="w-full border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex w-full justify-between items-center">
          <div className="text-3xl font-semibold flex items-center gap-x-3">
            <Menu className="w-8 h-8" />
            <Image alt="logo" src="/nova-logo.svg" width={40} height={40} />
            Nova
          </div>
          <div className="hidden gap-x-10 items-center lg:flex">
            <Link
              href="/"
              className="bg-blue-600 py-2 px-5 font-semibold text-lg rounded-full hover:bg-blue-700"
            >
              Home
            </Link>
            <Link href="/" className="hover:text-blue-600">
              Pricing
            </Link>
            <Link href="/" className="hover:text-blue-600">
              Contact
            </Link>
          </div>
          <Link href="/auth/sign-in">
            <Button className="text-base flex gap-x-2">
              <User fill="#000" />
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPageNavBar;
