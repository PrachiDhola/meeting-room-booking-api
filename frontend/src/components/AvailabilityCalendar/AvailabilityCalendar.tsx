import { useEffect, useState } from 'react'
import { roomApi } from '../../services/api'
import type { Booking } from '../../services/api'

interface AvailabilityCalendarProps {
  roomId: number
  selectedDate: string
  onDateSelect: (date: string) => void
}

const AvailabilityCalendar = ({ roomId, selectedDate, onDateSelect }: AvailabilityCalendarProps) => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await roomApi.getBookings(roomId)
        setBookings(data)
      } catch (err) {
        console.error('Error loading bookings:', err)
      } finally {
        setLoading(false)
      }
    }
    loadBookings()
  }, [roomId])

  // Get bookings for a specific date
  const getBookingsForDate = (date: string) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.startTime).toISOString().split('T')[0]
      return bookingDate === date
    })
  }

  // Generate next 7 days
  const getNext7Days = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }

  const formatDay = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const isDateBooked = (dateString: string) => {
    const dayBookings = getBookingsForDate(dateString)
    return dayBookings.length > 0
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="spinner h-8 w-8 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Availability (Next 7 Days)</h3>
      <div className="space-y-2">
        {getNext7Days().map((date) => {
          const isBooked = isDateBooked(date)
          const isSelected = selectedDate === date
          const dayBookings = getBookingsForDate(date)

          return (
            <div
              key={date}
              onClick={() => !isBooked && onDateSelect(date)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : isBooked
                  ? 'border-red-200 bg-red-50 opacity-60 cursor-not-allowed'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{formatDay(date)}</p>
                  {isBooked && (
                    <p className="text-xs text-red-600 mt-1">
                      {dayBookings.length} booking{dayBookings.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <div>
                  {isBooked ? (
                    <span className="badge-primary bg-red-100 text-red-800">Booked</span>
                  ) : (
                    <span className="badge-success">Available</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AvailabilityCalendar
