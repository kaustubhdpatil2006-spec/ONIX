import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import PageWrapper from '../layout/PageWrapper'

export default function ProtectedRoute({ requiredRole }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  // Every protected page now automatically gets the Navbar
  return (
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  )
}