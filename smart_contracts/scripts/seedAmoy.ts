import { ethers } from "hardhat";

/**
 * Seed script for LIVE Polygon Amoy testnet.
 * Uses addPastTransaction to inject realistic Banjar data
 * with the new [Kategori] format used by the frontend.
 *
 * Run: npx hardhat run scripts/seedAmoy.ts --network polygonAmoy
 */

const CONTRACT_ADDRESS = "0xBE4FF6a8A141d05827Fb7581B03e30fe01257f62";

async function main() {
  console.log("🌐 Connecting to Polygon Amoy...");

  const [owner] = await ethers.getSigners();
  console.log("✅ Bendahara wallet  :", owner.address);
  console.log("📄 Contract address  :", CONTRACT_ADDRESS);

  const KasOrganisasi = await ethers.getContractAt("KasOrganisasi", CONTRACT_ADDRESS, owner);

  const now = Math.floor(Date.now() / 1000);
  const day = 86400;
  const month = 30 * day;

  // ─── Seed Data ───────────────────────────────────────────────────────────────
  // Income must come BEFORE expenses to satisfy the "saldo cukup" check
  // Format: [Kategori] Deskripsi
  const data = [
    // ── PEMASUKAN (6 bulan terakhir) ──────────────────────────────────────────
    { keterangan: "[Dana Punia] Dana Punia Warga Banjar Bulan Januari",    nominal: 8_500_000, isIncome: true,  timeOffset: 5 * month },
    { keterangan: "[Iuran Anggota] Iuran bulanan KK Banjar Januari",        nominal: 3_200_000, isIncome: true,  timeOffset: 5 * month - 3 * day },

    { keterangan: "[Dana Punia] Dana Punia Piodalan Galungan",              nominal: 12_000_000, isIncome: true, timeOffset: 4 * month },
    { keterangan: "[Donasi] Donasi CSR PT. Bali Indah Lestari",             nominal: 5_000_000, isIncome: true,  timeOffset: 4 * month - 5 * day },
    { keterangan: "[Iuran Anggota] Iuran bulanan KK Banjar Februari",       nominal: 3_200_000, isIncome: true,  timeOffset: 4 * month - 7 * day },

    { keterangan: "[Dana Punia] Dana Punia Kuningan dari Banjar",           nominal: 9_000_000, isIncome: true,  timeOffset: 3 * month },
    { keterangan: "[Iuran Anggota] Iuran bulanan KK Banjar Maret",          nominal: 3_200_000, isIncome: true,  timeOffset: 3 * month - 3 * day },

    { keterangan: "[Dana Punia] Dana Punia Nyepi",                          nominal: 7_500_000, isIncome: true,  timeOffset: 2 * month },
    { keterangan: "[Donasi] Sumbangan Wisatawan Mancanegara",               nominal: 2_000_000, isIncome: true,  timeOffset: 2 * month - 4 * day },
    { keterangan: "[Iuran Anggota] Iuran bulanan KK Banjar April",          nominal: 3_200_000, isIncome: true,  timeOffset: 2 * month - 5 * day },

    { keterangan: "[Dana Punia] Dana Punia Bulan Mei",                      nominal: 6_000_000, isIncome: true,  timeOffset: 1 * month },
    { keterangan: "[Iuran Anggota] Iuran bulanan KK Banjar Mei",            nominal: 3_200_000, isIncome: true,  timeOffset: 1 * month - 2 * day },

    { keterangan: "[Dana Punia] Dana Punia Awal Bulan Juni",                nominal: 4_000_000, isIncome: true,  timeOffset: 5 * day },

    // ── PENGELUARAN ───────────────────────────────────────────────────────────
    // Keagamaan – sekitar 35%
    { keterangan: "[Keagamaan] Banten & Sesajen Upacara Galungan",          nominal: 4_500_000, isIncome: false, timeOffset: 4 * month - 1 * day },
    { keterangan: "[Keagamaan] Sewa Sound System & Tenda Kuningan",         nominal: 3_000_000, isIncome: false, timeOffset: 3 * month + 2 * day },
    { keterangan: "[Keagamaan] Pembelian Canang & Perlengkapan Pura",       nominal: 1_200_000, isIncome: false, timeOffset: 3 * month - 5 * day },
    { keterangan: "[Keagamaan] Biaya Upacara Piodalan Pura Banjar",         nominal: 6_000_000, isIncome: false, timeOffset: 2 * month - 2 * day },
    { keterangan: "[Keagamaan] Banten Nyepi & Pengerupukan",                nominal: 2_200_000, isIncome: false, timeOffset: 2 * month - 8 * day },
    { keterangan: "[Keagamaan] Dekorasi & Hiasan Upakara Bulan Juni",       nominal: 1_500_000, isIncome: false, timeOffset: 3 * day },

    // Sosial – sekitar 20%
    { keterangan: "[Sosial] Bantuan Duka Cita Keluarga Bapak Wayan",        nominal: 1_000_000, isIncome: false, timeOffset: 5 * month - 10 * day },
    { keterangan: "[Sosial] Santunan Warga Kurang Mampu",                   nominal: 1_500_000, isIncome: false, timeOffset: 4 * month - 15 * day },
    { keterangan: "[Sosial] Bantuan Biaya Pernikahan Warga",                nominal: 2_000_000, isIncome: false, timeOffset: 3 * month - 20 * day },
    { keterangan: "[Sosial] Sumbangan Beasiswa Siswa Berprestasi",          nominal: 1_000_000, isIncome: false, timeOffset: 2 * month - 12 * day },
    { keterangan: "[Sosial] Bantuan Pengobatan Lansia Banjar",              nominal: 800_000,   isIncome: false, timeOffset: 1 * month - 8 * day },

    // Operasional – sekitar 20% (termasuk Konsumsi yang digabung)
    { keterangan: "[Operasional] Biaya Listrik & Air Balai Banjar",         nominal: 650_000,   isIncome: false, timeOffset: 5 * month - 2 * day },
    { keterangan: "[Konsumsi] Konsumsi Rapat Bulanan Bulan Januari",        nominal: 350_000,   isIncome: false, timeOffset: 5 * month - 4 * day },
    { keterangan: "[Operasional] Pembelian ATK & Alat Tulis Kantor",        nominal: 450_000,   isIncome: false, timeOffset: 4 * month - 10 * day },
    { keterangan: "[Konsumsi] Konsumsi Gotong Royong Banjar",               nominal: 400_000,   isIncome: false, timeOffset: 3 * month - 7 * day },
    { keterangan: "[Operasional] Cetak Spanduk & Baliho Acara",             nominal: 600_000,   isIncome: false, timeOffset: 2 * month - 6 * day },
    { keterangan: "[Konsumsi] Snack & Minuman Rapat Mei",                   nominal: 250_000,   isIncome: false, timeOffset: 1 * month - 5 * day },

    // Infrastruktur – sekitar 15%
    { keterangan: "[Infrastruktur] Perbaikan Atap Balai Banjar",            nominal: 5_500_000, isIncome: false, timeOffset: 4 * month - 20 * day },
    { keterangan: "[Infrastruktur] Pengecatan Tembok Pura",                 nominal: 1_800_000, isIncome: false, timeOffset: 2 * month - 15 * day },
    { keterangan: "[Infrastruktur] Perbaikan Instalasi Listrik Balai",      nominal: 900_000,   isIncome: false, timeOffset: 1 * month - 12 * day },

    // Dana Darurat – sekitar 10%
    { keterangan: "[Dana Darurat] Simpanan Kas Darurat Banjar Bulan Feb",   nominal: 1_500_000, isIncome: false, timeOffset: 4 * month - 8 * day },
    { keterangan: "[Dana Darurat] Tambahan Dana Cadangan Maret",            nominal: 1_000_000, isIncome: false, timeOffset: 3 * month - 10 * day },
    { keterangan: "[Dana Darurat] Simpanan Kas Darurat Bulan April",        nominal: 1_000_000, isIncome: false, timeOffset: 2 * month - 10 * day },
  ];

  // ─── Run Transactions ──────────────────────────────────────────────────────
  console.log(`\n📝 Akan mencatat ${data.length} transaksi ke blockchain...\n`);

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const txTime = now - d.timeOffset;
    const jenis = d.isIncome ? "🟢 MASUK  " : "🔴 KELUAR ";

    console.log(`[${String(i + 1).padStart(2, "0")}/${data.length}] ${jenis} Rp ${d.nominal.toLocaleString("id-ID").padStart(12)} | ${d.keterangan}`);

    const tx = await (KasOrganisasi as any).addPastTransaction(d.keterangan, d.nominal, d.isIncome, txTime);
    await tx.wait();
  }

  // ─── Summary ───────────────────────────────────────────────────────────────
  const balance = await (KasOrganisasi as any).getBalance();
  console.log("\n════════════════════════════════════════════════");
  console.log("✅  SEEDING SELESAI!");
  console.log("════════════════════════════════════════════════");
  console.log(`💰  Total Pemasukan  : Rp ${Number(balance.income).toLocaleString("id-ID")}`);
  console.log(`💸  Total Pengeluaran: Rp ${Number(balance.expense).toLocaleString("id-ID")}`);
  console.log(`🏦  Saldo Akhir      : Rp ${Number(balance.balance).toLocaleString("id-ID")}`);
  console.log("════════════════════════════════════════════════");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
