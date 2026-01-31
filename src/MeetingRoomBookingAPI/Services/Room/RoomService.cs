using Microsoft.EntityFrameworkCore;
using MeetingRoomBookingAPI.Data;
using RoomEntity = MeetingRoomBookingAPI.Models.Room.Room;
using MeetingRoomBookingAPI.Models.Room.DTOs;
using BookingEntity = MeetingRoomBookingAPI.Models.Booking.Booking;

namespace MeetingRoomBookingAPI.Services.Room;

/// <summary>
/// Service class for room-related business logic operations.
/// Implements IRoomService interface and handles all room data access.
/// </summary>
public class RoomService : IRoomService
{
    #region Fields

    private readonly ApplicationDbContext _context;

    #endregion

    #region Constructor

    /// <summary>
    /// Initializes a new instance of the RoomService.
    /// </summary>
    /// <param name="context">Database context for data access operations.</param>
    public RoomService(ApplicationDbContext context)
    {
        _context = context;
    }

    #endregion

    #region Public Methods - CRUD Operations

    /// <summary>
    /// Retrieves all rooms from the database.
    /// </summary>
    /// <returns>Collection of all rooms ordered by ID.</returns>
    public async Task<IEnumerable<RoomEntity>> GetAllRoomsAsync()
    {
        return await _context.Rooms.ToListAsync();
    }

    /// <summary>
    /// Retrieves a specific room by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the room.</param>
    /// <returns>Room entity if found, otherwise null.</returns>
    public async Task<RoomEntity?> GetRoomByIdAsync(int id)
    {
        return await _context.Rooms.FindAsync(id);
    }

    /// <summary>
    /// Creates a new room in the database.
    /// </summary>
    /// <param name="dto">Data transfer object containing room information.</param>
    /// <returns>The created room entity with generated ID.</returns>
    public async Task<RoomEntity> CreateRoomAsync(CreateRoomDto dto)
    {
        // Create new room entity from DTO
        var room = new RoomEntity
        {
            Name = dto.Name,
            Capacity = dto.Capacity,
            Location = dto.Location
        };

        // Add to database context
        _context.Rooms.Add(room);
        
        // Save changes to database (generates ID)
        await _context.SaveChangesAsync();
        
        return room;
    }

    /// <summary>
    /// Deletes a room from the database.
    /// Note: This method does not check for future bookings - that validation is done in the controller.
    /// </summary>
    /// <param name="id">The unique identifier of the room to delete.</param>
    /// <returns>True if room was deleted, false if room was not found.</returns>
    public async Task<bool> DeleteRoomAsync(int id)
    {
        // Load room with its bookings (for cascade delete handling)
        var room = await _context.Rooms
            .Include(r => r.Bookings)
            .FirstOrDefaultAsync(r => r.Id == id);

        // Return false if room doesn't exist
        if (room == null)
            return false;

        // Remove room from database
        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();
        
        return true;
    }

    #endregion

    #region Public Methods - Query Operations

    /// <summary>
    /// Retrieves all bookings for a specific room.
    /// </summary>
    /// <param name="roomId">The unique identifier of the room.</param>
    /// <returns>Collection of bookings for the specified room, ordered by start time.</returns>
    public async Task<IEnumerable<BookingEntity>> GetRoomBookingsAsync(int roomId)
    {
        return await _context.Bookings
            .Where(b => b.RoomId == roomId)
            .OrderBy(b => b.StartTime)
            .ToListAsync();
    }

    /// <summary>
    /// Checks if a room exists in the database.
    /// </summary>
    /// <param name="id">The unique identifier of the room.</param>
    /// <returns>True if room exists, false otherwise.</returns>
    public async Task<bool> RoomExistsAsync(int id)
    {
        return await _context.Rooms.AnyAsync(r => r.Id == id);
    }

    /// <summary>
    /// Checks if a room has any future bookings.
    /// Used to enforce business rule: Cannot delete room with future bookings.
    /// </summary>
    /// <param name="roomId">The unique identifier of the room.</param>
    /// <returns>True if room has future bookings, false otherwise.</returns>
    public async Task<bool> HasFutureBookingsAsync(int roomId)
    {
        return await _context.Bookings
            .AnyAsync(b => b.RoomId == roomId && b.StartTime > DateTime.UtcNow);
    }

    #endregion
}
