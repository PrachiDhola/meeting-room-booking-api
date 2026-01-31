using System.ComponentModel.DataAnnotations;

namespace MeetingRoomBookingAPI.Models.Booking.DTOs;

/// <summary>
/// Data Transfer Object for creating a new booking.
/// Used as the request model for POST /api/bookings endpoint.
/// </summary>
public class CreateBookingDto
{
    #region Properties - Required Fields

    /// <summary>
    /// ID of the room to be booked.
    /// Required field - must reference an existing room.
    /// </summary>
    [Required(ErrorMessage = "Room ID is required")]
    public int RoomId { get; set; }

    /// <summary>
    /// Title or description of the meeting.
    /// Required field, maximum 200 characters.
    /// </summary>
    [Required(ErrorMessage = "Title is required")]
    [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Start date and time of the booking.
    /// Required field, must be in the future and before EndTime.
    /// Format: ISO 8601 (e.g., "2026-02-10T10:00:00Z").
    /// </summary>
    [Required(ErrorMessage = "Start time is required")]
    public DateTime StartTime { get; set; }

    /// <summary>
    /// End date and time of the booking.
    /// Required field, must be after StartTime.
    /// Format: ISO 8601 (e.g., "2026-02-10T11:00:00Z").
    /// </summary>
    [Required(ErrorMessage = "End time is required")]
    public DateTime EndTime { get; set; }

    /// <summary>
    /// Email or identifier of the person creating the booking.
    /// Required field, maximum 100 characters.
    /// </summary>
    [Required(ErrorMessage = "Created by is required")]
    [StringLength(100, ErrorMessage = "Created by cannot exceed 100 characters")]
    public string CreatedBy { get; set; } = string.Empty;

    #endregion

    #region Properties - Optional Fields

    /// <summary>
    /// Number of participants expected for the meeting.
    /// Optional field - if provided, will be validated against room capacity.
    /// Must be at least 1 if specified.
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Number of participants must be at least 1")]
    public int? NumberOfParticipants { get; set; }

    #endregion
}
