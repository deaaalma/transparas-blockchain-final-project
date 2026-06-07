const { ethers } = require("ethers");

const RPC_URL = "https://polygon-amoy.g.alchemy.com/v2/eDNFV4AgkT6g9XodwlLAb";
const CONTRACT_ADDRESS = "0xBE4FF6a8A141d05827Fb7581B03e30fe01257f62";
const ABI = [
  "function getTransactions() view returns (tuple(uint256 id, string keterangan, uint256 nominal, bool isIncome, uint256 timestamp, address addedBy)[])",
  "function getBalance() view returns (uint256 income, uint256 expense, uint256 balance)"
];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  
  try {
    const bal = await contract.getBalance();
    console.log("Balance:", bal);
    const txs = await contract.getTransactions();
    console.log("Total txs:", txs.length);
  } catch(e) {
    console.error("Error:", e);
  }
}

main();
