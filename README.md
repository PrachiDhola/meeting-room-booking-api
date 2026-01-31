# Meeting Room Booking System

A full-stack web application for managing meeting room bookings with a modern React frontend and .NET Web API backend.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Project Status](#project-status)

## 🎯 Overview

This is a complete meeting room booking system that allows users to:
- Browse available meeting rooms
- Book rooms with time slot validation
- Manage bookings (view, cancel)
- Admin panel for room and booking management
- Guest booking support (no login required)

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

### Business Rules
- ✅ Time conflict detection (no overlapping bookings)
- ✅ Capacity validation (participants ≤ room capacity)
- ✅ Time validation (start < end, no past bookings)
- ✅ Duration limits (15 minutes minimum, 8 hours maximum)
- ✅ Room deletion protection (cannot delete rooms with future bookings)

## 🛠 Tech Stack

### Backend
- **.NET 9** - Latest stable .NET framework
- **ASP.NET Core Web API** - RESTful API framework
- **Entity Framework Core** - ORM for database operations
- **SQL Server** - Database

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management (Auth, Toast)

## 📁 Project Structure

```
Reassessment/
├── src/
│   └── MeetingRoomBookingAPI/          # Backend API
│       ├── Controllers/                 # API Controllers
│       │   ├── Bookings/               # Booking endpoints
│       │   ├── Rooms/                  # Room endpoints
│       │   ├── Health/                 # Health check
│       │   └── Diagnostics/           # Database test
│       ├── Data/                       # Database context
│       ├── Models/                      # Entity models & DTOs
│       │   ├── Booking/
│       │   └── Room/
│       ├── Services/                    # Business logic layer
│       │   ├── Booking/
│       │   └── Room/
│       ├── Middleware/                  # Global exception handler
│       └── Program.cs                  # Application entry point
│
├── frontend/                            # React Frontend
│   ├── src/
│   │   ├── components/                  # Reusable components
│   │   │   ├── Layout/                 # Header, Footer, Layout
│   │   │   ├── BookingForm/            # Booking form component
│   │   │   ├── AvailabilityCalendar/   # Calendar view
│   │   │   ├── Toast/                  # Toast notifications
│   │   │   ├── ProtectedRoute.tsx      # Route protection
│   │   │   └── AdminRoute.tsx          # Admin route protection
│   │   ├── pages/                      # Page components
│   │   │   ├── Home/                   # Landing page
│   │   │   ├── Rooms/                  # Room listing
│   │   │   ├── RoomDetails/            # Room details & booking
│   │   │   ├── Login/                  # User login
│   │   │   ├── Register/               # User registration
│   │   │   ├── Dashboard/              # User dashboard
│   │   │   ├── Profile/                # User profile
│   │   │   ├── MyBookings/            # User bookings
│   │   │   └── Admin/                  # Admin pages
│   │   ├── contexts/                   # React contexts
│   │   │   ├── AuthContext.tsx        # Authentication state
│   │   │   └── ToastContext.tsx       # Toast notifications
│   │   ├── services/                   # API service layer
│   │   │   └── api.ts                 # Axios client & API calls
│   │   └── App.tsx                     # Main app component
│   └── package.json
│
└── Postman/                            # API testing collection
    └── MeetingRoomBookingAPI.postman_collection.json
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **.NET 9 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Node.js 18+** and **npm** - [Download](https://nodejs.org/)
- **SQL Server** (LocalDB, Express, or Full) - [Download](https://www.microsoft.com/sql-server/sql-server-downloads)
- **Visual Studio 2022** (optional, for backend development) or **VS Code**
- **Postman** (optional, for API testing)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Reassessment
```

### 2. Database Setup

1. Ensure SQL Server is installed and running
2. Create a database (or use existing database)
3. Update the connection string in `src/MeetingRoomBookingAPI/appsettings.json` with your database credentials
4. Run Entity Framework migrations (if using migrations):

```bash
cd src/MeetingRoomBookingAPI
dotnet ef database update
```

**Note:** Make sure to configure your database connection string before running the application.

### 3. Backend Setup

```bash
# Navigate to backend project
cd src/MeetingRoomBookingAPI

# Restore NuGet packages
dotnet restore

# Build the project
dotnet build

# Run the API
dotnet run
```

The API will be available at:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at:
- **Development**: `http://localhost:5173`

**Note:** The frontend is configured to connect to the API at `http://localhost:5000/api` by default. If your API runs on a different port, update the `API_BASE_URL` in `frontend/src/services/api.ts`.

## 🏃 Running the Application

### Start Backend

1. Open a terminal/command prompt
2. Navigate to the backend project:
   ```bash
   cd src/MeetingRoomBookingAPI
   ```
3. Run the API:
   ```bash
   dotnet run
   ```
4. Wait for the message: "Now listening on: http://localhost:5000"
5. Keep this terminal open

### Start Frontend

1. Open a **new** terminal/command prompt (keep backend running)
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies (if not already done):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Wait for the message showing the local URL (usually `http://localhost:5173`)
6. Open your browser and navigate to the URL shown in the terminal

### Access the Application

- **Frontend**: Open `http://localhost:5173` in your browser
- **Health Check**: `http://localhost:5000/api/health`

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Check API health status

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/{id}` - Get room by ID
- `GET /api/rooms/{id}/bookings` - Get bookings for a room
- `POST /api/rooms` - Create new room (Admin)
- `PUT /api/rooms/{id}` - Update room (Admin)
- `DELETE /api/rooms/{id}` - Delete room (Admin)

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/{id}` - Cancel/delete booking

### Authentication (If implemented)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/customers/me` - Get current user profile
- `PUT /api/customers/me` - Update user profile

## 🗄 Database Schema

The application uses two main tables:
- **Rooms**: Stores meeting room information (Id, Name, Capacity, Location)
- **Bookings**: Stores booking information (Id, RoomId, Title, StartTime, EndTime, CreatedBy, CreatedAt)

The database schema is managed through Entity Framework Core migrations.

## 🧪 Testing

### API Testing with Postman

1. Import the Postman collection:
   - File: `Postman/MeetingRoomBookingAPI.postman_collection.json`
2. Set the base URL: `http://localhost:5000`
3. Test endpoints individually

### Manual Testing

1. **Health Check**: Visit `http://localhost:5000/api/health`
2. **Get Rooms**: Visit `http://localhost:5000/api/rooms`
3. **Get Bookings**: Visit `http://localhost:5000/api/bookings`

### Frontend Testing

1. Open `http://localhost:5173`
2. Browse rooms
3. Book a room (as guest or logged-in user)
4. Test admin features (if admin account exists)

## 📊 Project Status

### ✅ Completed Features

**Backend:**
- ✅ Room CRUD operations
- ✅ Booking CRUD operations
- ✅ Business rule validation
- ✅ Global exception handling
- ✅ Service layer architecture
- ✅ Database integration

**Frontend:**
- ✅ Public room browsing
- ✅ Room details page
- ✅ Booking form with validation
- ✅ Availability calendar
- ✅ User authentication
- ✅ User dashboard
- ✅ My bookings page
- ✅ Profile management
- ✅ Admin panel
- ✅ Toast notifications
- ✅ Mobile responsive design
- ✅ Guest booking support

### 🚧 Future Enhancements

- [ ] Email notifications
- [ ] Booking reminders
- [ ] Recurring bookings
- [ ] Room amenities filtering
- [ ] Advanced search
- [ ] Export bookings to PDF
- [ ] Analytics dashboard
- [ ] Multi-language support

## 📝 Notes

- The application uses **light mode only** (dark mode has been removed)
- Guest bookings are supported (no login required)
- Admin features require admin authentication
- All bookings are validated for conflicts and business rules
- The API uses CORS to allow frontend access

## 🤝 Contributing

This is a project for assessment purposes. For questions or issues, please contact the project maintainer.

## 📄 License

This project is for educational/assessment purposes.

---

**Built with ❤️ using .NET 9 and React 19**
