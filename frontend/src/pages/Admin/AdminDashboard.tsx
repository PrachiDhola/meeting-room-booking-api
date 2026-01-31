import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { roomApi, bookingApi } from '../../services/api'
import type { Booking } from '../../services/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
    upcomingBookings: 0,
    todayBookings: 0,
  })
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rooms, bookings] = await Promise.all([
          roomApi.getAll(),
          bookingApi.getAll(),
        ])

        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const upcomingBookings = bookings.filter(b => new Date(b.startTime) > now)
        const todayBookings = bookings.filter(b => {
          const bookingDate = new Date(b.startTime)
          return bookingDate >= today && bookingDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
        })

        setStats({
          totalRooms: rooms.length,
          totalBookings: bookings.length,
          upcomingBookings: upcomingBookings.length,
          todayBookings: todayBookings.length,
        })

        // Get recent bookings (last 5)
        const sortedBookings = bookings
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
        setRecentBookings(sortedBookings)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-16 w-16 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="section-container">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-purple-100">
            Manage rooms, bookings, and system overview
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRooms}</p>
              </div>
              <div className="text-4xl">🏢</div>
            </div>
            <Link to="/admin/rooms" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 inline-block">
              Manage Rooms →
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
            <Link to="/admin/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 inline-block">
              View All →
            </Link>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingBookings}</p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todayBookings}</p>
              </div>
              <div className="text-4xl">📆</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/rooms"
            className="feature-card group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🏢</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Rooms</h3>
            <p className="text-gray-600">Create, edit, and delete meeting rooms</p>
          </Link>

          <Link
            to="/admin/bookings"
            className="feature-card group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">View Bookings</h3>
            <p className="text-gray-600">View and manage all bookings</p>
          </Link>

          <Link
            to="/admin/rooms/new"
            className="feature-card group"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">➕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Room</h3>
            <p className="text-gray-600">Create a new meeting room</p>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <p className="text-gray-600">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">{booking.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Room:</span> {booking.room?.name || `Room ${booking.roomId}`}
                        </p>
                        <p>
                          <span className="font-semibold">Time:</span> {formatDate(booking.startTime)} - {formatDate(booking.endTime)}
                        </p>
                        <p>
                          <span className="font-semibold">Booked by:</span> {booking.createdBy}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
