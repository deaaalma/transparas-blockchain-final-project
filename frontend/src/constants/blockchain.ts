export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// ABI dari smart contract KasOrganisasi
export const CONTRACT_ABI = [
  "event TransactionAdded(uint256 indexed id, string keterangan, uint256 nominal, bool isIncome, uint256 timestamp)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
  "function addTransaction(string _keterangan, uint256 _nominal, bool _isIncome) external",
  "function addPastTransaction(string _keterangan, uint256 _nominal, bool _isIncome, uint256 _pastTimestamp) external",
  "function getBalance() view returns (uint256 income, uint256 expense, uint256 balance)",
  "function getTransactionCount() view returns (uint256)",
  "function getTransactions() view returns (tuple(uint256 id, string keterangan, uint256 nominal, bool isIncome, uint256 timestamp, address addedBy)[])",
  "function owner() view returns (address)",
  "function transferOwnership(address newOwner) external"
];
