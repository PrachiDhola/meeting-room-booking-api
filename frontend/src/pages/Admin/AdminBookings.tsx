import { useEffect, useState } from 'react'
import { bookingApi } from '../../services/api'
import type { Booking } from '../../services/api'

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingApi.getAll()
      setBookings(data)
      setError(null)
    } catch (err) {
      setError('Failed to load bookings. Please try again later.')
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
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

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'upcoming') return isUpcoming(booking.startTime)
    if (filter === 'past') return !isUpcoming(booking.startTime)
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-16 w-16 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading bookings...</p>
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
            All Bookings
          </h1>
          <p className="text-xl text-purple-100">
            View and manage all meeting room bookings
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'upcoming'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Upcoming ({bookings.filter(b => isUpcoming(b.startTime)).length})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              filter === 'past'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Past ({bookings.filter(b => !isUpcoming(b.startTime)).length})
          </button>
        </div>

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

        {filteredBookings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600 text-lg">No bookings found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings
              .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
              .map((booking) => (
                <div
                  key={booking.id}
                  className={`card p-6 ${
                    isUpcoming(booking.startTime) ? '' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-3 text-xl">{booking.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Room</p>
                          <p>{booking.room?.name || `Room ID: ${booking.roomId}`}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Location</p>
                          <p>{booking.room?.location || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Start Time</p>
                          <p>{formatDate(booking.startTime)}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">End Time</p>
                          <p>{formatDate(booking.endTime)}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Booked By</p>
                          <p>{booking.createdBy}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Created At</p>
                          <p>{formatDate(booking.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {isUpcoming(booking.startTime) ? (
                        <span className="badge-success">Upcoming</span>
                      ) : (
                        <span className="badge bg-gray-100 text-gray-800">Past</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBookings
