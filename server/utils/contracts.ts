import RecordJSON from "../ABI/Record.json"
import EHRVaultJSON from "../ABI/EHRVault.json"
import {ethers} from "ethers";
import {signer} from "./ethers";

export const deployRecordContract = async (
    name: string,
    ipfsHash: string,
) => {
    const abi = RecordJSON.abi;
    const bytecode = RecordJSON.bytecode;

    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    return factory.deploy(
        name,
        ipfsHash
    );
}

export const getRecordContract = (address: string) => {
    const abi = RecordJSON.abi;
    return new ethers.Contract(address, abi, signer);
}

export const getVaultContract = () => {
    const abi = EHRVaultJSON.abi;
    return new ethers.Contract('0xbF8C37B93863f9375442b4634b100689971739D7', abi, signer);
}