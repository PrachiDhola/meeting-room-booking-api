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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-section text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative section-container py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fadeIn">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Book Your Perfect
              <br />
              <span className="text-yellow-300">Meeting Space</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover modern, professional meeting rooms designed for productivity and collaboration. 
              Book in seconds, meet with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rooms" className="btn-primary text-lg px-8 py-4 shadow-professional-lg">
                Explore Rooms
              </Link>
              <Link to="/register" className="btn-secondary text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="section-container py-20 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Featured Meeting Rooms
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular spaces designed for productivity and collaboration
          </p>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="spinner h-12 w-12 mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">Loading amazing spaces...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="alert-error">
              <p className="font-semibold text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {rooms.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏢</div>
                <p className="text-gray-600 text-lg">No rooms available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room, index) => (
                  <div
                    key={room.id}
                    className="room-card animate-fadeIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {room.name}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {room.location}
                        </p>
                      </div>
                      <div className="text-4xl">🏢</div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6">
                      <span className="badge-primary">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {room.capacity} people
                      </span>
                    </div>
                    
                    <Link
                      to={`/rooms/${room.id}`}
                      className="btn-primary w-full text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {rooms.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  to="/rooms"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
                >
                  <span>View All Rooms</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      {/* Features Section */}
      <section className="section-container py-20 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold gradient-text mb-4">Why Choose Us?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for successful meetings in one place
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Booking</h3>
            <p className="text-gray-600">Book your meeting room in seconds with our streamlined process</p>
          </div>
          <div className="feature-card">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Perfect Spaces</h3>
            <p className="text-gray-600">Find rooms that match your team size and meeting needs</p>
          </div>
          <div className="feature-card">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Management</h3>
            <p className="text-gray-600">View and manage all your bookings from one dashboard</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
