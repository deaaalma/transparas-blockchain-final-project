import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import LandingPage from '../pages/LandingPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import TransactionPage from '../pages/TransactionPage'
import TransactionDetailPage from '../pages/TransactionDetailPage'
import ProfilePage from '../pages/ProfilePage'
import AnalyticsPage from '../pages/AnalyticsPage'
import VerificationPage from '../pages/VerificationPage'
import SettingsPage from '../pages/SettingsPage'

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Public Dashboard Routes (Warga & Admin) */}
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="transaksi" element={<TransactionPage />} />
        <Route path="transaksi/:id" element={<TransactionDetailPage />} />
        <Route path="profil" element={<ProfilePage />} />
        <Route path="verifikasi" element={<VerificationPage />} />
        
        {/* Protected Settings Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="pengaturan" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Legacy redirect */}
      <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
