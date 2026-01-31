import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { bookingApi, roomApi } from '../../services/api'
import type { Room } from '../../services/api'

interface BookingFormProps {
  room: Room
  onBookingSuccess: () => void
}

const BookingForm = ({ room, onBookingSuccess }: BookingFormProps) => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    numberOfParticipants: 1,
    bookerName: '',
    bookerEmail: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingAvailability, setCheckingAvailability] = useState(false)

  // Get minimum time (current time)
  const minTime = new Date().toISOString().slice(0, 16)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'numberOfParticipants' ? parseInt(value) || 1 : value,
    })
    setError(null)
  }

  const checkAvailability = async () => {
    if (!formData.startTime || !formData.endTime) {
      setError('Please select both start and end times')
      return
    }

    try {
      setCheckingAvailability(true)
      setError(null)
      const bookings = await roomApi.getBookings(room.id)
      
      const start = new Date(formData.startTime)
      const end = new Date(formData.endTime)

      // Check for conflicts
      const conflictingBooking = bookings.find(booking => {
        const bookingStart = new Date(booking.startTime)
        const bookingEnd = new Date(booking.endTime)
        return (start < bookingEnd && end > bookingStart)
      })

      if (conflictingBooking) {
        const conflictMsg = `This time slot conflicts with "${conflictingBooking.title}" (${new Date(conflictingBooking.startTime).toLocaleString()} - ${new Date(conflictingBooking.endTime).toLocaleString()})`
        setError(conflictMsg)
        showToast(conflictMsg, 'error')
      } else {
        setError(null)
        showToast('This time slot is available!', 'success', 3000)
      }
    } catch (err) {
      setError('Error checking availability. Please try again.')
      console.error('Error checking availability:', err)
    } finally {
      setCheckingAvailability(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.title.trim()) {
      setError('Meeting title is required')
      return
    }

    if (!formData.startTime || !formData.endTime) {
      setError('Please select both start and end times')
      return
    }

    // If not logged in, require name and email
    if (!user) {
      if (!formData.bookerName.trim()) {
        setError('Your name is required')
        return
      }
      if (!formData.bookerEmail.trim()) {
        setError('Your email is required')
        return
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.bookerEmail)) {
        setError('Please enter a valid email address')
        return
      }
    }

    const start = new Date(formData.startTime)
    const end = new Date(formData.endTime)

    if (start >= end) {
      setError('End time must be after start time')
      return
    }

    if (start < new Date()) {
      setError('Cannot book in the past')
      return
    }

    const duration = (end.getTime() - start.getTime()) / (1000 * 60) // minutes
    if (duration < 15) {
      setError('Minimum booking duration is 15 minutes')
      return
    }

    if (duration > 8 * 60) {
      setError('Maximum booking duration is 8 hours')
      return
    }

    if (formData.numberOfParticipants > room.capacity) {
      setError(`Room capacity is ${room.capacity}. Cannot accommodate ${formData.numberOfParticipants} participants`)
      return
    }

    try {
      setLoading(true)
      await bookingApi.create({
        roomId: room.id,
        title: formData.title,
        startTime: formData.startTime,
        endTime: formData.endTime,
        createdBy: user?.email || formData.bookerEmail,
        numberOfParticipants: formData.numberOfParticipants,
      })
      
      // Reset form
      setFormData({
        title: '',
        startTime: '',
        endTime: '',
        numberOfParticipants: 1,
        bookerName: '',
        bookerEmail: '',
      })
      
      // Show success toast
      showToast('Booking created successfully!', 'success')
      
      // Notify parent component
      onBookingSuccess()
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to create booking. Please try again.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
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
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Meeting Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={formData.title}
          onChange={handleChange}
          className="input-field"
          placeholder="e.g., Team Standup Meeting"
          maxLength={200}
        />
      </div>

      {!user && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bookerName" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="bookerName"
                name="bookerName"
                type="text"
                required
                value={formData.bookerName}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="bookerEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Email <span className="text-red-500">*</span>
              </label>
              <input
                id="bookerEmail"
                name="bookerEmail"
                type="email"
                required
                value={formData.bookerEmail}
                onChange={handleChange}
                className="input-field"
                placeholder="john.doe@example.com"
                maxLength={200}
              />
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-semibold text-gray-700 mb-2">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            id="startTime"
            name="startTime"
            type="datetime-local"
            required
            value={formData.startTime}
            onChange={handleChange}
            min={minTime}
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-semibold text-gray-700 mb-2">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            id="endTime"
            name="endTime"
            type="datetime-local"
            required
            value={formData.endTime}
            onChange={handleChange}
            min={formData.startTime || minTime}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label htmlFor="numberOfParticipants" className="block text-sm font-semibold text-gray-700 mb-2">
          Number of Participants
        </label>
        <input
          id="numberOfParticipants"
          name="numberOfParticipants"
          type="number"
          min="1"
          max={room.capacity}
          value={formData.numberOfParticipants}
          onChange={handleChange}
          className="input-field"
          placeholder={`Max: ${room.capacity}`}
        />
        <p className="text-xs text-gray-500 mt-1">
          Room capacity: {room.capacity} people
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={checkAvailability}
          disabled={!formData.startTime || !formData.endTime || checkingAvailability}
          className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checkingAvailability ? 'Checking...' : 'Check Availability'}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="spinner h-5 w-5"></div>
              Booking...
            </span>
          ) : (
            'Book Now'
          )}
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Minimum booking duration is 15 minutes. Maximum is 8 hours.
        </p>
      </div>
    </form>
  )
}

export default BookingForm
