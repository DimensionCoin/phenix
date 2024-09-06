import { NextResponse } from "next/server";
import Moralis from "moralis";

// Ensure Moralis is only initialized once
if (!Moralis.Core.isStarted) {
  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get("walletAddress");

  if (!walletAddress) {
    return NextResponse.json(
      { error: "Missing wallet address" },
      { status: 400 }
    );
  }

  try {
    let totalBalance = 0;
    const tokens = [];

    // Fetch SPL tokens
    const splTokensResponse = await Moralis.SolApi.account.getSPL({
      network: "mainnet",
      address: walletAddress,
    });

    for (const token of splTokensResponse) {
      const mintAddress = token.mint;
      const tokenBalance = token.amount / 10 ** token.decimals; // Adjust for decimals

      // Fetch token price from Moralis API
      const priceResponse = await Moralis.SolApi.token.getTokenPrice({
        network: "mainnet",
        address: mintAddress,
      });
      const tokenPrice = priceResponse.usdPrice || 0;

      tokens.push({
        mint: mintAddress,
        symbol: token.symbol || mintAddress,
        name: token.name || "Unknown Token",
        logoURI: token.logo || "https://github.com/shadcn.png",
        balance: tokenBalance,
        price: tokenPrice,
      });

      totalBalance += tokenBalance * tokenPrice;
    }

    return NextResponse.json({ totalBalance, tokens });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      {
        error: "Error fetching wallet data",
        details: error.message || "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
