# Meeting Room Booking System

**Meeting Room Booking API** - Backend implementation complete.

## ✨ Features Implemented

- ✅ Room CRUD operations
- ✅ Conflict-free booking system  
- ✅ Business rules (time validation, delete protection)
- ✅ POSTMAN documentation

## 🛠 Tech Stack

Backend: ASP.NET Core Web API + Entity Framework + SQL Server
Tools: Postman Collection

text

## 🚀 Quick Start

```bash
git clone <your-repo-url>
cd backend
dotnet restore
dotnet ef database update
dotnet run

🧪 Postman Testing
Download collection: postman/MeetingRoomBooking.postman_collection.json

Import to Postman

Set environment variable: {{baseUrl}} = https://localhost:7001

Run collection - Tests all endpoints

📋 API Endpoints
Method	Endpoint	Description
POST	/api/rooms	Create room
GET	/api/rooms	List all rooms
GET	/api/rooms/{id}	Room details
DELETE	/api/rooms/{id}	Delete room
POST	/api/bookings	Create booking
GET	/api/rooms/{id}/bookings	Room bookings

🛣 Development Roadmap
Phase	Feature	Status
1	Backend API + DB	✅ Complete
2	Customer Auth	🔄 Planned
3	Frontend UI	🔄 Planned
4	Admin Panel	🔄 Planned
5	Full Integration	🔄 Planned


*Replace `<your-repo-url>` with your actual repo URL.
*Add your Postman collection file to `postman/` folder and commit.** Perfect for current state!
