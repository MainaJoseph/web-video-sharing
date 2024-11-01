import React from "react";
import { getBillingDetails } from "@/actions/user";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import AddCardDialog from "./add-card-dialogue";
import PaymentMethodSection from "./payment-method-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BillingData } from "@/types/index.type";
import { PaymentHistory } from "./PaymentHistory";

const safeDateFormat = (date: Date | undefined | null): string => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const BillingPage = async () => {
  const response = await getBillingDetails();
  const data = (
    response.status === 200 ? response.data : null
  ) as BillingData | null;
  const isPro = data?.subscription?.plan === "PRO";

  const renewalDate = data?.subscription?.createdAt
    ? safeDateFormat(data.subscription.createdAt)
    : "N/A";

  return (
    <div className="max-w-[1500px] mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Current Plan Card */}
          <Card className="bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-black border-zinc-200 dark:border-zinc-800">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-zinc-900 dark:text-white">
                  Current Plan
                </CardTitle>
                <Badge
                  variant={isPro ? "default" : "secondary"}
                  className="uppercase font-medium"
                >
                  {data?.subscription?.plan || "FREE"}
                </Badge>
              </div>
              {!isPro && (
                <CardDescription className="text-zinc-500 dark:text-zinc-400">
                  Upgrade to PRO for advanced features
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                      ${isPro ? "99" : "0"}
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        /month
                      </span>
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {isPro
                        ? `Renewal on ${renewalDate}`
                        : "Free Plan - No billing"}
                    </p>
                  </div>
                </div>
                {!isPro && (
                  <Button variant="default" size="sm" asChild>
                    <a href="/upgrade">Upgrade</a>
                  </Button>
                )}
              </div>

              {isPro && (
                <div className="mt-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your next billing date is {renewalDate}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card className="bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-black border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                    Payment Method
                  </CardTitle>
                  <CardDescription className="text-zinc-500 dark:text-zinc-400">
                    Manage your payment methods
                  </CardDescription>
                </div>
                <AddCardDialog />
              </div>
            </CardHeader>
            <PaymentMethodSection />
          </Card>

          {/* Subscription Features */}
          {isPro && (
            <Card className="bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-black border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                  Pro Plan Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Unlimited video uploads",
                    "Advanced analytics",
                    "Team collaboration",
                    "Priority support",
                    "Custom branding",
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Payment History - Client Component */}
        <PaymentHistory data={data} isPro={isPro} />
      </div>
    </div>
  );
};

export default BillingPage;
