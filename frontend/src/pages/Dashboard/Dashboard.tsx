import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { roomApi } from '../../services/api'
import type { Room } from '../../services/api'

const Dashboard = () => {
  const { user } = useAuth()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomApi.getAll()
        setRooms(data.slice(0, 3)) // Show first 3 rooms
      } catch (error) {
        console.error('Error fetching rooms:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your bookings and explore available rooms</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/rooms"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-blue-600 text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Browse Rooms</h3>
            <p className="text-gray-600">View all available meeting rooms</p>
          </Link>

          <Link
            to="/my-bookings"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-green-600 text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">My Bookings</h3>
            <p className="text-gray-600">View and manage your bookings</p>
          </Link>

          <Link
            to="/profile"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-purple-600 text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile</h3>
            <p className="text-gray-600">Update your account information</p>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Access - Featured Rooms</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <Link
                  key={room.id}
                  to={`/rooms/${room.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-semibold text-gray-800 mb-1">{room.name}</h3>
                  <p className="text-sm text-gray-600">{room.location}</p>
                  <p className="text-sm text-gray-500 mt-1">Capacity: {room.capacity}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
