import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { roomApi } from '../../services/api'
import BookingForm from '../../components/BookingForm/BookingForm'
import AvailabilityCalendar from '../../components/AvailabilityCalendar/AvailabilityCalendar'
import type { Room, Booking } from '../../services/api'

const RoomDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const [room, setRoom] = useState<Room | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')

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

  const handleBookingSuccess = () => {
    setBookingSuccess(true)
    // Refresh bookings
    if (id) {
      roomApi.getBookings(Number(id)).then(setBookings)
    }
    // Hide success message after 5 seconds
    setTimeout(() => setBookingSuccess(false), 5000)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-16 w-16 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading room details...</p>
        </div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center card p-8 max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-600 mb-4 font-semibold text-lg">{error || 'Room not found'}</p>
          <Link to="/rooms" className="btn-primary inline-block">
            Back to Rooms
          </Link>
        </div>
      </div>
    )
  }

  const upcomingBookings = bookings.filter((b) => new Date(b.startTime) > new Date())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-container py-12">
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Rooms
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Room Info & Booking */}
          <div className="space-y-6">
            {/* Room Information Card */}
            <div className="card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">🏢</div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{room.name}</h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {room.location}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Location</h3>
                  <p className="text-gray-900 text-lg font-semibold">{room.location}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">Capacity</h3>
                  <p className="text-gray-900 text-lg font-semibold flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {room.capacity} people
                  </p>
                </div>
              </div>

              {/* Booking Section */}
              <div className="border-t border-gray-200 pt-6">
                {bookingSuccess && (
                  <div className="alert-success mb-6">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="font-semibold">Booking Successful!</p>
                        <p className="text-sm">Your meeting room has been booked successfully!</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Book This Room</h2>
                  {!isAuthenticated && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> You can book without logging in. However, logging in allows you to view and manage your bookings.
                      </p>
                    </div>
                  )}
                  <BookingForm room={room} onBookingSuccess={handleBookingSuccess} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Availability Calendar & Upcoming Bookings */}
          <div className="space-y-6">
            {/* Availability Calendar */}
            {isAuthenticated && (
              <AvailabilityCalendar
                roomId={room.id}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            )}

            {/* Upcoming Bookings */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upcoming Bookings
              </h2>
              
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📆</div>
                  <p className="text-gray-600">No upcoming bookings for this room.</p>
                  <p className="text-gray-500 text-sm mt-2">This room is available!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:bg-blue-50 transition-all"
                      >
                        <h3 className="font-bold text-gray-900 mb-3 text-lg">{booking.title}</h3>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center gap-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold">Start:</span>
                            <span>{formatDate(booking.startTime)}</span>
                          </p>
                          <p className="flex items-center gap-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">End:</span>
                            <span>{formatDate(booking.endTime)}</span>
                          </p>
                          <p className="flex items-center gap-2 text-gray-700">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-semibold">Booked by:</span>
                            <span>{booking.createdBy}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetails
