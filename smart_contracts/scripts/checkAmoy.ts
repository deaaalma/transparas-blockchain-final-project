import { ethers } from "hardhat";

async function main() {
  const CONTRACT_ADDRESS = "0xBE4FF6a8A141d05827Fb7581B03e30fe01257f62";
  const KasOrganisasi = await ethers.getContractAt("KasOrganisasi", CONTRACT_ADDRESS);
  const txs = await KasOrganisasi.getTransactions();
  console.log("Total transactions in contract:", txs.length);
  const bal = await KasOrganisasi.getBalance();
  console.log("Balance:", bal.balance.toString());
}

main().catch(console.error);
