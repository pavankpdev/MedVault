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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentNonce = exports.signer = exports.provider = void 0;
const ethers_1 = require("ethers");
exports.provider = new ethers_1.ethers.JsonRpcProvider('https://moonbase-alpha.public.blastapi.io');
exports.signer = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, exports.provider);
const getCurrentNonce = () => __awaiter(void 0, void 0, void 0, function* () { return (yield exports.signer.getNonce()).toString(); });
exports.getCurrentNonce = getCurrentNonce;
