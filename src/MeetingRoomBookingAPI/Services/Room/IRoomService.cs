using RoomEntity = MeetingRoomBookingAPI.Models.Room.Room;
using MeetingRoomBookingAPI.Models.Room.DTOs;
using BookingEntity = MeetingRoomBookingAPI.Models.Booking.Booking;

namespace MeetingRoomBookingAPI.Services.Room;

/// <summary>
/// Interface for room-related business logic operations.
/// Defines the contract for room service implementations.
/// </summary>
public interface IRoomService
{
    #region CRUD Operations

    /// <summary>
    /// Retrieves all rooms from the database.
    /// </summary>
    /// <returns>Collection of all rooms.</returns>
    Task<IEnumerable<RoomEntity>> GetAllRoomsAsync();

    /// <summary>
    /// Retrieves a specific room by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the room.</param>
    /// <returns>Room entity if found, otherwise null.</returns>
    Task<RoomEntity?> GetRoomByIdAsync(int id);

    /// <summary>
    /// Creates a new room in the database.
    /// </summary>
    /// <param name="dto">Data transfer object containing room information.</param>
    /// <returns>The created room entity with generated ID.</returns>
    Task<RoomEntity> CreateRoomAsync(CreateRoomDto dto);

    /// <summary>
    /// Deletes a room from the database.
    /// </summary>
    /// <param name="id">The unique identifier of the room to delete.</param>
    /// <returns>True if room was deleted, false if room was not found.</returns>
    Task<bool> DeleteRoomAsync(int id);

    #endregion

    #region Query Operations

    /// <summary>
    /// Retrieves all bookings for a specific room.
    /// </summary>
    /// <param name="roomId">The unique identifier of the room.</param>
    /// <returns>Collection of bookings for the specified room, ordered by start time.</returns>
    Task<IEnumerable<BookingEntity>> GetRoomBookingsAsync(int roomId);

    /// <summary>
    /// Checks if a room exists in the database.
    /// </summary>
    /// <param name="id">The unique identifier of the room.</param>
    /// <returns>True if room exists, false otherwise.</returns>
    Task<bool> RoomExistsAsync(int id);

    /// <summary>
    /// Checks if a room has any future bookings.
    /// Used to enforce business rule: Cannot delete room with future bookings.
    /// </summary>
    /// <param name="roomId">The unique identifier of the room.</param>
    /// <returns>True if room has future bookings, false otherwise.</returns>
    Task<bool> HasFutureBookingsAsync(int roomId);

    #endregion
}
