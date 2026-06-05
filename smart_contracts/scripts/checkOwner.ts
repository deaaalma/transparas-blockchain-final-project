import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";

async function main() {
  console.log("Checking owner of contract...");
  const KasOrganisasi = await ethers.getContractAt("KasOrganisasi", CONTRACT_ADDRESS);
  
  const owner = await KasOrganisasi.owner();
  console.log("Contract Owner is:", owner);

  const [signer] = await ethers.getSigners();
  console.log("Current Signer is:", signer.address);
}

main().catch(console.error);
