"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getPinnedFiles = exports.pinFileToIPFS = void 0;
const sdk_1 = __importDefault(require("@pinata/sdk"));
const fs = __importStar(require("fs"));
const pinata = new sdk_1.default({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_KEY
});
const pinFileToIPFS = (filename, metadata, name) => __awaiter(void 0, void 0, void 0, function* () {
    const readableStreamForFile = fs.createReadStream(`/Volumes/Extreme SSD/Pavan's Work/MedVault/server/dist/uploads/${filename}`);
    const options = {
        pinataMetadata: {
            name: name,
            keyvalues: metadata
        },
        pinataOptions: {
            cidVersion: 0
        }
    };
    return pinata.pinFileToIPFS(readableStreamForFile, options);
});
exports.pinFileToIPFS = pinFileToIPFS;
const getPinnedFiles = (hash) => __awaiter(void 0, void 0, void 0, function* () {
    return pinata.pinList({
        hashContains: hash
    });
});
exports.getPinnedFiles = getPinnedFiles;
