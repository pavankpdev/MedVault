"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVaultContract = exports.getRecordContract = exports.deployRecordContract = void 0;
const Record_json_1 = __importDefault(require("../ABI/Record.json"));
const EHRVault_json_1 = __importDefault(require("../ABI/EHRVault.json"));
const ethers_1 = require("ethers");
const ethers_2 = require("./ethers");
const deployRecordContract = (name, ipfsHash) => __awaiter(void 0, void 0, void 0, function* () {
    const abi = Record_json_1.default.abi;
    const bytecode = Record_json_1.default.bytecode;
    const factory = new ethers_1.ethers.ContractFactory(abi, bytecode, ethers_2.signer);
    return factory.deploy(name, ipfsHash);
});
exports.deployRecordContract = deployRecordContract;
const getRecordContract = (address) => {
    const abi = Record_json_1.default.abi;
    return new ethers_1.ethers.Contract(address, abi, ethers_2.signer);
};
exports.getRecordContract = getRecordContract;
const getVaultContract = () => {
    const abi = EHRVault_json_1.default.abi;
    return new ethers_1.ethers.Contract('0x31Ef6675B147bFCa2ab7dF6462547110c98F0B00', abi, ethers_2.signer);
};
exports.getVaultContract = getVaultContract;
