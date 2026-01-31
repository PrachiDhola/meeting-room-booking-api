namespace MeetingRoomBookingAPI.Models.Room;

/// <summary>
/// Represents a meeting room in the system.
/// Each room can have multiple bookings associated with it.
/// </summary>
public class Room
{
    #region Properties - Primary Key

    /// <summary>
    /// Unique identifier for the room (Primary Key).
    /// Auto-incremented by the database.
    /// </summary>
    public int Id { get; set; }

    #endregion

    #region Properties - Room Details

    /// <summary>
    /// Name of the room (e.g., "Conference Room A").
    /// Required field, maximum 100 characters.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Maximum number of people the room can accommodate.
    /// Required field, must be greater than 0.
    /// </summary>
    public int Capacity { get; set; }

    /// <summary>
    /// Physical location of the room (e.g., "First Floor - Building A").
    /// Required field, maximum 200 characters.
    /// </summary>
    public string Location { get; set; } = string.Empty;

    #endregion

    #region Navigation Properties

    /// <summary>
    /// Navigation property: Collection of all bookings for this room.
    /// Represents the one-to-many relationship (Room -> Bookings).
    /// </summary>
    public ICollection<Booking.Booking> Bookings { get; set; } = new List<Booking.Booking>();

    #endregion
}
