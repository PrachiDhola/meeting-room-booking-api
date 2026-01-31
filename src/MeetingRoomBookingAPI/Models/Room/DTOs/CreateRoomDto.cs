using System.ComponentModel.DataAnnotations;

namespace MeetingRoomBookingAPI.Models.Room.DTOs;

/// <summary>
/// Data Transfer Object for creating a new room.
/// Used as the request model for POST /api/rooms endpoint.
/// </summary>
public class CreateRoomDto
{
    #region Properties

    /// <summary>
    /// Name of the room to be created.
    /// Required field, maximum 100 characters.
    /// </summary>
    [Required(ErrorMessage = "Room name is required")]
    [StringLength(100, ErrorMessage = "Room name cannot exceed 100 characters")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Maximum capacity of the room.
    /// Required field, must be at least 1.
    /// </summary>
    [Required(ErrorMessage = "Capacity is required")]
    [Range(1, int.MaxValue, ErrorMessage = "Capacity must be at least 1")]
    public int Capacity { get; set; }

    /// <summary>
    /// Physical location of the room.
    /// Required field, maximum 200 characters.
    /// </summary>
    [Required(ErrorMessage = "Location is required")]
    [StringLength(200, ErrorMessage = "Location cannot exceed 200 characters")]
    public string Location { get; set; } = string.Empty;

    #endregion
}
