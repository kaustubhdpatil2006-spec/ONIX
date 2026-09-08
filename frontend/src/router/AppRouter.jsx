import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

// Pages
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import ScanPage from '../pages/ScanPage'
import ResultsPage from '../pages/ResultsPage'
import ReportPage from '../pages/ReportPage'
import AdminPage from '../pages/AdminPage'

// Guard component
import ProtectedRoute from '../components/auth/ProtectedRoute'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected: any logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Route>

        {/* Protected: Admin only */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}