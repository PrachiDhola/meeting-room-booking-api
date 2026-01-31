import { Routes, Route } from 'react-router-dom'
import { useToast } from './contexts/ToastContext'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import ToastContainer from './components/Toast/ToastContainer'
import Home from './pages/Home/Home'
import Rooms from './pages/Rooms/Rooms'
import RoomDetails from './pages/RoomDetails/RoomDetails'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Profile from './pages/Profile/Profile'
import MyBookings from './pages/MyBookings/MyBookings'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminRooms from './pages/Admin/AdminRooms'
import AdminBookings from './pages/Admin/AdminBookings'
import RoomForm from './pages/Admin/RoomForm'

function App() {
  const { toasts, removeToast } = useToast()

  return (
    <Layout>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <AdminRoute>
              <AdminRooms />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms/new"
          element={
            <AdminRoute>
              <RoomForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms/:id/edit"
          element={
            <AdminRoute>
              <RoomForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
