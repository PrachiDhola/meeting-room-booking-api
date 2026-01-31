using Microsoft.AspNetCore.Mvc;
using MeetingRoomBookingAPI.Models.Booking;
using MeetingRoomBookingAPI.Models.Booking.DTOs;
using MeetingRoomBookingAPI.Services.Booking;
using MeetingRoomBookingAPI.Services.Room;

namespace MeetingRoomBookingAPI.Controllers.Bookings;

/// <summary>
/// Controller for managing room bookings/reservations.
/// Handles all HTTP requests related to booking operations (CRUD).
/// Base route: /api/bookings
/// </summary>
[ApiController]
[Route("api/bookings")]
public class BookingsController : ControllerBase
{
    #region Fields

    private readonly IBookingService _bookingService;
    private readonly IRoomService _roomService;
    private readonly ILogger<BookingsController> _logger;

    #endregion

    #region Constructor

    /// <summary>
    /// Initializes a new instance of the BookingsController.
    /// </summary>
    /// <param name="bookingService">Service for booking business logic operations.</param>
    /// <param name="roomService">Service for room operations (used for validation).</param>
    /// <param name="logger">Logger for recording controller activities.</param>
    public BookingsController(
        IBookingService bookingService,
        IRoomService roomService,
        ILogger<BookingsController> logger)
    {
        _bookingService = bookingService;
        _roomService = roomService;
        _logger = logger;
    }

    #endregion

    #region Public Methods - GET

    /// <summary>
    /// Retrieves all bookings from the database.
    /// GET: /api/bookings
    /// </summary>
    /// <returns>List of all bookings with room information, ordered by start time.</returns>
    /// <response code="200">Successfully retrieved all bookings.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Models.Booking.Booking>>> GetAllBookings()
    {
        var bookings = await _bookingService.GetAllBookingsAsync();
        return Ok(bookings);
    }

    /// <summary>
    /// Retrieves a specific booking by its ID.
    /// GET: /api/bookings/{id}
    /// </summary>
    /// <param name="id">The unique identifier of the booking.</param>
    /// <returns>Booking details with room information if found, otherwise 404 Not Found.</returns>
    /// <response code="200">Booking found and returned successfully.</response>
    /// <response code="404">Booking with the specified ID does not exist.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Models.Booking.Booking>> GetBookingById(int id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);

        if (booking == null)
        {
            return NotFound(new { message = $"Booking with ID {id} not found" });
        }

        return Ok(booking);
    }

    #endregion

    #region Public Methods - POST

    /// <summary>
    /// Creates a new booking in the database.
    /// POST: /api/bookings
    /// 
    /// Business Rules Enforced:
    /// - StartTime must be before EndTime
    /// - Cannot create bookings in the past
    /// - Minimum booking duration: 15 minutes
    /// - Maximum booking duration: 8 hours
    /// - Room must exist
    /// - Number of participants cannot exceed room capacity (if specified)
    /// - No overlapping bookings allowed for the same room
    /// </summary>
    /// <param name="dto">Data transfer object containing booking information.</param>
    /// <returns>Created booking with generated ID and location header.</returns>
    /// <response code="201">Booking created successfully.</response>
    /// <response code="400">Invalid input data or validation rule violation.</response>
    /// <response code="404">Room with the specified ID does not exist.</response>
    /// <response code="409">Booking conflicts with an existing booking (time overlap).</response>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<Models.Booking.Booking>> CreateBooking(CreateBookingDto dto)
    {
        // Validate model state (required fields, data types, string lengths, etc.)
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Validate all business rules in one centralized method
        // This includes: time validation, capacity check, overlap detection, etc.
        var (isValid, errorMessage) = await _bookingService.ValidateBookingRulesAsync(
            dto.RoomId, 
            dto.StartTime, 
            dto.EndTime, 
            dto.NumberOfParticipants);

        if (!isValid)
        {
            // Check if it's a conflict (409) or validation error (400)
            if (errorMessage?.Contains("already booked") == true)
            {
                // Get conflicting booking details for better error response
                var conflictingBooking = await _bookingService.GetConflictingBookingAsync(
                    dto.RoomId, dto.StartTime, dto.EndTime);
                
                return Conflict(new
                {
                    message = errorMessage,
                    conflictingBooking = conflictingBooking != null ? new
                    {
                        id = conflictingBooking.Id,
                        title = conflictingBooking.Title,
                        startTime = conflictingBooking.StartTime,
                        endTime = conflictingBooking.EndTime
                    } : null
                });
            }

            // Return validation error (400 Bad Request)
            return BadRequest(new { message = errorMessage });
        }

        // All validations passed - create the booking
        var booking = await _bookingService.CreateBookingAsync(dto);
        
        // Return 201 Created with location header pointing to the new resource
        return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
    }

    #endregion

    #region Public Methods - DELETE

    /// <summary>
    /// Cancels/deletes a booking from the database.
    /// DELETE: /api/bookings/{id}
    /// </summary>
    /// <param name="id">The unique identifier of the booking to cancel.</param>
    /// <returns>No content if successful, otherwise appropriate error status.</returns>
    /// <response code="204">Booking deleted successfully.</response>
    /// <response code="404">Booking with the specified ID does not exist.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        // Check if booking exists
        if (!await _bookingService.BookingExistsAsync(id))
        {
            return NotFound(new { message = $"Booking with ID {id} not found" });
        }

        // Delete the booking
        await _bookingService.DeleteBookingAsync(id);
        return NoContent();
    }

    #endregion
}
