import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const LandingPageNavBar = (props: Props) => {
  return (
    <div
      className="w-full border-b border-zinc-200 dark:border-zinc-800 
      bg-white dark:bg-zinc-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex w-full justify-between items-center">
          <div
            className="text-3xl font-semibold flex items-center gap-x-3 
            text-zinc-900 dark:text-zinc-100"
          >
            <Menu className="w-8 h-8" />
            <Image alt="logo" src="/nova-logo.svg" width={40} height={40} />
            Nova
          </div>
          <div className="hidden gap-x-10 items-center lg:flex">
            <Link
              href="/"
              className="bg-blue-600 dark:bg-blue-700 py-2 px-5 font-semibold text-lg 
                rounded-full text-white
                hover:bg-blue-700 dark:hover:bg-blue-600 
                transition-colors"
            >
              Home
            </Link>
            <Link
              href="/"
              className="text-zinc-700 dark:text-zinc-300 
                hover:text-blue-600 dark:hover:text-blue-500
                transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/"
              className="text-zinc-700 dark:text-zinc-300 
                hover:text-blue-600 dark:hover:text-blue-500
                transition-colors"
            >
              Contact
            </Link>
          </div>
          <Link href="/auth/sign-in">
            <Button
              className="text-base flex gap-x-2 bg-zinc-900 dark:bg-zinc-100 
              hover:bg-zinc-800 dark:hover:bg-zinc-200
              text-white dark:text-zinc-900"
            >
              <User className="text-current" />
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPageNavBar;
