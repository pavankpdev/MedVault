"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeRSAPublicKey = exports.deserializeRSAPrivateKey = exports.serializePvtKey = exports.serializePubKey = exports.serializeRSAKey = exports.RSADecrypt = exports.RSAEncrypt = exports.generateRSAKeyPairs = void 0;
const crypto_1 = __importDefault(require("crypto"));
const node_rsa_1 = __importDefault(require("node-rsa"));
const generateRSAKeyPairs = () => {
    return new node_rsa_1.default({ b: 2048 });
};
exports.generateRSAKeyPairs = generateRSAKeyPairs;
const RSAEncrypt = (publicKeyPem, data) => {
    const key = new node_rsa_1.default({ b: 2048 });
    return key.importKey(publicKeyPem, 'pkcs1-public-pem').encrypt(data, 'base64');
};
exports.RSAEncrypt = RSAEncrypt;
const RSADecrypt = (privateKeyPem, data) => {
    const key = new node_rsa_1.default({ b: 2048 });
    return key.importKey(privateKeyPem, 'pkcs1-private-pem').decrypt(data, 'utf8');
};
exports.RSADecrypt = RSADecrypt;
const serializeRSAKey = (key) => {
    return key.export({
        type: "spki",
        format: "pem",
    });
};
exports.serializeRSAKey = serializeRSAKey;
const serializePubKey = (key) => key.exportKey('pkcs1-public-pem');
exports.serializePubKey = serializePubKey;
const serializePvtKey = (key) => key.exportKey('pkcs1-private-pem');
exports.serializePvtKey = serializePvtKey;
const deserializeRSAPrivateKey = (serializedPrivateKey) => {
    return crypto_1.default.createPrivateKey({
        key: serializedPrivateKey,
        format: 'pem',
        type: 'pkcs1'
    });
};
exports.deserializeRSAPrivateKey = deserializeRSAPrivateKey;
const deserializeRSAPublicKey = (key) => {
    return crypto_1.default.createPublicKey(key);
};
exports.deserializeRSAPublicKey = deserializeRSAPublicKey;
