import crypto, {KeyObject} from "crypto";
export const generateRSAKeyPairs = () => {
    return crypto.generateKeyPairSync("rsa", {
        // The standard secure default length for RSA keys is 2048 bits
        modulusLength: 2048,
    });
}

export const RSAEncrypt = (publicKey: KeyObject, data: string) => {
    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        // We convert the data string to a buffer using `Buffer.from`
        Buffer.from(data)
    );

    return encryptedData.toString("base64")
}

export const RSADecrypt = (privateKey: KeyObject, encryptedData: any) => {
    const decryptedData = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        encryptedData
    );

    return decryptedData.toString()
}

export const serializeRSAKey = (key: KeyObject) => {
    return key.export({
        type: "pkcs1",
        format: "pem",
    })
}

export const deserializeRSAPrivateKey = (key: string) => {
    return crypto.createPrivateKey({
        key,
        format: "pem",
        type: "pkcs1",
    })
}

export const deserializeRSAPublicKey = (key: string) => {
    return crypto.createPublicKey(key)
}