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
import {
  CreditCard,
  Calendar,
  Receipt,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const BillingPage = async () => {
  const response = await getBillingDetails();
  const data = response.status === 200 ? response.data : null;
  const isPro = data?.subscription?.plan === "PRO";

  return (
    <div className="max-w-[1500px] mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Current Plan Card */}
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
                  {data?.subscription?.plan || "FREE"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      ${isPro ? "99" : "0"}
                      <span className="text-sm text-zinc-400">/month</span>
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {isPro
                        ? `Renewal on ${data?.subscription?.createdAt.toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                            }
                          )}`
                        : "Free Plan - No billing"}
                    </p>
                  </div>
                </div>
                {!isPro && (
                  <Button variant="default" size="sm">
                    Upgrade
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Card */}
          <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-white">
                    Payment Method
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Manage your payment methods
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-zinc-700 hover:bg-zinc-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </CardHeader>
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
                        <p className="font-medium text-white">
                          •••• •••• •••• 4242
                        </p>
                        <p className="text-sm text-zinc-400">Expires 12/24</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-zinc-800 text-zinc-400"
                    >
                      Default
                    </Badge>
                  </div>
                </div>

                {/* Add new card placeholder */}
                <div className="p-4 rounded-lg border border-dashed border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
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
          </Card>
        </div>

        {/* Payment History Card */}
        <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold text-white">
                Payment History
              </CardTitle>
            </div>
            <CardDescription className="text-zinc-400">
              Your recent billing transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {data?.paymentHistory && data.paymentHistory.length > 0 ? (
                  data.paymentHistory.map((payment, index) => (
                    <div key={payment.id}>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-10 w-10 rounded-full ${
                              payment.status === "successful"
                                ? "bg-emerald-500/10"
                                : "bg-red-500/10"
                            } flex items-center justify-center`}
                          >
                            {payment.status === "successful" ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {payment.description}
                            </p>
                            <p className="text-sm text-zinc-400">
                              {payment.createdAt.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">
                            ${payment.amount}
                          </p>
                          <Badge
                            variant={
                              payment.status === "successful"
                                ? "default"
                                : "destructive"
                            }
                            className={`${
                              payment.status === "successful"
                                ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                : ""
                            }`}
                          >
                            {payment.status.charAt(0).toUpperCase() +
                              payment.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      {index < data.paymentHistory.length - 1 && (
                        <Separator className="bg-zinc-800" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-zinc-400">
                    <Receipt className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-center">No payment history available</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingPage;
