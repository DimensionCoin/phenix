'use client'
import React, { useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CoinCharts from "@/components/widgets/CoinCharts";

export default function CoinProfile({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tokenData, setTokenData] = useState<any>(null);

  const topChartContainerRef = useRef<HTMLDivElement>(null);
  const fearGreedChartContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokenDataParam = searchParams.get("tokenData");
    if (tokenDataParam) {
      setTokenData(JSON.parse(tokenDataParam));
    } else {
      console.error("Token data not available in query params.");
      fetchTokenData();
    }
  }, []);

  const fetchTokenData = async () => {
    try {
      const response = await fetch(`/api/token/${params.id}`);
      const data = await response.json();
      setTokenData(data);
    } catch (error) {
      console.error("Error fetching token data:", error);
    }
  };

  if (!tokenData) return <div>Loading token data...</div>;

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="p-2 px-5 rounded-lg shadow-black shadow-lg">
        <div className="flex items-center gap-4">
          <div className=" flex items-center justify-center">
            <img
              src={tokenData.logoURI || "/placeholder.svg"}
              width="40"
              height="40"
              alt={`${tokenData.name} Logo`}
              className="rounded-full"
              style={{ aspectRatio: "40/40", objectFit: "cover" }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{tokenData.name}</h2>
                <div className="text-sm text-muted-foreground">
                  ${tokenData.symbol} / {tokenData.mint.slice(0, 6)}...
                  {tokenData.mint.slice(-4)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-16">
                  Buy
                </Button>
                <Button variant="outline" className="w-16">
                  Sell
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref={topChartContainerRef} style={{ height: "75vh", width: "100%" }}>
        <CoinCharts
          symbol={`COINEX:${tokenData.symbol}USDT`}
          topChartRef={topChartContainerRef}
          fearGreedChartRef={fearGreedChartContainerRef}
        />
      </div>
      <div
        ref={fearGreedChartContainerRef}
        style={{ height: "35vh", width: "100%", marginTop: "10px" }}
      ></div>
    </>
  );
}
