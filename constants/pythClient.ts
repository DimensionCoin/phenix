import { PriceServiceConnection } from "@pythnetwork/price-service-client";

const connection = new PriceServiceConnection("https://hermes.pyth.network", {
  priceFeedRequestConfig: {
    // Provide this option to retrieve binary price updates for on-chain contracts.
    // Ignore this option for off-chain use.
    binary: true,
  },
});

const priceIds = [
  '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d,'
];

// Get the latest price updates for the given price IDs.
// If you set `binary: true` above, then this method also returns signed price updates for the on-chain Pyth contract.
const priceUpdates = await connection.getLatestVaas(priceIds);
