# Meeting Room Booking - Frontend

React + TypeScript + Vite frontend application for the Meeting Room Booking System.

## 🛠 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management (Auth, Toast)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/              # Reusable components
│   │   ├── Layout/             # Header, Footer, Layout
│   │   ├── BookingForm/        # Booking form component
│   │   ├── AvailabilityCalendar/ # Calendar view component
│   │   ├── Toast/              # Toast notification components
│   │   ├── ProtectedRoute.tsx  # Route protection for customers
│   │   └── AdminRoute.tsx      # Route protection for admins
│   ├── pages/                  # Page components
│   │   ├── Home/               # Landing page
│   │   ├── Rooms/              # Room listing page
│   │   ├── RoomDetails/        # Room details & booking page
│   │   ├── Login/              # User login page
│   │   ├── Register/           # User registration page
│   │   ├── Dashboard/          # User dashboard
│   │   ├── Profile/            # User profile page
│   │   ├── MyBookings/         # User bookings page
│   │   └── Admin/              # Admin pages
│   │       ├── AdminLogin.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminRooms.tsx
│   │       ├── AdminBookings.tsx
│   │       └── RoomForm.tsx
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx     # Authentication state management
│   │   └── ToastContext.tsx    # Toast notification state
│   ├── services/               # API service layer
│   │   └── api.ts             # Axios client and API calls
│   ├── App.tsx                # Main app component with routes
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles (Tailwind + custom)
├── index.html                 # HTML template
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── package.json               # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm** installed
- Backend API running on `http://localhost:5000`

### Step-by-Step Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install all required packages (React, TypeScript, Tailwind CSS, etc.)

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The terminal will show a URL (usually `http://localhost:5173`)
   - Open this URL in your browser
   - The application should load and connect to the backend API

### Build for Production

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

**Note:** Make sure the backend API is running before starting the frontend, otherwise API calls will fail.

## ✨ Features

### Public Features
- ✅ Browse all available meeting rooms
- ✅ View room details (capacity, location, availability)
- ✅ Book rooms without login (guest booking)
- ✅ Real-time availability checking
- ✅ Calendar view for room availability

### Customer Features (After Login)
- ✅ User registration and authentication
- ✅ Personal dashboard
- ✅ View and manage personal bookings
- ✅ Profile management
- ✅ Booking history (upcoming and past)

### Admin Features
- ✅ Admin authentication
- ✅ Admin dashboard with statistics
- ✅ Room management (Create, Read, Update, Delete)
- ✅ View all bookings across the system
- ✅ Filter bookings (All, Upcoming, Past)

### UI/UX Features
- ✅ Toast notifications for user feedback
- ✅ Mobile responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Professional styling with Tailwind CSS

## 🔌 API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`:

### Room Endpoints
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `GET /api/rooms/:id/bookings` - Get bookings for a room
- `POST /api/rooms` - Create new room (Admin)
- `PUT /api/rooms/:id` - Update room (Admin)
- `DELETE /api/rooms/:id` - Delete room (Admin)

### Booking Endpoints
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/:id` - Cancel/delete booking

### Authentication Endpoints (If implemented)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/customers/me` - Get current user profile
- `PUT /api/customers/me` - Update user profile

## 🎨 Styling

The application uses **Tailwind CSS 4** with custom utility classes defined in `src/index.css`:

- `.card` - Card container styling
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-ghost` - Ghost button
- `.input-field` - Form input styling
- `.alert-success` - Success alert
- `.alert-error` - Error alert
- `.alert-info` - Info alert
- `.spinner` - Loading spinner
- `.gradient-text` - Gradient text effect

## 🔐 Authentication

Authentication is handled via:
- **JWT tokens** stored in `localStorage`
- **AuthContext** for global auth state
- **ProtectedRoute** component for customer routes
- **AdminRoute** component for admin routes

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

### Manual Testing

1. Start the backend API
2. Start the frontend: `npm run dev`
3. Open `http://localhost:5173`
4. Test all features:
   - Browse rooms
   - Book a room (as guest)
   - Register/Login
   - View bookings
   - Admin features (if admin account exists)

## 📝 Environment Variables

Create a `.env` file in the frontend directory if you need to customize the API URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Then update `src/services/api.ts` to use `import.meta.env.VITE_API_BASE_URL`.

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:5000`
- Check CORS settings in backend
- Verify API base URL in `src/services/api.ts`

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Port Already in Use
- Change port in `vite.config.js` or use `npm run dev -- --port 3000`

## 📄 License

This project is for educational/assessment purposes.

---

**Built with React 19 + TypeScript + Vite**
