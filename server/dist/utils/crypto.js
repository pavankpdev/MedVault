"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const algorithm = 'aes-256-cbc';
function encrypt(data) {
    const password = '1tQAsnRefd/x10UGgtqvGqQHU8j7ZSm7aUIb12MCRq8=';
    const iv = Buffer.from(crypto_1.default.createHash('sha256').update(password).digest('base64').substr(0, 16));
    const key = crypto_1.default.createHash('sha256').update(password).digest('base64').substr(0, 32);
    let cipher = crypto_1.default.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}
exports.encrypt = encrypt;
function decrypt(data) {
    const password = '1tQAsnRefd/x10UGgtqvGqQHU8j7ZSm7aUIb12MCRq8=';
    const iv = Buffer.from(crypto_1.default.createHash('sha256').update(password).digest('base64').substr(0, 16));
    const key = crypto_1.default.createHash('sha256').update(password).digest('base64').substr(0, 32);
    let encryptedText = Buffer.from(data, 'hex');
    let decipher = crypto_1.default.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
exports.decrypt = decrypt;
