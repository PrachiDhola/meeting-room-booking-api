# Meeting Room Booking - Frontend

React + TypeScript + Vite frontend application for the Meeting Room Booking System.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── Layout/         # Layout components (Header, Footer)
│   ├── pages/              # Page components
│   │   ├── Home/           # Home page with room showcase
│   │   ├── Rooms/          # Room listing page
│   │   └── RoomDetails/    # Room details page
│   ├── services/           # API service layer
│   │   └── api.ts         # API client and types
│   ├── App.tsx            # Main app component with routes
│   ├── main.tsx           # Application entry point
│   └── index.css         # Global styles (Tailwind)
├── index.html            # HTML template
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server (usually on http://localhost:5173)
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Phase 1 Features (Current)

✅ **Home Page** (`/`)
- Room showcase with featured rooms
- Call-to-action to browse all rooms
- Responsive design

✅ **Room Listing** (`/rooms`)
- Display all available rooms
- Room cards with name, location, and capacity
- Links to individual room details

✅ **Room Details** (`/rooms/:id`)
- Detailed room information
- Upcoming bookings display
- Placeholder for booking functionality (Phase 2)

✅ **Responsive Design**
- Mobile-first approach
- Tailwind CSS for styling
- Works on all screen sizes

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`:

- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `GET /api/rooms/:id/bookings` - Get bookings for a room

## Next Steps (Phase 2)

- Customer authentication (Register/Login)
- Protected routes
- User profile management
- Booking functionality

## Environment Variables

Create a `.env` file in the frontend directory if you need to customize the API URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Then update `src/services/api.ts` to use `import.meta.env.VITE_API_BASE_URL`.
