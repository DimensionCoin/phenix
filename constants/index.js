// constants/index.js
import { Connection, PublicKey } from "@solana/web3.js";
import { PriceServiceConnection } from "@pythnetwork/price-service-client";

// Function to get token metadata by its mint address
export const getTokenByMint = async (mintAddress) => {
  try {
    const response = await fetch(`https://tokens.jup.ag/token/${mintAddress}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch token data for mint: ${mintAddress}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching token data:", error);
    return null; // Return null in case of error
  }
};

// Function to get SOL balance of a wallet address
export const getSolBalance = async (walletAddress) => {
  try {
    const connection = new Connection(
      "https://mainnet.helius-rpc.com/?api-key=2838e058-518a-47c2-b8f8-a4840027ff8a"
    );
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error("Error fetching SOL balance:", error);
    return null; // Return null in case of error
  }
};

// Function to get the price of a batch of tokens by their mint addresses
export const getTokenPrices = async (mints) => {
  try {
    const mintString = mints.join(",");
    const response = await fetch(
      `https://price.jup.ag/v6/price?ids=${mintString}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch prices for tokens`);
    }
    const priceData = await response.json();
    return priceData.data;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    return null; // Return null in case of error
  }
};

// Function to get the price of SOL from Pyth
export const getPythSolPrice = async () => {
  try {
    const connection = new PriceServiceConnection(
      "https://hermes.pyth.network",
      {
        priceFeedRequestConfig: {
          binary: false, // Set to false as we're using this for off-chain purposes
        },
      }
    );

    const priceIds = [
      "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", // Pyth price ID for Solana
    ];

    const priceFeeds = await connection.getLatestPriceFeeds(priceIds);

    if (priceFeeds && priceFeeds.length > 0) {
      const solPriceData = priceFeeds[0]?.getPriceNoOlderThan(60);

      if (solPriceData && solPriceData.price) {
        const adjustedPrice =
          solPriceData.price * Math.pow(10, solPriceData.expo);
        return adjustedPrice.toFixed(2);
      } else {
        throw new Error("Could not retrieve a recent price for Solana.");
      }
    } else {
      throw new Error("No price feed returned for Solana.");
    }
  } catch (error) {
    console.error("Failed to fetch Solana price from Pyth:", error);
    return null; // Return null in case of error
  }
};
