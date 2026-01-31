import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Meeting Room Booking
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/rooms"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Browse Rooms
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-bookings"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  My Bookings
                </Link>
                <div className="flex items-center gap-4 pl-4 border-l border-gray-300">
                  <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-300">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
