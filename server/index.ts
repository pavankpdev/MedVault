import express from 'express';
import  { Express, Request, Response } from 'express';
import dotenv, {decrypt} from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import * as fs from 'fs'
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

import {getPinnedFiles, pinFileToIPFS} from "./provider/pinata";
import {encrypt} from "./utils/crypto";
import {deployRecordContract, getRecordContract, getVaultContract} from "./utils/contracts";
import {ethers} from "ethers";
import {getRow, insertRow} from "./provider/supabase";
import {session} from "./middleware/session";

const app: Express = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Set the directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Set the filename
    },
});

const upload = multer({ storage: storage });

app.post('/doctor/login', async (req: Request, res: Response) => {
    const {id, password} = req.body

    const {data, error} = await getRow('Doctors', 'id', id);

   if(error) {
       return res.json({
           error: error.message,
       }).status(500)
   }

   if(password !== data.password) {
       return res.json({
           error: 'Invalid Password'
       }).status(500)
   }

   return res.json({
       doctor: data,
       status: "success"
   })

})

app.get('/record/:hash', async (req: Request, res: Response) => {
    const { hash } = req.params;
    const rs = await getPinnedFiles(hash).catch(console.log)
    return res.json(rs).status(200)
})

app.post('/account/new', session ,async (req: Request, res: Response) => {
    try {
        const password: string = req.body.password;
        const name: string = req.body.name;

        const wallet = ethers.Wallet.createRandom();
        const encryptedWalletJSON = await wallet.encrypt(password)

        const {error, data: user} = await insertRow(
            'Users',
            {
                wallet: wallet.address,
                name,
                email: (req as any)?.user?.email
            }
        )

        if(error) {
            console.log(error)
            return res.status(500).json({
                error: error.message,
            })
        }

        const {error: createWalletErr} =await insertRow(
            'Wallets',
            {
                encryptedJSON: encryptedWalletJSON,
                user_id: user.id
            }
        )

        if(createWalletErr) {
            console.log(createWalletErr)
            return res.status(500).json({
                error: createWalletErr.message,
            })
        }


        return res.json({
            encryptedWalletJSON: JSON.parse(encryptedWalletJSON),
            wallet: wallet.address
        }).status(201)
    } catch (err: unknown) {
        console.log(err)
    }
})

app.post('/record/new', upload.single('file') , async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send('No files were uploaded.');
        }

        const {metadata, name, patientId} = req.body;

        const {data: user, error} = await getRow('Users', 'id', patientId)

        if(error) {
            return res.status(500).json({
                error: error.message,
            })
        }

        const pinned = await pinFileToIPFS(req?.file?.filename, JSON.parse(metadata), name)
        const encryptedHash = encrypt(pinned.IpfsHash)

        const deployment = await deployRecordContract(name, encryptedHash)
        await deployment.waitForDeployment()
        const recordAddress = await deployment.getAddress()

        const recordContract = getRecordContract(recordAddress)

        const record = {
            id: 1,
            recordAddress: recordAddress,
            metadata: metadata,
            name: name,
            ipfs: encryptedHash,
            patientUid: user?.id || '', // Ensure patientUid is set to a default value if user?.id is undefined
        };

        let tx = await (getVaultContract()).addRecord(record).catch(console.log)

        await tx.wait()

        tx = await recordContract.transferOwnership(user.wallet)

        fs.unlinkSync(req?.file?.path as string);

        return res.json({
            record: recordAddress,
            transactionHash: tx.hash,
        }).status(201)

    } catch (err) {
        console.log(err)
    }
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
