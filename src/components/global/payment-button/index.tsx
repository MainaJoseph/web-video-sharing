import { Button } from "@/components/ui/button";
import React from "react";
import Loader from "../loader";
import { useSubscription } from "@/hooks/useSubscription";

type Props = {};

const PaymentButton = (props: Props) => {
  const { onSubscribe, isProcessing } = useSubscription();

  return (
    <Button
      className="text-sm w-full bg-zinc-100 hover:bg-zinc-200 
        dark:bg-zinc-800 dark:hover:bg-zinc-700
        text-zinc-900 dark:text-zinc-100"
      onClick={onSubscribe}
    >
      <Loader color="currentColor" state={isProcessing}>
        Upgrade
      </Loader>
    </Button>
  );
};

export default PaymentButton;
