import { ethers } from "hardhat";

async function main() {
  console.log("Memulai proses seeding data transaksi dummy...");

  // Ganti dengan alamat kontrak KasOrganisasi yang aktif (setelah di-deploy)
  // Untuk keperluan ini, kita akan deploy instance baru atau mencari file ignition
  // Karena script ini berdiri sendiri, idealnya kita tahu alamat kontraknya.
  // Tapi untuk otomatisasi, kita akan deploy ulang kontrak KasOrganisasi ke localhost
  // dan menembakkan data. (Biasanya seeder digabung dengan script deploy/ignition).
  // Di sini kita deploy baru agar selalu bersih.
  
  const [owner] = await ethers.getSigners();
  console.log("Menggunakan akun bendahara:", owner.address);

  const KasOrganisasi = await ethers.getContractFactory("KasOrganisasi");
  const kas = await KasOrganisasi.deploy();
  await kas.waitForDeployment();
  
  const contractAddress = await kas.getAddress();
  console.log("Kontrak KasOrganisasi berhasil di-deploy pada alamat:", contractAddress);
  console.log("Mempersiapkan data 6 bulan terakhir...\n");

  const now = Math.floor(Date.now() / 1000);
  const oneMonth = 30 * 24 * 60 * 60;

  const dummyData = [
    // Bulan -5
    { keterangan: "Dana Punia Warga Banjar", nominal: 5000000, isIncome: true, timeOffset: 5 * oneMonth },
    { keterangan: "Biaya Operasional", nominal: 1500000, isIncome: false, timeOffset: 5 * oneMonth },
    { keterangan: "Sumbangan Turis", nominal: 1000000, isIncome: true, timeOffset: 5 * oneMonth - 2 * 86400 },
    
    // Bulan -4
    { keterangan: "Dana Punia Banjar Adat", nominal: 3500000, isIncome: true, timeOffset: 4 * oneMonth },
    { keterangan: "Beli Banten Upacara", nominal: 2000000, isIncome: false, timeOffset: 4 * oneMonth - 86400 },
    
    // Bulan -3
    { keterangan: "Dana Punia Piodalan", nominal: 10000000, isIncome: true, timeOffset: 3 * oneMonth },
    { keterangan: "Sewa Tenda & Sound System", nominal: 4000000, isIncome: false, timeOffset: 3 * oneMonth - 5 * 86400 },
    { keterangan: "Konsumsi Rapat Adat", nominal: 500000, isIncome: false, timeOffset: 3 * oneMonth - 10 * 86400 },
    
    // Bulan -2
    { keterangan: "Donasi CSR Perusahaan", nominal: 8000000, isIncome: true, timeOffset: 2 * oneMonth },
    { keterangan: "Perbaikan Atap Balai Banjar", nominal: 5500000, isIncome: false, timeOffset: 2 * oneMonth - 3 * 86400 },
    
    // Bulan -1
    { keterangan: "Dana Punia Bulanan", nominal: 4500000, isIncome: true, timeOffset: 1 * oneMonth },
    { keterangan: "Biaya Listrik & Air", nominal: 600000, isIncome: false, timeOffset: 1 * oneMonth - 2 * 86400 },
    { keterangan: "Pembelian ATK & Printer", nominal: 1200000, isIncome: false, timeOffset: 1 * oneMonth - 7 * 86400 },

    // Bulan Ini (Sekarang)
    { keterangan: "Dana Punia Turis Mancanegara", nominal: 2500000, isIncome: true, timeOffset: 2 * 86400 },
    { keterangan: "Beli Kopi & Snack Rapat", nominal: 200000, isIncome: false, timeOffset: 1 * 86400 },
  ];

  for (let i = 0; i < dummyData.length; i++) {
    const data = dummyData[i];
    const txTime = now - data.timeOffset;
    
    console.log(`[${i+1}/${dummyData.length}] Mencatat: ${data.keterangan}`);
    
    const tx = await kas.addPastTransaction(
      data.keterangan,
      data.nominal,
      data.isIncome,
      txTime
    );
    await tx.wait();
  }

  const balance = await kas.getBalance();
  console.log("\n✅ Seeding selesai!");
  console.log("Total Pemasukan : Rp", balance.income.toString());
  console.log("Total Pengeluaran : Rp", balance.expense.toString());
  console.log("Saldo Akhir : Rp", balance.balance.toString());
  
  console.log("\n👉 Langkah Selanjutnya:");
  console.log("Update variabel CONTRACT_ADDRESS di frontend dengan address ini:");
  console.log(contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
