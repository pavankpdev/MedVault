import dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    mumbai: {
        url: process.env.RPC as string,
        accounts: [process.env.PVT_KEY as string],
    },
    shardeum: {
        url: 'https://dapps.shardeum.org',
        accounts: [process.env.PVT_KEY as string],
    },
    sepolia: {
        url: 'https://eth-sepolia.g.alchemy.com/v2/3QDeRBQwnvG0DyXXVyFds7I7w0f8dUfe',
        accounts: [process.env.PVT_KEY as string],
    },
    zilliqa: {
        url: 'https://dev-api.zilliqa.com/',
        accounts: [process.env.PVT_KEY as string],
    },
    elysium: {
        url: 'https://elysium-test-rpc.vulcanforged.com/',
        accounts: [process.env.PVT_KEY as string],
    },
    moonbeam: {
        url: 'https://moonbase-alpha.public.blastapi.io',
        accounts: [process.env.PVT_KEY as string],
    },
  },
  etherscan: {
      apiKey: 'AQVT6MP5RYH9T7P6KYU2Y892KZNTW4JHZK'
  }
};

export default config;
