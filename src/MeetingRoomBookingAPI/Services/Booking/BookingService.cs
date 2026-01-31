using Microsoft.EntityFrameworkCore;
using MeetingRoomBookingAPI.Data;
using BookingEntity = MeetingRoomBookingAPI.Models.Booking.Booking;
using MeetingRoomBookingAPI.Models.Booking.DTOs;

namespace MeetingRoomBookingAPI.Services.Booking;

/// <summary>
/// Service class for booking-related business logic operations.
/// Implements IBookingService interface and handles all booking data access and validation.
/// </summary>
public class BookingService : IBookingService
{
    #region Fields

    private readonly ApplicationDbContext _context;

    #endregion

    #region Constructor

    /// <summary>
    /// Initializes a new instance of the BookingService.
    /// </summary>
    /// <param name="context">Database context for data access operations.</param>
    public BookingService(ApplicationDbContext context)
    {
        _context = context;
    }

    #endregion

    #region Public Methods - CRUD Operations

    /// <summary>
    /// Retrieves all bookings from the database.
    /// Includes room information for each booking.
    /// </summary>
    /// <returns>Collection of all bookings with room details, ordered by start time.</returns>
    public async Task<IEnumerable<BookingEntity>> GetAllBookingsAsync()
    {
        return await _context.Bookings
            .Include(b => b.Room)  // Eager load room information
            .OrderBy(b => b.StartTime)
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves a specific booking by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the booking.</param>
    /// <returns>Booking entity with room information if found, otherwise null.</returns>
    public async Task<BookingEntity?> GetBookingByIdAsync(int id)
    {
        return await _context.Bookings
            .Include(b => b.Room)  // Eager load room information
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    /// <summary>
    /// Creates a new booking in the database.
    /// Note: Business rule validation should be done before calling this method.
    /// </summary>
    /// <param name="dto">Data transfer object containing booking information.</param>
    /// <returns>The created booking entity with generated ID and loaded room information.</returns>
    public async Task<BookingEntity> CreateBookingAsync(CreateBookingDto dto)
    {
        // Create new booking entity from DTO
        var booking = new BookingEntity
        {
            RoomId = dto.RoomId,
            Title = dto.Title,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            CreatedBy = dto.CreatedBy,
            CreatedAt = DateTime.UtcNow  // Set creation timestamp
        };

        // Add to database context
        _context.Bookings.Add(booking);
        
        // Save changes to database (generates ID)
        await _context.SaveChangesAsync();

        // Load room information for response (eager loading)
        await _context.Entry(booking).Reference(b => b.Room).LoadAsync();
        
        return booking;
    }

    /// <summary>
    /// Deletes a booking from the database.
    /// </summary>
    /// <param name="id">The unique identifier of the booking to delete.</param>
    /// <returns>True if booking was deleted, false if booking was not found.</returns>
    public async Task<bool> DeleteBookingAsync(int id)
    {
        // Find booking by ID
        var booking = await _context.Bookings.FindAsync(id);
        
        // Return false if booking doesn't exist
        if (booking == null)
            return false;

        // Remove booking from database
        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        
        return true;
    }

    #endregion

    #region Public Methods - Validation

    /// <summary>
    /// Checks if a booking exists in the database.
    /// </summary>
    /// <param name="id">The unique identifier of the booking.</param>
    /// <returns>True if booking exists, false otherwise.</returns>
    public async Task<bool> BookingExistsAsync(int id)
    {
        return await _context.Bookings.AnyAsync(b => b.Id == id);
    }

    /// <summary>
    /// Validates basic time range rules (not including overlap check).
    /// </summary>
    /// <param name="startTime">Start time of the booking.</param>
    /// <param name="endTime">End time of the booking.</param>
    /// <returns>True if time range is valid, false otherwise.</returns>
    public Task<bool> IsValidTimeRangeAsync(DateTime startTime, DateTime endTime)
    {
        // Rule: StartTime must be before EndTime
        if (startTime >= endTime)
            return Task.FromResult(false);

        // Rule: Cannot book in the past
        if (startTime < DateTime.UtcNow)
            return Task.FromResult(false);

        return Task.FromResult(true);
    }

    /// <summary>
    /// Validates if the number of participants fits within the room's capacity.
    /// </summary>
    /// <param name="roomId">The unique identifier of the room.</param>
    /// <param name="numberOfParticipants">Number of participants for the booking.</param>
    /// <returns>True if capacity is sufficient, false if room doesn't exist or capacity exceeded.</returns>
    public async Task<bool> ValidateCapacityAsync(int roomId, int numberOfParticipants)
    {
        // Get room from database
        var room = await _context.Rooms.FindAsync(roomId);
        
        // Return false if room doesn't exist
        if (room == null)
            return false;

        // Check if participants fit within room capacity
        return numberOfParticipants <= room.Capacity;
    }

    /// <summary>
    /// Comprehensive validation of all booking business rules.
    /// Validates: time range, duration limits, room existence, capacity, and overlaps.
    /// </summary>
    /// <param name="roomId">The unique identifier of the room to book.</param>
    /// <param name="startTime">Start time of the booking.</param>
    /// <param name="endTime">End time of the booking.</param>
    /// <param name="numberOfParticipants">Optional number of participants (for capacity validation).</param>
    /// <returns>Tuple containing validation result (isValid, errorMessage).</returns>
    public async Task<(bool isValid, string? errorMessage)> ValidateBookingRulesAsync(
        int roomId, 
        DateTime startTime, 
        DateTime endTime, 
        int? numberOfParticipants = null)
    {
        // Rule 1: StartTime must be before EndTime
        if (startTime >= endTime)
        {
            return (false, "Start time must be before end time");
        }

        // Rule 2: Cannot book in the past
        if (startTime < DateTime.UtcNow)
        {
            return (false, "Cannot create bookings in the past");
        }

        // Rule 3: Minimum booking duration (15 minutes)
        var duration = endTime - startTime;
        if (duration.TotalMinutes < 15)
        {
            return (false, "Minimum booking duration is 15 minutes");
        }

        // Rule 4: Maximum booking duration (8 hours)
        if (duration.TotalHours > 8)
        {
            return (false, "Maximum booking duration is 8 hours");
        }

        // Rule 5: Check if room exists
        var room = await _context.Rooms.FindAsync(roomId);
        if (room == null)
        {
            return (false, $"Room with ID {roomId} not found");
        }

        // Rule 6: Capacity validation (if participants specified)
        if (numberOfParticipants.HasValue)
        {
            // Participants must be at least 1
            if (numberOfParticipants.Value < 1)
            {
                return (false, "Number of participants must be at least 1");
            }

            // Participants cannot exceed room capacity
            if (numberOfParticipants.Value > room.Capacity)
            {
                return (false, $"Room capacity is {room.Capacity}. Cannot accommodate {numberOfParticipants.Value} participants");
            }
        }

        // Rule 7: Check for overlapping bookings
        var hasOverlap = await HasTimeOverlapAsync(roomId, startTime, endTime);
        if (hasOverlap)
        {
            // Get conflicting booking for detailed error message
            var conflictingBooking = await GetConflictingBookingAsync(roomId, startTime, endTime);
            return (false, $"Room is already booked from {conflictingBooking?.StartTime:yyyy-MM-dd HH:mm} to {conflictingBooking?.EndTime:yyyy-MM-dd HH:mm}");
        }

        // All validations passed
        return (true, null);
    }

    #endregion

    #region Public Methods - Conflict Detection

    /// <summary>
    /// Checks if there are any overlapping bookings for a room in the specified time range.
    /// Two bookings overlap if: (Start1 < End2) AND (End1 > Start2)
    /// </summary>
    /// <param name="roomId">The unique identifier of the room.</param>
    /// <param name="startTime">Start time of the booking to check.</param>
    /// <param name="endTime">End time of the booking to check.</param>
    /// <param name="excludeBookingId">Optional booking ID to exclude from overlap check (useful for updates).</param>
    /// <returns>True if there is an overlapping booking, false otherwise.</returns>
    public async Task<bool> HasTimeOverlapAsync(int roomId, DateTime startTime, DateTime endTime, int? excludeBookingId = null)
    {
        // Query for bookings in the same room that overlap with the specified time range
        // Overlap condition: (existing.StartTime < new.EndTime) AND (existing.EndTime > new.StartTime)
        var query = _context.Bookings
            .Where(b => b.RoomId == roomId)
            .Where(b => b.StartTime < endTime && b.EndTime > startTime);

        // Exclude a specific booking (useful when updating an existing booking)
        if (excludeBookingId.HasValue)
        {
            query = query.Where(b => b.Id != excludeBookingId.Value);
        }

        return await query.AnyAsync();
    }

    /// <summary>
    /// Retrieves the first conflicting booking for a room in the specified time range.
    /// Used to provide detailed error messages when overlap is detected.
    /// </summary>
    /// <param name="roomId">The unique identifier of the room.</param>
    /// <param name="startTime">Start time of the booking to check.</param>
    /// <param name="endTime">End time of the booking to check.</param>
    /// <returns>Conflicting booking if found, otherwise null.</returns>
    public async Task<BookingEntity?> GetConflictingBookingAsync(int roomId, DateTime startTime, DateTime endTime)
    {
        return await _context.Bookings
            .Where(b => b.RoomId == roomId)
            .Where(b => b.StartTime < endTime && b.EndTime > startTime)
            .FirstOrDefaultAsync();
    }

    #endregion
}
