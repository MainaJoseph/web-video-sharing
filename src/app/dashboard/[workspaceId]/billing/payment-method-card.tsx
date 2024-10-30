"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { CreditCard, Plus } from "lucide-react";
import AddCardDialog from "./add-card-dialogue";

const PaymentMethodSection = () => {
  const handleAddCardClick = () => {
    const addCardButton = document.querySelector(
      '[aria-label="Add Payment Method"]'
    );
    if (addCardButton instanceof HTMLElement) {
      addCardButton.click();
    }
  };

  return (
    <CardContent className="p-6">
      <div className="space-y-4">
        {/* Example saved card */}
        <div
          className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 
          hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  •••• •••• •••• 4242
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Expires 12/24
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 
                border border-zinc-200 dark:border-zinc-700"
            >
              Default
            </Badge>
          </div>
        </div>

        {/* Add new card placeholder */}
        <div
          onClick={handleAddCardClick}
          className="p-4 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 
            hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
        >
          <div className="flex flex-col items-center justify-center py-4">
            <div
              className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800/50 
              flex items-center justify-center 
              group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700/50 
              transition-colors"
            >
              <Plus className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            </div>
            <p
              className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 
              group-hover:text-zinc-900 dark:group-hover:text-zinc-300"
            >
              Add a new payment method
            </p>
          </div>
        </div>

        {/* Add Card Dialog Component */}
        <AddCardDialog />
      </div>
    </CardContent>
  );
};

export default PaymentMethodSection;
