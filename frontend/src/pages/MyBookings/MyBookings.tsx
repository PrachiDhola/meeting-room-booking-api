import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { bookingApi } from '../../services/api'
import type { Booking } from '../../services/api'

const MyBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const allBookings = await bookingApi.getAll()
        // Filter bookings for current user (by email for now, will be by ID in Phase 3)
        const userBookings = allBookings.filter(
          (booking) => booking.createdBy === user?.email
        )
        setBookings(userBookings)
        setError(null)
      } catch (err) {
        setError('Failed to load bookings. Please try again later.')
        console.error('Error fetching bookings:', err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [user])

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      await bookingApi.delete(id)
      setBookings(bookings.filter((b) => b.id !== id))
    } catch (err) {
      alert('Failed to cancel booking. Please try again.')
      console.error('Error canceling booking:', err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date()
  }

  const upcomingBookings = bookings.filter((b) => isUpcoming(b.startTime))
  const pastBookings = bookings.filter((b) => !isUpcoming(b.startTime))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your meeting room bookings</p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Upcoming Bookings */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Bookings</h2>
              {upcomingBookings.length === 0 ? (
                <p className="text-gray-600">No upcoming bookings.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                              {booking.title}
                            </h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                <span className="font-semibold">Room:</span>{' '}
                                {booking.room?.name || `Room ID: ${booking.roomId}`}
                              </p>
                              <p>
                                <span className="font-semibold">Location:</span>{' '}
                                {booking.room?.location || 'N/A'}
                              </p>
                              <p>
                                <span className="font-semibold">Start:</span> {formatDate(booking.startTime)}
                              </p>
                              <p>
                                <span className="font-semibold">End:</span> {formatDate(booking.endTime)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Past Bookings */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Bookings</h2>
              {pastBookings.length === 0 ? (
                <p className="text-gray-600">No past bookings.</p>
              ) : (
                <div className="space-y-4">
                  {pastBookings
                    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75"
                      >
                        <h3 className="font-semibold text-gray-800 mb-2">{booking.title}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-semibold">Room:</span>{' '}
                            {booking.room?.name || `Room ID: ${booking.roomId}`}
                          </p>
                          <p>
                            <span className="font-semibold">Date:</span> {formatDate(booking.startTime)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {bookings.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
                <Link
                  to="/rooms"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Rooms
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MyBookings
