import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { roomApi } from '../../services/api'
import type { Room, Booking } from '../../services/api'

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [room, setRoom] = useState<Room | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!id) return

      try {
        setLoading(true)
        const roomData = await roomApi.getById(Number(id))
        const bookingsData = await roomApi.getBookings(Number(id))
        
        setRoom(roomData)
        setBookings(bookingsData)
        setError(null)
      } catch (err) {
        setError('Failed to load room details. Please try again later.')
        console.error('Error fetching room details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRoomDetails()
  }, [id])

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading room details...</p>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || 'Room not found'}</p>
          <Link
            to="/rooms"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Rooms
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/rooms"
          className="text-blue-600 hover:text-blue-700 mb-4 inline-block font-medium transition-colors"
        >
          ← Back to Rooms
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">🏢</span>
            <h1 className="text-4xl font-bold text-gray-800">{room.name}</h1>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Location</h2>
              <p className="text-gray-800 text-lg">{room.location}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Capacity</h2>
              <p className="text-gray-800 text-lg">👥 {room.capacity} people</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">
              To book this room, please log in to your account.
            </p>
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-medium"
            >
              Login to Book
            </Link>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Bookings</h2>
        
        {bookings.length === 0 ? (
          <p className="text-gray-600">No upcoming bookings for this room.</p>
        ) : (
          <div className="space-y-4">
            {bookings
              .filter((booking) => new Date(booking.startTime) > new Date())
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-all transform hover:scale-[1.02]"
                >
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">{booking.title}</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">📅 Start:</span> {formatDate(booking.startTime)}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">🕐 End:</span> {formatDate(booking.endTime)}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-semibold">👤 Booked by:</span> {booking.createdBy}
                    </p>
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

export default RoomDetails
