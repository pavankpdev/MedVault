import { ethers } from "ethers";
import EHRVaultJSON from "../ABI/EHRVault.json"

export type ChainOptions = {
    rpc: string,
    chainId: number,
    name: string,
    token: string,
    explorer?: string
}

export const supportedChains: ChainOptions = {
    rpc: "https://polygon-mumbai.g.alchemy.com/v2/e5X5TCL-0GBdm_iP9LnsNskTgeAHPHrS",
    chainId: 80001,
    name: "Mumbai",
    token: 'MATIC',
    explorer: 'https://mumbai.polygonscan.com'
}

export const createProvider = () => {
    return new ethers.providers.JsonRpcProvider(supportedChains.rpc, supportedChains.chainId);
}

export const createSigner = async (password: string, encryptedJSON: string) => {
    const provider = createProvider();
    const wallet =  await ethers.Wallet.fromEncryptedJson(encryptedJSON, password)
    return wallet.connect(provider);
}

export const createWallet = async (password: string) => {
    const provider = createProvider();
    const wallet = ethers.Wallet.createRandom().connect(provider);
    const encryptedJSON = await wallet.encrypt(password);
    return { wallet: wallet.address, encryptedJSON };
}

export const getVaultContract = () => {
    const provider = createProvider();
    const abi = EHRVaultJSON.abi;
    return new ethers.Contract('0xbF8C37B93863f9375442b4634b100689971739D7', abi, provider);
}