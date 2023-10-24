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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
dotenv_1.default.config();
const pinata_1 = require("./provider/pinata");
const contracts_1 = require("./utils/contracts");
const ethers_1 = require("ethers");
const supabase_1 = require("./provider/supabase");
const session_1 = require("./middleware/session");
const ethers_2 = require("./utils/ethers");
const RSA_1 = require("./utils/RSA");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.PORT;
// Configure Multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, 'uploads')); // Set the directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Set the filename
    },
});
const upload = (0, multer_1.default)({ storage: storage });
app.post('/doctor/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, password } = req.body;
    const { data, error } = yield (0, supabase_1.getRow)('Doctors', 'id', id);
    if (error) {
        return res.json({
            error: error.message,
        }).status(500);
    }
    if (password !== data.password) {
        return res.json({
            error: 'Invalid Password'
        }).status(500);
    }
    return res.json({
        doctor: data,
        status: "success"
    });
}));
app.get('/record/:hash', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hash } = req.params;
    const { viewerId, patientId } = req.query;
    console.log(req.params, req.query);
    let privateKey = undefined;
    const { data, error: getRSAKeyPairsError } = yield (0, supabase_1.getRow)("KeyPairs", "user_id", (patientId || viewerId));
    if (getRSAKeyPairsError) {
        console.log(getRSAKeyPairsError);
        return res.status(500).json({
            error: getRSAKeyPairsError.message,
        });
    }
    privateKey = data.private_key;
    console.log(privateKey);
    const decryptedHash = (0, RSA_1.RSADecrypt)(privateKey, hash);
    console.log(decryptedHash);
    // const rs = await getPinnedFiles(decryptedHash).catch(console.log)
    return res.json({ ipfs: decryptedHash }).status(200);
}));
app.post('/account/new', session_1.session, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const password = req.body.password;
        const name = req.body.name;
        const wallet = ethers_1.ethers.Wallet.createRandom();
        const encryptedWalletJSON = yield wallet.encrypt(password);
        const { error, data: user } = yield (0, supabase_1.insertRow)('Users', {
            wallet: wallet.address,
            name,
            email: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.email
        });
        if (error) {
            console.log(error);
            return res.status(500).json({
                error: error.message,
            });
        }
        const { error: createWalletErr } = yield (0, supabase_1.insertRow)('Wallets', {
            encryptedJSON: encryptedWalletJSON,
            user_id: user.id
        });
        if (createWalletErr) {
            return res.status(500).json({
                error: createWalletErr.message,
            });
        }
        const key = (0, RSA_1.generateRSAKeyPairs)();
        const serializedPublicKey = (0, RSA_1.serializePubKey)(key);
        const serializedPrivateKey = (0, RSA_1.serializePvtKey)(key);
        const { error: createKeyPairError } = yield (0, supabase_1.insertRow)('KeyPairs', {
            public_key: serializedPublicKey,
            private_key: serializedPrivateKey,
            user_id: user.id
        });
        if (createKeyPairError) {
            console.log(createKeyPairError);
            return res.status(500).json({
                error: createKeyPairError.message,
            });
        }
        return res.json({
            encryptedWalletJSON: JSON.parse(encryptedWalletJSON),
            wallet: wallet.address
        }).status(201);
    }
    catch (err) {
        console.log(err);
    }
}));
app.post('/record/new', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        if (!req.file) {
            return res.status(400).send('No files were uploaded.');
        }
        const { metadata, name, patientId } = req.body;
        const { data: user, error } = yield (0, supabase_1.getRow)('Users', 'id', patientId);
        if (error) {
            console.log(error);
            return res.status(500).json({
                error: error.message,
            });
        }
        const pinned = yield (0, pinata_1.pinFileToIPFS)((_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.filename, JSON.parse(metadata), name);
        const { data, error: getRSAKeyPairsError } = yield (0, supabase_1.getRow)("KeyPairs", "user_id", patientId);
        if (getRSAKeyPairsError) {
            return res.status(500).json({
                error: getRSAKeyPairsError.message,
            });
        }
        const encryptedHash = (0, RSA_1.RSAEncrypt)(data.public_key, pinned === null || pinned === void 0 ? void 0 : pinned.IpfsHash);
        const deployment = yield (0, contracts_1.deployRecordContract)(name, encryptedHash);
        yield deployment.waitForDeployment();
        const recordAddress = yield deployment.getAddress();
        const recordContract = (0, contracts_1.getRecordContract)(recordAddress);
        const record = {
            id: 1,
            recordAddress: recordAddress,
            metadata: metadata,
            name: name,
            ipfs: encryptedHash,
            patientUid: (user === null || user === void 0 ? void 0 : user.id) || '', // Ensure patientUid is set to a default value if user?.id is undefined
        };
        let tx = yield ((0, contracts_1.getVaultContract)()).addRecord(record).catch(console.log);
        yield tx.wait();
        tx = yield recordContract.transferOwnership(user.wallet);
        fs.unlinkSync((_c = req === null || req === void 0 ? void 0 : req.file) === null || _c === void 0 ? void 0 : _c.path);
        return res.json({
            record: recordAddress,
            transactionHash: tx.hash,
        }).status(201);
    }
    catch (err) {
        console.log(err);
    }
}));
app.post('/record/access', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { doctorId, recordId } = req.body;
    if ((_d = req.query) === null || _d === void 0 ? void 0 : _d.revoke) {
        const { data, error } = yield supabase_1.supabase.from('Records').delete().eq('address', recordId).eq('doctor_id', doctorId);
        if (error) {
            return res.json({
                error: error.message,
            }).status(500);
        }
        return res.json({
            data,
        });
    }
    const { data, error } = yield (0, supabase_1.insertRow)('Records', {
        address: recordId,
        doctor_id: doctorId,
    });
    if (error) {
        return res.json({
            error: error.message,
        }).status(500);
    }
    return res.json({
        data,
    });
}));
app.get('/record/access/:doctorId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId } = req.params;
    const { data, error } = yield supabase_1.supabase.from('Records').select('*').eq('doctor_id', doctorId);
    if (error) {
        return res.json({
            error: error.message,
        }).status(500);
    }
    return res.json({
        data,
    });
}));
app.get('/record/get-allowed-doctors/:recordId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recordId } = req.params;
    const { data, error } = yield supabase_1.supabase
        .from('Records')
        .select('*, doctor:doctor_id(id, name, hospital, address)')
        .eq('address', recordId);
    return res.json({
        data
    });
}));
app.post('/transaction/write', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, method, abi, params, password, address } = req.body;
    const { data: user, error } = yield (0, supabase_1.getRow)('Wallets', 'user_id', userId);
    if (error) {
        return res.json({
            error: error.message,
        }).status(500);
    }
    const wallet = yield ethers_1.ethers.Wallet.fromEncryptedJson(user.encryptedJSON, password);
    const signer = wallet.connect(ethers_2.provider);
    const contract = new ethers_1.ethers.Contract(address, abi, signer);
    const tx = yield contract[method](...params);
    yield tx.wait();
    return res.json({
        txHash: tx.hash,
    });
}));
app.get("/gen/keypairs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const {publicKey, privateKey} = generateRSAKeyPairs()
    //
    // const serializedPublicKey = serializeRSAKey(publicKey)
    // const serializedPrivateKey = serializeRSAKey(privateKey)
    //
    // const encryptedPrivateKey = encrypt(Buffer.from(serializedPrivateKey).toString("base64"))
    //
    // return res.json({
    //     public_key: Buffer.from(serializedPublicKey).toString("base64"),
    //     private_key: encryptedPrivateKey,
    // })
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
