import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { roomApi } from '../../services/api'
import type { Room } from '../../services/api'

const Home = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        const data = await roomApi.getAll()
        // Show only first 6 rooms on homepage
        setRooms(data.slice(0, 6))
        setError(null)
      } catch (err) {
        setError('Failed to load rooms. Please try again later.')
        console.error('Error fetching rooms:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 py-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome to Meeting Room Booking
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find and book the perfect meeting room for your needs
          </p>
          <Link
            to="/rooms"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            Browse All Rooms
          </Link>
        </section>

      {/* Featured Rooms */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Featured Meeting Rooms
        </h2>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading rooms...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {rooms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No rooms available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {room.name}
                        </h3>
                        <span className="text-2xl">🏢</span>
                      </div>
                      <p className="text-gray-600 mb-4">{room.location}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          👥 {room.capacity} people
                        </span>
                      </div>
                      <Link
                        to={`/rooms/${room.id}`}
                        className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {rooms.length > 0 && (
              <div className="text-center mt-8">
                <Link
                  to="/rooms"
                  className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View All Rooms →
                </Link>
              </div>
            )}
          </>
        )}
      </section>
      </div>
    </div>
  )
}

export default Home
