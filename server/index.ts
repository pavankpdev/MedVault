import express from 'express';
import  { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import * as fs from 'fs'

dotenv.config();

import {getPinnedFiles, pinFileToIPFS} from "./provider/pinata";
import {encrypt} from "./utils/crypto";

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

app.get('/record', async (req: Request, res: Response) => {
    const rs = await getPinnedFiles('').catch(console.log)
    return res.json(rs).status(200)
})

app.post('/record/new', upload.single('file') , async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }

    const {metadata, name} = req.body;

    const pinned = await pinFileToIPFS(req?.file?.filename, JSON.parse(metadata), name)

    res.json({
        hash: encrypt(pinned.IpfsHash)
    }).status(201)

    fs.unlinkSync(req?.file?.path as string);

    return
})

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
