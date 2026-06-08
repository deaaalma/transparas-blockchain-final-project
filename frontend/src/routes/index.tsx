import { Routes, Route } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import TransactionPage from '../pages/TransactionPage'
import TransactionDetailPage from '../pages/TransactionDetailPage'
import ProfilePage from '../pages/ProfilePage'
import AnalyticsPage from '../pages/AnalyticsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="transaksi" element={<TransactionPage />} />
        <Route path="transaksi/:id" element={<TransactionDetailPage />} />
        <Route path="profil" element={<ProfilePage />} />

        <Route path="verifikasi" element={<div className="p-7">Halaman Verifikasi (Segera Hadir)</div>} />
        <Route path="pengaturan" element={<div className="p-7">Halaman Pengaturan (Segera Hadir)</div>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}
