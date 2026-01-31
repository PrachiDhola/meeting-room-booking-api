import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authApi } from '../services/api'

interface User {
  id: number
  email: string
  name: string
  role?: 'CUSTOMER' | 'ADMIN' | 'PUBLIC'
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  adminLogin: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password)
      const { token: newToken, user: userData } = response

      setToken(newToken)
      setUser(userData)

      // Store in localStorage
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.register(name, email, password)
      const { token: newToken, user: userData } = response

      setToken(newToken)
      setUser(userData)

      // Store in localStorage
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const adminLogin = async (email: string, password: string) => {
    try {
      // For now, we'll use the same login endpoint but check for admin role
      // In a real app, you'd have a separate admin login endpoint
      const response = await authApi.login(email, password)
      const { token: newToken, user: userData } = response

      // Check if user is admin (for now, we'll check email or add role to response)
      // This is a temporary solution - backend should return role
      if (userData.email.includes('admin') || userData.email === 'admin@example.com') {
        const adminUser = { ...userData, role: 'ADMIN' as const }
        setToken(newToken)
        setUser(adminUser)
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(adminUser))
      } else {
        throw new Error('Access denied. Admin credentials required.')
      }
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    adminLogin,
    logout,
    isLoading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN' || false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
