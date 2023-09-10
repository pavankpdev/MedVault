import {ethers} from 'ethers'

export const provider = new ethers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/wkNwFBVG-pJcTIZ_7cv-ZlY2nhPMMepc')

export const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider)