import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { bookingApi } from '../../services/api'
import type { Booking } from '../../services/api'

const MyBookings = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState<number | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const allBookings = await bookingApi.getAll()
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
      setCancelLoading(id)
      await bookingApi.delete(id)
      setBookings(bookings.filter((b) => b.id !== id))
      showToast('Booking cancelled successfully', 'success')
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to cancel booking. Please try again.'
      showToast(errorMsg, 'error')
      console.error('Error canceling booking:', err)
    } finally {
      setCancelLoading(null)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="section-container">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">My Bookings</h1>
          <p className="text-xl text-blue-100">View and manage your meeting room bookings</p>
        </div>
      </div>

      <div className="section-container py-12">
        {loading && (
          <div className="text-center py-20">
            <div className="spinner h-16 w-16 mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading bookings...</p>
          </div>
        )}

        {error && (
          <div className="alert-error mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Upcoming Bookings */}
            <div className="card p-8 mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upcoming Bookings
                <span className="text-lg text-gray-500 font-normal">
                  ({upcomingBookings.length})
                </span>
              </h2>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📆</div>
                  <p className="text-gray-600 text-lg mb-4">No upcoming bookings.</p>
                  <Link to="/rooms" className="btn-primary inline-block">
                    Browse Rooms
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50 transition-all"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-3 text-xl">{booking.title}</h3>
                            <div className="space-y-2 text-sm text-gray-700">
                              <p className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="font-semibold">Room:</span>
                                {booking.room?.name || `Room ID: ${booking.roomId}`}
                              </p>
                              <p className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-semibold">Location:</span>
                                {booking.room?.location || 'N/A'}
                              </p>
                              <p className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-semibold">Start:</span>
                                {formatDate(booking.startTime)}
                              </p>
                              <p className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-semibold">End:</span>
                                {formatDate(booking.endTime)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleCancel(booking.id)}
                            disabled={cancelLoading === booking.id}
                            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all transform hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {cancelLoading === booking.id ? (
                              <span className="flex items-center gap-2">
                                <div className="spinner h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Canceling...
                              </span>
                            ) : (
                              'Cancel Booking'
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Past Bookings */}
            <div className="card p-8">
              <h2 className="text-3xl font-bold gradient-text mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Past Bookings
                <span className="text-lg text-gray-500 font-normal">
                  ({pastBookings.length})
                </span>
              </h2>
              {pastBookings.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No past bookings.</p>
              ) : (
                <div className="space-y-4">
                  {pastBookings
                    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="border-2 border-gray-200 rounded-xl p-5 bg-gray-50 opacity-75"
                      >
                        <h3 className="font-bold text-gray-900 mb-2">{booking.title}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="font-semibold">Room:</span>
                            {booking.room?.name || `Room ID: ${booking.roomId}`}
                          </p>
                          <p className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold">Date:</span>
                            {formatDate(booking.startTime)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {bookings.length === 0 && (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-600 text-lg mb-6">You don't have any bookings yet.</p>
                <Link to="/rooms" className="btn-primary inline-block">
                  Browse Rooms & Book Now
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
