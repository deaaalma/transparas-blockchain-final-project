import { ethers } from "hardhat";

async function main() {
  console.log("Memulai proses seeding data transaksi Banjar dummy...");

  const [owner] = await ethers.getSigners();
  console.log("Menggunakan akun bendahara:", owner.address);

  const KasOrganisasi = await ethers.getContractFactory("KasOrganisasi");
  const kas = await KasOrganisasi.deploy();
  await kas.waitForDeployment();
  
  const contractAddress = await kas.getAddress();
  console.log("Kontrak KasOrganisasi berhasil di-deploy pada alamat:", contractAddress);
  console.log("Mempersiapkan data 6 bulan terakhir...\n");

  const now = Math.floor(Date.now() / 1000);
  const day = 86400;
  const month = 30 * day;

  // Format: [Kategori] Deskripsi
  const data = [
    // ── PEMASUKAN (6 bulan terakhir) ──────────────────────────────────────────
    { keterangan: "[Dana Punia] Dana Punia Warga Banjar Bulan Januari",    nominal: 8500000, isIncome: true,  timeOffset: 5 * month },
    { keterangan: "[Iuran Anggota] Iuran bulanan KK Banjar Januari",        nominal: 3200000, isIncome: true,  timeOffset: 5 * month - 3 * day },

    { keterangan: "[Dana Punia] Dana Punia Piodalan Galungan",              nominal: 12000000, isIncome: true, timeOffset: 4 * month },
    { keterangan: "[Donasi] Donasi CSR PT. Bali Indah Lestari",             nominal: 5000000, isIncome: true,  timeOffset: 4 * month - 5 * day },
    { keterangan: "[Iuran Anggota] Iuran bulanan KK Banjar Februari",       nominal: 3200000, isIncome: true,  timeOffset: 4 * month - 7 * day },

    { keterangan: "[Dana Punia] Dana Punia Kuningan dari Banjar",           nominal: 9000000, isIncome: true,  timeOffset: 3 * month },
    { keterangan: "[Iuran Anggota] Iuran bulanan KK Banjar Maret",          nominal: 3200000, isIncome: true,  timeOffset: 3 * month - 3 * day },

    { keterangan: "[Dana Punia] Dana Punia Nyepi",                          nominal: 7500000, isIncome: true,  timeOffset: 2 * month },
    { keterangan: "[Donasi] Sumbangan Wisatawan Mancanegara",               nominal: 2000000, isIncome: true,  timeOffset: 2 * month - 4 * day },
    { keterangan: "[Iuran Anggota] Iuran bulanan KK Banjar April",          nominal: 3200000, isIncome: true,  timeOffset: 2 * month - 5 * day },

    { keterangan: "[Dana Punia] Dana Punia Bulan Mei",                      nominal: 6000000, isIncome: true,  timeOffset: 1 * month },
    { keterangan: "[Iuran Anggota] Iuran bulanan KK Banjar Mei",            nominal: 3200000, isIncome: true,  timeOffset: 1 * month - 2 * day },

    { keterangan: "[Dana Punia] Dana Punia Awal Bulan Juni",                nominal: 4000000, isIncome: true,  timeOffset: 5 * day },

    // ── PENGELUARAN ───────────────────────────────────────────────────────────
    { keterangan: "[Keagamaan] Banten & Sesajen Upacara Galungan",          nominal: 4500000, isIncome: false, timeOffset: 4 * month - 1 * day },
    { keterangan: "[Keagamaan] Sewa Sound System & Tenda Kuningan",         nominal: 3000000, isIncome: false, timeOffset: 3 * month + 2 * day },
    { keterangan: "[Keagamaan] Pembelian Canang & Perlengkapan Pura",       nominal: 1200000, isIncome: false, timeOffset: 3 * month - 5 * day },
    { keterangan: "[Keagamaan] Biaya Upacara Piodalan Pura Banjar",         nominal: 6000000, isIncome: false, timeOffset: 2 * month - 2 * day },
    { keterangan: "[Keagamaan] Banten Nyepi & Pengerupukan",                nominal: 2200000, isIncome: false, timeOffset: 2 * month - 8 * day },
    { keterangan: "[Keagamaan] Dekorasi & Hiasan Upakara Bulan Juni",       nominal: 1500000, isIncome: false, timeOffset: 3 * day },

    { keterangan: "[Sosial] Bantuan Duka Cita Keluarga Bapak Wayan",        nominal: 1000000, isIncome: false, timeOffset: 5 * month - 10 * day },
    { keterangan: "[Sosial] Santunan Warga Kurang Mampu",                   nominal: 1500000, isIncome: false, timeOffset: 4 * month - 15 * day },
    { keterangan: "[Sosial] Bantuan Biaya Pernikahan Warga",                nominal: 2000000, isIncome: false, timeOffset: 3 * month - 20 * day },
    { keterangan: "[Sosial] Sumbangan Beasiswa Siswa Berprestasi",          nominal: 1000000, isIncome: false, timeOffset: 2 * month - 12 * day },
    { keterangan: "[Sosial] Bantuan Pengobatan Lansia Banjar",              nominal: 800000,  isIncome: false, timeOffset: 1 * month - 8 * day },

    { keterangan: "[Operasional] Biaya Listrik & Air Balai Banjar",         nominal: 650000,  isIncome: false, timeOffset: 5 * month - 2 * day },
    { keterangan: "[Konsumsi] Konsumsi Rapat Bulanan Bulan Januari",        nominal: 350000,  isIncome: false, timeOffset: 5 * month - 4 * day },
    { keterangan: "[Operasional] Pembelian ATK & Alat Tulis Kantor",        nominal: 450000,  isIncome: false, timeOffset: 4 * month - 10 * day },
    { keterangan: "[Konsumsi] Konsumsi Gotong Royong Banjar",               nominal: 400000,  isIncome: false, timeOffset: 3 * month - 7 * day },
    { keterangan: "[Operasional] Cetak Spanduk & Baliho Acara",             nominal: 600000,  isIncome: false, timeOffset: 2 * month - 6 * day },
    { keterangan: "[Konsumsi] Snack & Minuman Rapat Mei",                   nominal: 250000,  isIncome: false, timeOffset: 1 * month - 5 * day },

    { keterangan: "[Infrastruktur] Perbaikan Atap Balai Banjar",            nominal: 5500000, isIncome: false, timeOffset: 4 * month - 20 * day },
    { keterangan: "[Infrastruktur] Pengecatan Tembok Pura",                 nominal: 1800000, isIncome: false, timeOffset: 2 * month - 15 * day },
    { keterangan: "[Infrastruktur] Perbaikan Instalasi Listrik Balai",      nominal: 900000,  isIncome: false, timeOffset: 1 * month - 12 * day },

    { keterangan: "[Dana Darurat] Simpanan Kas Darurat Banjar Bulan Feb",   nominal: 1500000, isIncome: false, timeOffset: 4 * month - 8 * day },
    { keterangan: "[Dana Darurat] Tambahan Dana Cadangan Maret",            nominal: 1000000, isIncome: false, timeOffset: 3 * month - 10 * day },
    { keterangan: "[Dana Darurat] Simpanan Kas Darurat Bulan April",        nominal: 1000000, isIncome: false, timeOffset: 2 * month - 10 * day },
  ];

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const txTime = now - d.timeOffset;
    
    console.log(`[${i+1}/${data.length}] Mencatat: ${d.keterangan}`);
    
    const tx = await (kas as any).addPastTransaction(
      d.keterangan,
      d.nominal,
      d.isIncome,
      txTime
    );
    await tx.wait();
  }

  const balance = await (kas as any).getBalance();
  console.log("\n✅ Seeding selesai!");
  console.log("Total Pemasukan : Rp", balance.income.toString());
  console.log("Total Pengeluaran : Rp", balance.expense.toString());
  console.log("Saldo Akhir : Rp", balance.balance.toString());
  
  console.log("\n👉 Langkah Selanjutnya:");
  console.log("Update variabel VITE_CONTRACT_ADDRESS di folder frontend/.env dengan address ini:");
  console.log(contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
