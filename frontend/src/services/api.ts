import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Room {
  id: number
  name: string
  capacity: number
  location: string
}

export interface Booking {
  id: number
  roomId: number
  title: string
  startTime: string
  endTime: string
  createdBy: string
  createdAt: string
  room?: Room
}

// Room API calls
export const roomApi = {
  getAll: async (): Promise<Room[]> => {
    const response = await api.get<Room[]>('/rooms')
    return response.data
  },

  getById: async (id: number): Promise<Room> => {
    const response = await api.get<Room>(`/rooms/${id}`)
    return response.data
  },

  getBookings: async (id: number): Promise<Booking[]> => {
    const response = await api.get<Booking[]>(`/rooms/${id}/bookings`)
    return response.data
  },

  // Admin endpoints
  create: async (room: Omit<Room, 'id'>): Promise<Room> => {
    const response = await api.post<Room>('/rooms', room)
    return response.data
  },

  update: async (id: number, room: Partial<Room>): Promise<Room> => {
    const response = await api.put<Room>(`/rooms/${id}`, room)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/rooms/${id}`)
  },
}

// Booking API calls
export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/bookings')
    return response.data
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await api.get<Booking>(`/bookings/${id}`)
    return response.data
  },

  create: async (dto: CreateBookingDto): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings', dto)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/bookings/${id}`)
  },
}

// Auth API calls
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    name: string
  }
}

export interface CreateBookingDto {
  roomId: number
  title: string
  startTime: string
  endTime: string
  createdBy: string
  numberOfParticipants?: number
}

export interface Customer {
  id: number
  email: string
  name: string
  createdAt: string
}

export const authApi = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password })
    return response.data
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password })
    return response.data
  },

  getProfile: async (): Promise<Customer> => {
    const response = await api.get<Customer>('/customers/me')
    return response.data
  },

  updateProfile: async (name: string, email: string): Promise<Customer> => {
    const response = await api.put<Customer>('/customers/me', { name, email })
    return response.data
  },
}

export default api
