import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import { roomApi } from '../../services/api'
import type { Room } from '../../services/api'

const AdminRooms = () => {
  const { showToast } = useToast()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const data = await roomApi.getAll()
      setRooms(data)
      setError(null)
    } catch (err) {
      setError('Failed to load rooms. Please try again later.')
      console.error('Error fetching rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return
    }

    try {
      setDeleteLoading(id)
      await roomApi.delete(id)
      setRooms(rooms.filter(r => r.id !== id))
      showToast('Room deleted successfully', 'success')
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete room. It may have existing bookings.'
      showToast(errorMsg, 'error')
      console.error('Error deleting room:', err)
    } finally {
      setDeleteLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-16 w-16 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading rooms...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="section-container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
                Manage Rooms
              </h1>
              <p className="text-xl text-purple-100">
                Create, edit, and delete meeting rooms
              </p>
            </div>
            <Link
              to="/admin/rooms/new"
              className="btn-primary bg-white text-purple-600 hover:bg-gray-100"
            >
              + Add New Room
            </Link>
          </div>
        </div>
      </div>

      <div className="section-container py-12">
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

        {rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏢</div>
            <p className="text-gray-600 text-lg mb-4">No rooms found.</p>
            <Link to="/admin/rooms/new" className="btn-primary inline-block">
              Create First Room
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="card p-6">
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

                <div className="mb-6">
                  <span className="badge-primary">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Capacity: {room.capacity} people
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/admin/rooms/${room.id}/edit`}
                    className="btn-secondary flex-1 text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(room.id)}
                    disabled={deleteLoading === room.id}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  >
                    {deleteLoading === room.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="spinner h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Deleting...
                      </span>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminRooms
