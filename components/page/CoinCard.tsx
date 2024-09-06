import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  getTokenByMint,
  getSolBalance,
  getTokenPrices,
  getPythSolPrice,
} from "@/constants";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

// Define the structure of the tokenPrices object
interface TokenPrices {
  [mint: string]: {
    price: number;
  };
}

interface TokenBalance {
  mint: string;
  balance: number;
  name: string;
  symbol: string;
  logoURI: string;
  price?: number;
  totalValue?: number | null;
}

interface CoinCardProps {
  setPortfolioValue: (value: string | number) => void;
}

const CoinCard: React.FC<CoinCardProps> = ({ setPortfolioValue }) => {
  const { user } = useUser();
  const walletAddress = user?.walletAddress;
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [solTotalValue, setSolTotalValue] = useState<number | null>(null);
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (walletAddress) {
        try {
          setLoading(true);
          setPortfolioValue("Loading your funds...");

          const connection = new Connection(
            "https://mainnet.helius-rpc.com/?api-key=2838e058-518a-47c2-b8f8-a4840027ff8a"
          );
          const publicKey = new PublicKey(walletAddress);

          // Fetch SOL balance
          const solBalance = await getSolBalance(walletAddress);
          setSolBalance(solBalance);

          // Fetch SOL price and calculate total value
          const solPrice = await getPythSolPrice();
          let solTotalValue: number | null = null;
          if (solPrice && solBalance !== null) {
            solTotalValue = parseFloat(solPrice) * solBalance;
            setSolTotalValue(solTotalValue);
          }

          // Fetch SPL token balances
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            {
              programId: TOKEN_PROGRAM_ID,
            }
          );

          const tokenMints = tokenAccounts.value.map(
            (account) => account.account.data.parsed.info.mint
          );

          // Fetch token prices in batches
          const tokenPrices: TokenPrices = {};
          for (let i = 0; i < tokenMints.length; i += 100) {
            const batch = tokenMints.slice(i, i + 100);
            const prices = await getTokenPrices(batch);
            if (prices) {
              Object.assign(tokenPrices, prices);
            }
          }

          // Calculate token values and filter out low-value tokens
          const balances = await Promise.all(
            tokenAccounts.value.map(async (account) => {
              const mint = account.account.data.parsed.info.mint;
              const balance =
                account.account.data.parsed.info.tokenAmount.uiAmount;

              const tokenPrice = tokenPrices[mint]?.price ?? 0;
              const totalValue = balance * tokenPrice;

              if (totalValue < 0.1) return null;

              const tokenData = await getTokenByMint(mint);

              return {
                mint,
                balance,
                name: tokenData?.name || "Unknown",
                symbol: tokenData?.symbol || "",
                logoURI: tokenData?.logoURI || "",
                price: tokenPrice,
                totalValue: totalValue,
              };
            })
          );

          const filteredBalances = balances.filter(
            (token): token is NonNullable<typeof token> => token !== null
          );

          // Sort tokens by totalValue from highest to lowest
          filteredBalances.sort(
            (a, b) => (b.totalValue || 0) - (a.totalValue || 0)
          );

          setTokenBalances(filteredBalances);

          // Calculate total portfolio value
          const totalTokenValue = filteredBalances.reduce(
            (acc, token) => acc + (token.totalValue || 0),
            0
          );
          const totalPortfolioValue =
            solTotalValue !== null ? solTotalValue + totalTokenValue : null;

          if (totalPortfolioValue !== null) {
            setPortfolioValue(totalPortfolioValue);
          } else {
            setPortfolioValue("Loading your funds...");
          }

          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch balances:", error);
          setPortfolioValue("Loading your funds...");
          setLoading(false);
        }
      }
    };
    fetchBalances();
  }, [walletAddress]);

  return (
    <div className="p-2 px-3">
      {loading ? (
        <div className="grid grid-cols-1 gap-4 animate-pulse">
          <div className="bg-card rounded-lg p-4">
            <div className="h-8 w-full bg-muted rounded-md" />
            <div className="mt-4 h-6 w-3/4 bg-muted rounded-md" />
          </div>
        </div>
      ) : (
        <>
          {/* Solana Balance Card */}
          <Link
            href={{
              pathname: `/coin/So11111111111111111111111111111111111111112`,
              query: {
                tokenData: JSON.stringify({
                  name: "Solana",
                  symbol: "SOL",
                  mint: "So11111111111111111111111111111111111111112",
                  logoURI:
                    "https://cdn.prod.website-files.com/641a8c4cac3aee8bd266fd58/64221d2da158322b46c3bd13_6u-LQfjG_400x400.jpg",
                }),
              },
            }}
          >
            <Card className="flex items-center justify-between p-4 bg-blur text-gray-300 rounded-lg mb-5 border-black shadow-md shadow-[#281a2d] ">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage
                    src="https://cdn.prod.website-files.com/641a8c4cac3aee8bd266fd58/64221d2da158322b46c3bd13_6u-LQfjG_400x400.jpg"
                    alt="Solana"
                  />
                  <AvatarFallback>SO</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-md font-semibold">Solana</h3>
                  <p className="text-xs text-gray-400">{solBalance} SOL</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-md font-semibold">
                  ${solTotalValue ? solTotalValue.toFixed(2) : "N/A"}
                </p>
              </div>
            </Card>
          </Link>

          <ul className="space-y-5">
            {tokenBalances.map((token, index) => (
              <li key={index}>
                <Link
                  href={{
                    pathname: `/coin/${token.mint}`,
                    query: { tokenData: JSON.stringify(token) },
                  }}
                >
                  <Card className="flex items-center justify-between p-4 py-6 bg-blur text-gray-300 rounded-lg border-black shadow-md shadow-[#281a2d] ">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage
                          src={token.logoURI || "/blankcoin.png"}
                          alt={token.name}
                        />
                        <AvatarFallback>
                          {token.symbol.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-md font-semibold">
                          {token.name ||
                            `Unknown (${token.mint.slice(0, 8)}...)`}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {token.balance} {token.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-md font-semibold">
                        $
                        {token.totalValue ? token.totalValue.toFixed(2) : "N/A"}
                      </p>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default CoinCard;
