"use client"

// PaymentStatusClient.tsx (Client Component)
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { completeSubscription } from "@/actions/workspace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentStatusClientProps {
  cancel: boolean;
  sessionId?: string;
}

export default function PaymentStatusClient({
  cancel,
  sessionId,
}: PaymentStatusClientProps) {
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handlePaymentStatus = async () => {
      if (cancel) {
        toast({
          variant: "destructive",
          title: "Payment Cancelled",
          description: "Your subscription payment was cancelled.",
        });
        router.push("/auth/callback");
        return;
      }

      if (sessionId) {
        try {
          const customer = await completeSubscription(sessionId);
          if (customer.status === 200) {
            toast({
              title: "Payment Successful",
              description: "Your subscription has been activated.",
            });
            router.push("/auth/callback");
          } else {
            toast({
              variant: "destructive",
              title: "Payment Failed",
              description: "There was an error processing your payment.",
            });
            router.push("/auth/callback");
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Payment Error",
            description: "An unexpected error occurred.",
          });
          router.push("/auth/callback");
        }
      } else {
        router.push("/auth/callback");
      }
    };

    handlePaymentStatus();
  }, [cancel, sessionId, toast, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 flex items-center justify-center">
          <CardTitle className="text-2xl text-center">
            {cancel ? (
              <div className="flex flex-col items-center gap-4">
                <XCircle className="h-12 w-12 text-red-500" />
                Payment Cancelled
              </div>
            ) : !sessionId ? (
              <div className="flex flex-col items-center gap-4">
                <XCircle className="h-12 w-12 text-red-500" />
                Invalid Payment Session
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                Processing Payment
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          {cancel
            ? "Your payment was cancelled. Redirecting you back..."
            : !sessionId
            ? "No valid payment session found. Redirecting you back..."
            : "Please wait while we confirm your payment..."}
        </CardContent>
      </Card>
    </div>
  );
}
