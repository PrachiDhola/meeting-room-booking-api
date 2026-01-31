namespace MeetingRoomBookingAPI.Models.Booking;

/// <summary>
/// Represents a booking/reservation for a meeting room.
/// Each booking is associated with one room and contains time and participant information.
/// </summary>
public class Booking
{
    #region Properties - Primary Key

    /// <summary>
    /// Unique identifier for the booking (Primary Key).
    /// Auto-incremented by the database.
    /// </summary>
    public int Id { get; set; }

    #endregion

    #region Properties - Foreign Key

    /// <summary>
    /// Foreign key reference to the Room entity.
    /// Required field - every booking must be associated with a room.
    /// </summary>
    public int RoomId { get; set; }

    #endregion

    #region Properties - Booking Details

    /// <summary>
    /// Title or description of the meeting/booking.
    /// Required field, maximum 200 characters.
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Start date and time of the booking.
    /// Required field, must be in the future and before EndTime.
    /// Stored in UTC format.
    /// </summary>
    public DateTime StartTime { get; set; }

    /// <summary>
    /// End date and time of the booking.
    /// Required field, must be after StartTime.
    /// Stored in UTC format.
    /// </summary>
    public DateTime EndTime { get; set; }

    /// <summary>
    /// Email or identifier of the person who created the booking.
    /// Required field, maximum 100 characters.
    /// </summary>
    public string CreatedBy { get; set; } = string.Empty;

    /// <summary>
    /// Timestamp when the booking was created.
    /// Automatically set to current UTC time when booking is created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    #endregion

    #region Navigation Properties

    /// <summary>
    /// Navigation property: Reference to the Room entity.
    /// Represents the many-to-one relationship (Booking -> Room).
    /// </summary>
    public Room.Room Room { get; set; } = null!;

    #endregion
}
