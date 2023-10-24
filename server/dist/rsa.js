"use strict";
// const NodeRSA = require('node-rsa');
//
// // Generate an RSA key pair
// const key = new NodeRSA({ b: 2048 });
//
// // Export the public key in PEM format
// const publicKeyPem = key.exportKey('pkcs1-public-pem'); // Use 'pkcs1-public-pem' format
//
// // Export the private key in PEM format
// const privateKeyPem = key.exportKey('pkcs1-private-pem'); // Use 'pkcs1-private-pem' format
//
// // Data to encrypt
// const plaintext = 'Hello, RSA encryption and decryption!';
//
// // Encrypt with the public key (specify padding)
// const encryptedData = key.importKey(publicKeyPem, 'pkcs1-public-pem').encrypt(plaintext, 'base64');
//
// // Decrypt with the private key (specify padding)
// const decryptedData = key.importKey(privateKeyPem, 'pkcs1-private-pem').decrypt(encryptedData, 'utf8');
//
// console.log('Original Data:', plaintext);
// console.log('Encrypted Data:', encryptedData);
// console.log('Decrypted Data:', decryptedData);
const ethers = require('ethers');
const json = JSON.stringify({
    "address": "353f462815b07794a65d1e8e72c45e0295c79625",
    "id": "fc48bd09-f681-40e9-9225-5dc59af016fd",
    "version": 3,
    "Crypto": {
        "cipher": "aes-128-ctr",
        "cipherparams": {
            "iv": "8fa8aa10b6048bb944157c36adec0672"
        },
        "ciphertext": "1558377b3b48651b473fe81ea930cf34d18b2c545414c5aa71f43baa8c8bf1f5",
        "kdf": "scrypt",
        "kdfparams": {
            "salt": "5ddc780f94c5000854c95da43e3ebc567cb0c942fee4e5a95c33d94a1a280919",
            "n": 131072,
            "dklen": 32,
            "p": 1,
            "r": 8
        },
        "mac": "191cb2c2503925f2473ccc3595c3423f3a68d4a6d1915b7e071e5b1e009a6bb2"
    },
    "x-ethers": {
        "client": "ethers/6.8.0",
        "gethFilename": "UTC--2023-10-24T11-35-04.0Z--353f462815b07794a65d1e8e72c45e0295c79625",
        "path": "m/44'/60'/0'/0/0",
        "locale": "en",
        "mnemonicCounter": "9036672100960e13a2475194d19f853c",
        "mnemonicCiphertext": "d2eda7e163e77d373a8a5d366e5efe0d",
        "version": "0.1"
    }
});
ethers.Wallet.fromEncryptedJson(json, "kp18@test.com").then((wallet) => {
    console.log(wallet.privateKey);
});
console.log();
