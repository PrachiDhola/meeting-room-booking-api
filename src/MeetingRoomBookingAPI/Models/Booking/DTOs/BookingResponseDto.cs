namespace MeetingRoomBookingAPI.Models.Booking.DTOs;

/// <summary>
/// Data Transfer Object for booking response.
/// Used to return booking information with room details.
/// Can be used to avoid circular reference issues in JSON serialization.
/// </summary>
public class BookingResponseDto
{
    #region Properties

    /// <summary>
    /// Unique identifier of the booking.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// ID of the room associated with this booking.
    /// </summary>
    public int RoomId { get; set; }

    /// <summary>
    /// Title or description of the meeting.
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Start date and time of the booking.
    /// </summary>
    public DateTime StartTime { get; set; }

    /// <summary>
    /// End date and time of the booking.
    /// </summary>
    public DateTime EndTime { get; set; }

    /// <summary>
    /// Email or identifier of the person who created the booking.
    /// </summary>
    public string CreatedBy { get; set; } = string.Empty;

    /// <summary>
    /// Timestamp when the booking was created.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Room information associated with this booking.
    /// Contains basic room details without circular references.
    /// </summary>
    public RoomInfoDto? Room { get; set; }

    #endregion
}

/// <summary>
/// Data Transfer Object for room information in booking responses.
/// Contains essential room details without navigation properties.
/// </summary>
public class RoomInfoDto
{
    #region Properties

    /// <summary>
    /// Unique identifier of the room.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Name of the room.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Maximum capacity of the room.
    /// </summary>
    public int Capacity { get; set; }

    /// <summary>
    /// Physical location of the room.
    /// </summary>
    public string Location { get; set; } = string.Empty;

    #endregion
}
