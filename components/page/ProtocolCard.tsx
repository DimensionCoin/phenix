import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/context/UserContext";

interface ProtocolCardProps {
  portfolioValue: string;
}

export default function ProtocolCard({ portfolioValue }: ProtocolCardProps) {
  // Convert portfolioValue to a number and format it to 2 decimal places
  const formattedPortfolioValue = parseFloat(portfolioValue).toFixed(2);
  const user = useUser();

  return (
    <Card className="w-full max-w-md p-6 grid gap-6 border-black bg-[#0e001363] shadow-sm shadow-purple-500">
      <div className="flex items-center justify-between bg-primary rounded-t-lg py-12 gap-4 px-6 bg-black">
        <Avatar className="h-10 w-10" >
          
          <AvatarImage
            src={user?.avatarUrl || "https://github.com/shadcn.png"}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h4 className="text-lg font-medium text-primary-foreground text-white">
          Wallet
        </h4>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold">Your Account Balance</h3>
        <div className="text-4xl font-bold text-primary mt-4">
          ${formattedPortfolioValue}
        </div>
      </div>
    </Card>
  );
}
