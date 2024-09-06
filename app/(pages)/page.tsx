"use client";
import CoinCard from "@/components/page/CoinCard";
import Header from "@/components/page/Header";
import React, { useState } from "react";

const Home = () => {
  const [portfolioValue, setPortfolioValue] = useState<string | number>(
    "Loading your funds..."
  );

  return (
    <div>
      <Header portfolioValue={portfolioValue} />
      <CoinCard setPortfolioValue={setPortfolioValue} />
    </div>
  );
};

export default Home;
