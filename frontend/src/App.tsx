import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import { WalletProvider } from './features/blockchain/WalletContext';
import { ToastProvider } from './components/ui/ToastContext';

function App() {
  return (
    <WalletProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="transaksi" element={<div className="p-7">Halaman Transaksi (Segera Hadir)</div>} />
              <Route path="ekspor" element={<div className="p-7">Halaman Ekspor (Segera Hadir)</div>} />
              <Route path="verifikasi" element={<div className="p-7">Halaman Verifikasi (Segera Hadir)</div>} />
              <Route path="pengaturan" element={<div className="p-7">Halaman Pengaturan (Segera Hadir)</div>} />
              <Route path="*" element={<div className="p-7">404 - Halaman tidak ditemukan</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </WalletProvider>
  );
}

export default App;
