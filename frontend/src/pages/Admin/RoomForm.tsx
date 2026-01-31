import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import { roomApi } from '../../services/api'

const RoomForm = () => {
  const { showToast } = useToast()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id
  const [formData, setFormData] = useState({
    name: '',
    capacity: 1,
    location: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && id) {
      loadRoom()
    }
  }, [id, isEdit])

  const loadRoom = async () => {
    try {
      setLoading(true)
      const room = await roomApi.getById(Number(id))
      setFormData({
        name: room.name,
        capacity: room.capacity,
        location: room.location,
      })
    } catch (err) {
      setError('Failed to load room. Please try again.')
      console.error('Error loading room:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'capacity' ? parseInt(value) || 1 : value,
    })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim() || !formData.location.trim()) {
      setError('Name and location are required')
      return
    }

    if (formData.capacity < 1) {
      setError('Capacity must be at least 1')
      return
    }

    try {
      setLoading(true)
      if (isEdit && id) {
        await roomApi.update(Number(id), formData)
        showToast('Room updated successfully', 'success')
      } else {
        await roomApi.create(formData)
        showToast('Room created successfully', 'success')
      }
      navigate('/admin/rooms')
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to save room. Please try again.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-16 w-16 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading room...</p>
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
            {isEdit ? 'Edit Room' : 'Create New Room'}
          </h1>
          <p className="text-xl text-purple-100">
            {isEdit ? 'Update room information' : 'Add a new meeting room to the system'}
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="alert-error">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Room Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Conference Room A"
                  maxLength={200}
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Floor 3, Building A"
                  maxLength={200}
                />
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={formData.capacity}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., 10"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum number of people the room can accommodate</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/rooms')}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner h-5 w-5"></div>
                      {isEdit ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    isEdit ? 'Update Room' : 'Create Room'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomForm
