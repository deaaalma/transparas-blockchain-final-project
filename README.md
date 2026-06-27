# 🏝️ TransParas - Platform Transparansi Keuangan Desa Adat Bali Berbasis Blockchain

![TransParas Cover](https://github.com/deaaalma/transparas-blockchain-final-project/assets/cover-placeholder.png) <!-- Ganti URL ini dengan URL screenshot aplikasimu yang paling bagus -->

**TransParas** adalah sebuah purwarupa sistem pelaporan kas/keuangan untuk Desa Adat atau Banjar di Bali yang diintegrasikan dengan teknologi **Blockchain (Polygon Amoy Testnet)** dan **IPFS (InterPlanetary File System)**. Sistem ini menjamin transparansi, kekekalan data (immutable), dan desentralisasi informasi, sehingga mencegah terjadinya manipulasi dana organisasi.

Proyek ini dibuat sebagai pemenuhan **Tugas Mata Kuliah Blockchain**.

---

## ✨ Fitur Utama

- **Laporan Keuangan Publik**: Warga dapat melihat laporan pemasukan dan pengeluaran secara real-time tanpa perlu login.
- **Pencatatan Permanen (On-Chain)**: Semua data transaksi yang disahkan oleh Bendahara akan ditulis langsung ke dalam Smart Contract di jaringan Polygon Amoy.
- **Penyimpanan Bukti Terdesentralisasi (IPFS)**: Bukti transaksi/nota diunggah ke jaringan IPFS (menggunakan Pinata) sehingga gambar tidak bisa dihapus atau diubah secara sepihak.
- **Analytics & Visualisasi Data**: Grafik interaktif arus kas organisasi menggunakan Recharts.
- **AI Assistant**: Integrasi asisten AI interaktif untuk membantu warga membaca ringkasan data keuangan.
- **Keamanan Peran (Role-Based Access)**: Hanya pemilik Smart Contract (Bendahara/Admin) yang dapat menambahkan transaksi baru.

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan arsitektur modern (Web3 / DApp):

### Frontend (Client-side)
- **Framework**: React.js (Vite) + TypeScript
- **Styling**: TailwindCSS + Framer Motion (Animasi)
- **Web3 Library**: `ethers.js` (v6) untuk komunikasi dengan MetaMask dan Blockchain
- **Charts**: Recharts

### Backend (Server-side)
- **Framework**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Storage**: Pinata (IPFS) untuk upload gambar nota

### Blockchain (Smart Contract)
- **Bahasa**: Solidity (`^0.8.24`)
- **Development Environment**: Hardhat
- **Jaringan**: Polygon Amoy Testnet

---

## 🚀 Panduan Instalasi (Cara Menjalankan di Local)

Untuk menjalankan proyek ini di komputer (localhost), pastikan kamu sudah menginstal **Node.js** dan memiliki akun **MetaMask** di browsermu.

### 1. Kloning Repositori
```bash
git clone https://github.com/deaaalma/transparas-blockchain-final-project.git
cd transparas-blockchain-final-project
```

### 2. Setup Backend (Express + PostgreSQL)
```bash
cd backend
npm install
```
- Buat file `.env` di dalam folder `backend/` (lihat `.env.example`).
- Jalankan migrasi database: `npx prisma db push`
- Jalankan server: `npm run dev` (berjalan di port 3000)

### 3. Setup Frontend (React)
Buka terminal baru:
```bash
cd frontend
npm install
```
- Buat file `.env` di dalam folder `frontend/` (lihat `.env.example`).
- Jalankan website: `npm run dev` (berjalan di port 5173)

### 4. Setup Smart Contract (Hardhat) - *Opsional jika hanya ingin melihat*
Buka terminal baru:
```bash
cd smart_contracts
npm install
```
- Buat file `.env` dan masukkan `PRIVATE_KEY` serta `POLYGONSCAN_API_KEY`.
- Untuk *deploy* ulang (jika perlu): `npx hardhat run scripts/deploy.ts --network polygonAmoy`

---

## 🔗 Informasi Blockchain

- **Jaringan**: Polygon Amoy (Testnet)
- **Chain ID**: `80002`
- **Smart Contract Address**: [`0xBE4FF6a8A141d05827Fb7581B03e30fe01257f62`](https://amoy.polygonscan.com/address/0xBE4FF6a8A141d05827Fb7581B03e30fe01257f62#code) *(Verified)*

---

## 📄 Struktur Direktori
- `/frontend` - Kode sumber antarmuka pengguna (React).
- `/backend` - Kode sumber API dan Database (Express + Prisma).
- `/smart_contracts` - Source code Solidity dan skrip *deployment* Hardhat.

---

*Dibuat untuk pemenuhan Tugas Mata Kuliah Blockchain.*
