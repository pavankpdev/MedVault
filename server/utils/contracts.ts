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
    return new ethers.Contract('0xE90e9Cf36172c03c6e862d8d87e304B6B05f0323', abi, signer);
}