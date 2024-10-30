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
          className="text-white border-zinc-700 hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Add Payment Method
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter your card details to add a new payment method
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-white">Card Number</Label>
            <div className="relative">
              <Input
                placeholder="1234 5678 9012 3456"
                className="bg-zinc-800/50 border-zinc-700 text-white pl-10"
              />
              <CreditCard className="h-4 w-4 absolute left-3 top-3 text-zinc-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Expiry Date</Label>
              <Input
                placeholder="MM/YY"
                className="bg-zinc-800/50 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">CVC</Label>
              <Input
                placeholder="123"
                className="bg-zinc-800/50 border-zinc-700 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Cardholder Name</Label>
            <Input
              placeholder="John Doe"
              className="bg-zinc-800/50 border-zinc-700 text-white"
            />
          </div>
          <div className="pt-4">
            <Button className="w-full">Add Payment Method</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
