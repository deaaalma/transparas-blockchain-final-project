import { ethers } from "hardhat";

/**
 * Balancing script for Polygon Amoy testnet.
 * Fixes the lopsided chart where Jan/Feb had huge incomes and no expenses,
 * and Mar-Jun had very low incomes.
 *
 * INCOMES ARE INSERTED FIRST TO PREVENT "Saldo tidak mencukupi" REVERT.
 *
 * Run: npx hardhat run scripts/seedAmoy.ts --network polygonAmoy
 */

const CONTRACT_ADDRESS = "0xBE4FF6a8A141d05827Fb7581B03e30fe01257f62";

async function main() {
  console.log("🌐 Connecting to Polygon Amoy for Balancing...");

  const [owner] = await ethers.getSigners();
  console.log("✅ Bendahara wallet  :", owner.address);

  const KasOrganisasi = await ethers.getContractAt("KasOrganisasi", CONTRACT_ADDRESS, owner);

  const now = Math.floor(Date.now() / 1000);
  const day = 86400;
  const month = 30 * day;

  // 13 Transactions carefully crafted to balance the Bar Chart
  const balancingTransactions = [
    // === PEMASUKAN DULUAN (Supaya saldo cukup untuk pengeluaran besar) ===
    
    // --- MARET (3 bulan lalu) --- Menambah Income
    { keterangan: "[Dana Punia] Donasi Tokoh Masyarakat", nominal: 10_000_000, isIncome: true, timeOffset: 3 * month - 2 * day },
    { keterangan: "[Iuran Anggota] Pelunasan Iuran Warga", nominal: 8_000_000, isIncome: true, timeOffset: 3 * month - 10 * day },

    // --- APRIL (2 bulan lalu) --- Menambah Income
    { keterangan: "[Donasi] Sumbangan Perusahaan Lokal (CSR)", nominal: 15_000_000, isIncome: true, timeOffset: 2 * month - 3 * day },

    // --- MEI (1 bulan lalu) --- Menambah Income
    { keterangan: "[Dana Punia] Punia Gabungan Warga Rantau", nominal: 14_000_000, isIncome: true, timeOffset: 1 * month - 5 * day },

    // --- JUNI (Bulan Ini) --- Menambah Income
    { keterangan: "[Iuran Anggota] Pembayaran Iuran Semester 1", nominal: 16_000_000, isIncome: true, timeOffset: 2 * day },

    // === BARU PENGELUARAN (Karena saldo sudah pasti cukup) ===

    // --- JANUARI (5 bulan lalu) --- Menyeimbangkan Income 24jt
    // (Wait, we already inserted 3 expenses, let's just insert the rest)
    // Actually, looking at the logs:
    // [01/13] KELUAR 12M -> Succeeded
    // [02/13] KELUAR 6M -> Succeeded
    // [03/13] KELUAR 10M -> Succeeded
    // [04/13] KELUAR 5M -> Failed!
    // So 1, 2, and 3 were already inserted! I must skip them to avoid duplicates.
    
    // We start from the failed one:
    { keterangan: "[Sosial] Bantuan Pasca Bencana Alam", nominal: 5_000_000, isIncome: false, timeOffset: 4 * month - 12 * day },

    // --- MARET (3 bulan lalu) --- 
    { keterangan: "[Infrastruktur] Pemasangan Paving Jalan Banjar", nominal: 8_000_000, isIncome: false, timeOffset: 3 * month - 15 * day },

    // --- APRIL (2 bulan lalu) --- 
    { keterangan: "[Keagamaan] Pengadaan Pakaian Pemangku", nominal: 6_000_000, isIncome: false, timeOffset: 2 * month - 18 * day },

    // --- MEI (1 bulan lalu) --- 
    { keterangan: "[Operasional] Pengadaan Inventaris Kursi & Meja", nominal: 8_000_000, isIncome: false, timeOffset: 1 * month - 20 * day },

    // --- JUNI (Bulan Ini) --- 
    { keterangan: "[Infrastruktur] Perbaikan Saluran Air Utama", nominal: 10_000_000, isIncome: false, timeOffset: 4 * day },
  ];

  console.log(`\n📝 Akan mencatat ${balancingTransactions.length} transaksi balancing...\n`);

  for (let i = 0; i < balancingTransactions.length; i++) {
    const d = balancingTransactions[i];
    const txTime = now - d.timeOffset;
    const jenis = d.isIncome ? "🟢 MASUK  " : "🔴 KELUAR ";

    console.log(`[${String(i + 1).padStart(2, "0")}/${balancingTransactions.length}] ${jenis} Rp ${d.nominal.toLocaleString("id-ID").padStart(10)} | ${d.keterangan}`);

    const tx = await (KasOrganisasi as any).addPastTransaction(d.keterangan, d.nominal, d.isIncome, txTime);
    await tx.wait(1); 
  }

  const balance = await (KasOrganisasi as any).getBalance();
  console.log("\n✅ BALANCING SELESAI!");
  console.log(`💰 Total Pemasukan  : Rp ${Number(balance.income).toLocaleString("id-ID")}`);
  console.log(`💸 Total Pengeluaran: Rp ${Number(balance.expense).toLocaleString("id-ID")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
