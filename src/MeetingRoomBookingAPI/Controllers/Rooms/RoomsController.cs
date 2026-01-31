using Microsoft.AspNetCore.Mvc;
using MeetingRoomBookingAPI.Models.Room;
using MeetingRoomBookingAPI.Models.Room.DTOs;
using MeetingRoomBookingAPI.Models.Booking;
using MeetingRoomBookingAPI.Services.Room;

namespace MeetingRoomBookingAPI.Controllers.Rooms;

/// <summary>
/// Controller for managing meeting rooms.
/// Handles all HTTP requests related to room operations (CRUD).
/// Base route: /api/rooms
/// </summary>
[ApiController]
[Route("api/rooms")]
public class RoomsController : ControllerBase
{
    #region Fields

    private readonly IRoomService _roomService;
    private readonly ILogger<RoomsController> _logger;

    #endregion

    #region Constructor

    /// <summary>
    /// Initializes a new instance of the RoomsController.
    /// </summary>
    /// <param name="roomService">Service for room business logic operations.</param>
    /// <param name="logger">Logger for recording controller activities.</param>
    public RoomsController(IRoomService roomService, ILogger<RoomsController> logger)
    {
        _roomService = roomService;
        _logger = logger;
    }

    #endregion

    #region Public Methods - GET

    /// <summary>
    /// Retrieves all rooms from the database.
    /// GET: /api/rooms
    /// </summary>
    /// <returns>List of all rooms with their details (Id, Name, Capacity, Location).</returns>
    /// <response code="200">Successfully retrieved all rooms.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Models.Room.Room>>> GetAllRooms()
    {
        var rooms = await _roomService.GetAllRoomsAsync();
        return Ok(rooms);
    }

    /// <summary>
    /// Retrieves a specific room by its ID.
    /// GET: /api/rooms/{id}
    /// </summary>
    /// <param name="id">The unique identifier of the room.</param>
    /// <returns>Room details if found, otherwise 404 Not Found.</returns>
    /// <response code="200">Room found and returned successfully.</response>
    /// <response code="404">Room with the specified ID does not exist.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Models.Room.Room>> GetRoomById(int id)
    {
        var room = await _roomService.GetRoomByIdAsync(id);
        
        if (room == null)
        {
            return NotFound(new { message = $"Room with ID {id} not found" });
        }

        return Ok(room);
    }

    /// <summary>
    /// Retrieves all bookings for a specific room.
    /// GET: /api/rooms/{id}/bookings
    /// </summary>
    /// <param name="id">The unique identifier of the room.</param>
    /// <returns>List of all bookings for the specified room, ordered by start time.</returns>
    /// <response code="200">Bookings retrieved successfully.</response>
    /// <response code="404">Room with the specified ID does not exist.</response>
    [HttpGet("{id}/bookings")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<Models.Booking.Booking>>> GetRoomBookings(int id)
    {
        // Verify room exists before retrieving bookings
        if (!await _roomService.RoomExistsAsync(id))
        {
            return NotFound(new { message = $"Room with ID {id} not found" });
        }

        // Get all bookings for this room
        var bookings = await _roomService.GetRoomBookingsAsync(id);
        return Ok(bookings);
    }

    #endregion

    #region Public Methods - POST

    /// <summary>
    /// Creates a new room in the database.
    /// POST: /api/rooms
    /// </summary>
    /// <param name="dto">Data transfer object containing room information (Name, Capacity, Location).</param>
    /// <returns>Created room with generated ID and location header.</returns>
    /// <response code="201">Room created successfully.</response>
    /// <response code="400">Invalid input data (validation failed).</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Models.Room.Room>> CreateRoom(CreateRoomDto dto)
    {
        // Validate model state (required fields, data types, etc.)
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Create room using service layer
        var room = await _roomService.CreateRoomAsync(dto);
        
        // Return 201 Created with location header pointing to the new resource
        return CreatedAtAction(nameof(GetRoomById), new { id = room.Id }, room);
    }

    #endregion

    #region Public Methods - DELETE

    /// <summary>
    /// Deletes a room from the database.
    /// DELETE: /api/rooms/{id}
    /// Business Rule: Cannot delete a room that has future bookings.
    /// </summary>
    /// <param name="id">The unique identifier of the room to delete.</param>
    /// <returns>No content if successful, otherwise appropriate error status.</returns>
    /// <response code="204">Room deleted successfully.</response>
    /// <response code="403">Room cannot be deleted because it has future bookings.</response>
    /// <response code="404">Room with the specified ID does not exist.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteRoom(int id)
    {
        // Check if room exists
        if (!await _roomService.RoomExistsAsync(id))
        {
            return NotFound(new { message = $"Room with ID {id} not found" });
        }

        // Business Rule: Check if room has future bookings
        // Cannot delete a room if it has bookings scheduled in the future
        if (await _roomService.HasFutureBookingsAsync(id))
        {
            return StatusCode(403, new { message = "Cannot delete room with future bookings" });
        }

        // Delete the room
        await _roomService.DeleteRoomAsync(id);
        return NoContent();
    }

    #endregion
}
