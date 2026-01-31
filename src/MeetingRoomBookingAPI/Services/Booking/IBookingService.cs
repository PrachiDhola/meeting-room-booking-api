using BookingEntity = MeetingRoomBookingAPI.Models.Booking.Booking;
using MeetingRoomBookingAPI.Models.Booking.DTOs;

namespace MeetingRoomBookingAPI.Services.Booking;

/// <summary>
/// Interface for booking-related business logic operations.
/// Defines the contract for booking service implementations.
/// </summary>
public interface IBookingService
{
    #region CRUD Operations

    /// <summary>
    /// Retrieves all bookings from the database.
    /// </summary>
    /// <returns>Collection of all bookings with room information, ordered by start time.</returns>
    Task<IEnumerable<BookingEntity>> GetAllBookingsAsync();

    /// <summary>
    /// Retrieves a specific booking by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the booking.</param>
    /// <returns>Booking entity with room information if found, otherwise null.</returns>
    Task<BookingEntity?> GetBookingByIdAsync(int id);

    /// <summary>
    /// Creates a new booking in the database.
    /// </summary>
    /// <param name="dto">Data transfer object containing booking information.</param>
    /// <returns>The created booking entity with generated ID and loaded room information.</returns>
    Task<BookingEntity> CreateBookingAsync(CreateBookingDto dto);

    /// <summary>
    /// Deletes a booking from the database.
    /// </summary>
    /// <param name="id">The unique identifier of the booking to delete.</param>
    /// <returns>True if booking was deleted, false if booking was not found.</returns>
    Task<bool> DeleteBookingAsync(int id);

    #endregion

    #region Validation Operations

    /// <summary>
    /// Checks if a booking exists in the database.
    /// </summary>
    /// <param name="id">The unique identifier of the booking.</param>
    /// <returns>True if booking exists, false otherwise.</returns>
    Task<bool> BookingExistsAsync(int id);

    /// <summary>
    /// Validates basic time range rules (not including overlap check).
    /// </summary>
    /// <param name="startTime">Start time of the booking.</param>
    /// <param name="endTime">End time of the booking.</param>
    /// <returns>True if time range is valid, false otherwise.</returns>
    Task<bool> IsValidTimeRangeAsync(DateTime startTime, DateTime endTime);

    /// <summary>
    /// Validates if the number of participants fits within the room's capacity.
    /// </summary>
    /// <param name="roomId">The unique identifier of the room.</param>
    /// <param name="numberOfParticipants">Number of participants for the booking.</param>
    /// <returns>True if capacity is sufficient, false if room doesn't exist or capacity exceeded.</returns>
    Task<bool> ValidateCapacityAsync(int roomId, int numberOfParticipants);

    /// <summary>
    /// Comprehensive validation of all booking business rules.
    /// </summary>
    /// <param name="roomId">The unique identifier of the room to book.</param>
    /// <param name="startTime">Start time of the booking.</param>
    /// <param name="endTime">End time of the booking.</param>
    /// <param name="numberOfParticipants">Optional number of participants (for capacity validation).</param>
    /// <returns>Tuple containing validation result (isValid, errorMessage).</returns>
    Task<(bool isValid, string? errorMessage)> ValidateBookingRulesAsync(int roomId, DateTime startTime, DateTime endTime, int? numberOfParticipants = null);

    #endregion

    #region Conflict Detection Operations

    /// <summary>
    /// Checks if there are any overlapping bookings for a room in the specified time range.
    /// </summary>
    /// <param name="roomId">The unique identifier of the room.</param>
    /// <param name="startTime">Start time of the booking to check.</param>
    /// <param name="endTime">End time of the booking to check.</param>
    /// <param name="excludeBookingId">Optional booking ID to exclude from overlap check (useful for updates).</param>
    /// <returns>True if there is an overlapping booking, false otherwise.</returns>
    Task<bool> HasTimeOverlapAsync(int roomId, DateTime startTime, DateTime endTime, int? excludeBookingId = null);

    /// <summary>
    /// Retrieves the first conflicting booking for a room in the specified time range.
    /// </summary>
    /// <param name="roomId">The unique identifier of the room.</param>
    /// <param name="startTime">Start time of the booking to check.</param>
    /// <param name="endTime">End time of the booking to check.</param>
    /// <returns>Conflicting booking if found, otherwise null.</returns>
    Task<BookingEntity?> GetConflictingBookingAsync(int roomId, DateTime startTime, DateTime endTime);

    #endregion
}
