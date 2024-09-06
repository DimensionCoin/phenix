"use client";
import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { Card } from "@/components/ui/card";

interface BalanceProps {
  portfolioValue: string | number;
}

export default function Balance({ portfolioValue }: BalanceProps) {
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * (10000 - 5 + 1)) + 5
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (typeof portfolioValue === "string") {
      interval = setInterval(() => {
        setRandomNumber(Math.floor(Math.random() * (10000 - 5 + 1)) + 5);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [portfolioValue]);

  return (
    <div className="bg-transparent p-6 rounded-lg shadow-md shadow-[#5bff79] ">
      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl font-bold text-primary">
          {typeof portfolioValue === "number"
            ? `$${portfolioValue.toFixed(2)}`
            : `$${randomNumber.toLocaleString()}`}
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <FaArrowUp className="w-4 h-4 text-re-500" />
          <span>+4.2% from yesterday</span>
        </div>
      </div>
    </div>
  );
}
