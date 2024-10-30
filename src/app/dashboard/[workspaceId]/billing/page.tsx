import React from "react";
import { getPaymentInfo } from "@/actions/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar } from "lucide-react";

const BillingPage = async () => {
  const payment = await getPaymentInfo();
  const isPro = payment?.data?.subscription?.plan === "PRO";

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">
              Current Plan
            </CardTitle>
            <Badge
              variant={isPro ? "default" : "secondary"}
              className="uppercase"
            >
              {payment?.data?.subscription?.plan || "FREE"}
            </Badge>
          </div>
          <CardDescription className="text-zinc-400">
            Manage your subscription and billing details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/50">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-white">
                  ${isPro ? "20" : "0"}
                  <span className="text-sm text-zinc-400">/month</span>
                </h3>
                <p className="text-sm text-zinc-400">
                  {isPro ? "Pro Plan" : "Free Plan"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800/50">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-white">
                  Billing Period
                </h3>
                <p className="text-sm text-zinc-400">
                  Your next billing date is on the 1st of each month
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
