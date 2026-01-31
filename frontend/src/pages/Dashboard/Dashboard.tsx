import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { roomApi, bookingApi } from '../../services/api'
import type { Room, Booking } from '../../services/api'

const Dashboard = () => {
  const { user } = useAuth()
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, bookingsData] = await Promise.all([
          roomApi.getAll(),
          bookingApi.getAll(),
        ])
        setRooms(roomsData.slice(0, 3))
        const userBookings = bookingsData.filter(
          (b) => b.createdBy === user?.email
        )
        setBookings(userBookings.filter((b) => new Date(b.startTime) > new Date()))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="section-container">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xl text-blue-100">
            Manage your bookings and explore available rooms
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/rooms"
            className="feature-card group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Rooms</h3>
            <p className="text-gray-600">View all available meeting rooms</p>
          </Link>

          <Link
            to="/my-bookings"
            className="feature-card group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">My Bookings</h3>
            <p className="text-gray-600">
              {bookings.length} upcoming {bookings.length === 1 ? 'booking' : 'bookings'}
            </p>
          </Link>

          <Link
            to="/profile"
            className="feature-card group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👤</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Profile</h3>
            <p className="text-gray-600">Update your account information</p>
          </Link>
        </div>

        {/* Featured Rooms */}
        <div className="card p-8 mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-6">Featured Rooms</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner h-12 w-12 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Link
                  key={room.id}
                  to={`/rooms/${room.id}`}
                  className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {room.location}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="badge-primary text-xs">👥 {room.capacity} people</span>
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Bookings Preview */}
        {bookings.length > 0 && (
          <div className="card p-8">
            <h2 className="text-3xl font-bold gradient-text mb-6">Your Upcoming Bookings</h2>
            <div className="space-y-4">
              {bookings.slice(0, 3).map((booking) => (
                <div
                  key={booking.id}
                  className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <h3 className="font-bold text-gray-900 mb-2">{booking.title}</h3>
                  <p className="text-sm text-gray-600">
                    📅 {new Date(booking.startTime).toLocaleDateString()} at{' '}
                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-gray-600">
                    🏢 {booking.room?.name || `Room ${booking.roomId}`}
                  </p>
                </div>
              ))}
            </div>
            {bookings.length > 3 && (
              <div className="mt-6 text-center">
                <Link to="/my-bookings" className="text-blue-600 hover:text-blue-700 font-semibold">
                  View All Bookings →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
