import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { Button } from '../ui/button'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <div className="flex items-center gap-6">
        <span className="font-bold text-lg">Legal Metrology Checker</span>

        {/* In-app navigation — Link uses React Router, no full page reload */}
        <div className="flex items-center gap-4 text-sm">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </Link>
          <Link to="/scan" className="text-gray-600 hover:text-gray-900">
            Scan
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">
              Admin
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-600">{user.name}</span>

            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {user.role === 'admin' ? 'Admin' : 'Officer'}
            </span>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}