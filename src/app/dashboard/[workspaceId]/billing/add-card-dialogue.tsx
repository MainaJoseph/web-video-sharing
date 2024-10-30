import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";

const AddCardDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Add Payment Method
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">
            Enter your card details to add a new payment method
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-zinc-700 dark:text-zinc-300">
              Card Number
            </Label>
            <div className="relative">
              <Input
                placeholder="1234 5678 9012 3456"
                className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 
                text-zinc-900 dark:text-zinc-100 pl-10 placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                focus:ring-primary/50 dark:focus:ring-primary/50"
              />
              <CreditCard className="h-4 w-4 absolute left-3 top-3 text-zinc-400 dark:text-zinc-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-700 dark:text-zinc-300">
                Expiry Date
              </Label>
              <Input
                placeholder="MM/YY"
                className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 
                text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                focus:ring-primary/50 dark:focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-700 dark:text-zinc-300">CVC</Label>
              <Input
                placeholder="123"
                className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 
                text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                focus:ring-primary/50 dark:focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-700 dark:text-zinc-300">
              Cardholder Name
            </Label>
            <Input
              placeholder="John Doe"
              className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 
              text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500
              focus:ring-primary/50 dark:focus:ring-primary/50"
            />
          </div>
          <div className="pt-4">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium">
              Add Payment Method
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
