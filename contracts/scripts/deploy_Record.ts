import { ethers } from "hardhat";

async function main() {

  const Record = await ethers.getContractFactory("Record");
  const record = await Record.deploy(
      'Name',
      'IPFS'
  );

  await record.deployed();

  console.log(`Record deployed to ${record.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
