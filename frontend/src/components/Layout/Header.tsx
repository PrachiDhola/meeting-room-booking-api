import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()

  return (
    <header className="bg-white shadow-professional sticky top-0 z-50 border-b border-gray-100">
      <nav className="section-container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🏢</span>
            <span className="text-xl sm:text-2xl font-bold gradient-text">
              MeetingRoom
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
            <Link
              to="/"
              className="hidden sm:inline text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base"
            >
              Home
            </Link>
            <Link
              to="/rooms"
              className="hidden sm:inline text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base"
            >
              Browse Rooms
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="hidden md:inline text-purple-600 hover:text-purple-700 transition-colors font-medium text-sm sm:text-base"
              >
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hidden md:inline text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base"
                >
                  Dashboard
                </Link>
                <Link
                  to="/my-bookings"
                  className="hidden md:inline text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm sm:text-base"
                >
                  My Bookings
                </Link>
                <div className="hidden sm:flex items-center gap-2 md:gap-4 pl-2 md:pl-6 border-l border-gray-200">
                  <div className="hidden md:flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">Hi, {user?.name}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="btn-ghost text-xs sm:text-sm"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="btn-secondary text-xs sm:text-sm px-3 sm:px-6"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4 pl-2 sm:pl-6 border-l border-gray-200">
                <Link
                  to="/login"
                  className="btn-ghost text-xs sm:text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs sm:text-sm px-3 sm:px-6"
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
