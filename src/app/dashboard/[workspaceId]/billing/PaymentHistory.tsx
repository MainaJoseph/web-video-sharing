"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Receipt, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

import { syncStripePaymentHistory } from "@/actions/workspace";
import { useToast } from "@/hooks/use-toast";
import { BillingData } from "@/types/index.type";

interface PaymentHistoryProps {
  data: BillingData | null;
  isPro: boolean;
}

const safeDateFormat = (date: Date | null | undefined): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function PaymentHistory({ data, isPro }: PaymentHistoryProps) {
  const { toast } = useToast();

  const handleSyncPayments = async () => {
    try {
      const result = await syncStripePaymentHistory();
      if (result.status === 200) {
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Failed to sync payment history",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync payment history",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-black border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
              Payment History
            </CardTitle>
          </div>
          {isPro && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncPayments}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Sync
            </Button>
          )}
        </div>
        <CardDescription className="text-zinc-500 dark:text-zinc-400">
          Your recent billing transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[640px] pr-4">
          <div className="space-y-4">
            {data?.paymentHistory && data.paymentHistory.length > 0 ? (
              data.paymentHistory.map((payment, index) => (
                <div key={payment.id}>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center
                          ${
                            payment.status === "succeeded"
                              ? "bg-emerald-500/10"
                              : "bg-red-500/10"
                          }`}
                      >
                        {payment.status === "succeeded" ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-white">
                          {payment.description}
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {safeDateFormat(payment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-zinc-900 dark:text-white">
                        ${payment.amount.toFixed(2)}
                      </p>
                      <Badge
                        variant={
                          payment.status === "succeeded"
                            ? "default"
                            : "destructive"
                        }
                        className={
                          payment.status === "succeeded"
                            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                            : ""
                        }
                      >
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  {index < data.paymentHistory.length - 1 && (
                    <Separator className="bg-zinc-100 dark:bg-zinc-800" />
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] text-zinc-500 dark:text-zinc-400">
                <Receipt className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-center">No payment history available</p>
                {isPro && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSyncPayments}
                    className="mt-4"
                  >
                    Sync Payment History
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
