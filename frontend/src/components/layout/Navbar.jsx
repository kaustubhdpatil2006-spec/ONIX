import { useNavigate } from 'react-router-dom'
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
      <span className="font-bold text-lg">Legal Metrology Checker</span>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-600">{user.name}</span>

            {/* Simple role badge — colored pill */}
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