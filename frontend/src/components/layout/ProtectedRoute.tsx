import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Jika tidak ada token (belum login), kembalikan ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, izinkan mengakses halaman turunan (Outlet)
  return <Outlet />;
}
