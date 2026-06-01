// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract KasOrganisasi {
    
    // Struct untuk satu record transaksi
    struct Transaction {
        uint256 id;           // auto-increment, dimulai dari 1
        string  keterangan;   // deskripsi transaksi, max ~200 karakter
        uint256 nominal;      // dalam satuan terkecil (wei-equivalent), atau IDR langsung
        bool    isIncome;     // true = pemasukan, false = pengeluaran
        uint256 timestamp;    // block.timestamp saat transaksi dikonfirmasi
        address addedBy;      // address wallet bendahara yang menambahkan
    }
    
    // Storage
    Transaction[] private transactions;
    address public owner;
    uint256 private transactionCount;
    
    // Untuk tracking saldo agar tidak perlu loop setiap kali
    uint256 private totalIncome;
    uint256 private totalExpense;

    // Events untuk tracking dan real-time update di frontend
    event TransactionAdded(
        uint256 indexed id,
        string keterangan,
        uint256 nominal,
        bool isIncome,
        uint256 timestamp
    );

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        owner = msg.sender;
    }

    // ======== ACCESS CONTROL ========

    modifier onlyOwner() {
        require(msg.sender == owner, "Akses ditolak: hanya bendahara");
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Alamat tidak valid");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // ======== WRITE FUNCTIONS (onlyOwner) ========

    /**
     * @dev Menambahkan transaksi baru ke ledger.
     * @param _keterangan Deskripsi transaksi (wajib tidak kosong)
     * @param _nominal Jumlah dalam Rupiah (wajib > 0)
     * @param _isIncome true = pemasukan, false = pengeluaran
     */
    function addTransaction(
        string calldata _keterangan,
        uint256 _nominal,
        bool _isIncome
    ) external onlyOwner {
        require(bytes(_keterangan).length > 0, "Keterangan tidak boleh kosong");
        require(_nominal > 0, "Nominal harus lebih dari 0");
        
        if (_isIncome) {
            require(totalIncome + _nominal >= totalIncome, "Overflow");
            totalIncome += _nominal;
        } else {
            require(totalExpense + _nominal <= totalIncome, "Saldo tidak mencukupi");
            totalExpense += _nominal;
        }
        
        transactionCount++;
        transactions.push(Transaction({
            id: transactionCount,
            keterangan: _keterangan,
            nominal: _nominal,
            isIncome: _isIncome,
            timestamp: block.timestamp,
            addedBy: msg.sender
        }));
        
        emit TransactionAdded(transactionCount, _keterangan, _nominal, _isIncome, block.timestamp);
    }

    // ======== READ FUNCTIONS (public view) ========

    function getTransactions() external view returns (Transaction[] memory) {
        return transactions;
    }

    function getBalance() external view returns (uint256 income, uint256 expense, uint256 balance) {
        income = totalIncome;
        expense = totalExpense;
        balance = totalIncome - totalExpense;
    }

    function getTransactionCount() external view returns (uint256) {
        return transactionCount;
    }
}
