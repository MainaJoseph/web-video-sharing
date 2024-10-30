// components/billing/payment-method-section.tsx
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { CreditCard, Plus } from "lucide-react";
import AddCardDialog from "./add-card-dialogue"

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
    <CardContent>
      <div className="space-y-4">
        {/* Example saved card */}
        <div className="p-4 rounded-lg border border-zinc-800 hover:bg-zinc-800/50 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-white">•••• •••• •••• 4242</p>
                <p className="text-sm text-zinc-400">Expires 12/24</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
              Default
            </Badge>
          </div>
        </div>

        {/* Add new card placeholder */}
        <div
          onClick={handleAddCardClick}
          className="p-4 rounded-lg border border-dashed border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer group"
        >
          <div className="flex flex-col items-center justify-center py-4">
            <div className="h-10 w-10 rounded-full bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-700/50">
              <Plus className="h-5 w-5 text-zinc-400" />
            </div>
            <p className="mt-2 text-sm font-medium text-zinc-400">
              Add a new payment method
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default PaymentMethodSection;
