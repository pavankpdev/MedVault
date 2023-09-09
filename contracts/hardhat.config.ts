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
    }
  }
};

export default config;
