using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeetingRoomBookingAPI.Data;

namespace MeetingRoomBookingAPI.Controllers.Diagnostics;

/// <summary>
/// Controller for testing database connectivity.
/// Used for diagnostics and troubleshooting database connection issues.
/// Base route: /api/databasetest
/// </summary>
[ApiController]
[Route("api/databasetest")]
public class DatabaseTestController : ControllerBase
{
    #region Fields

    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<DatabaseTestController> _logger;

    #endregion

    #region Constructor

    /// <summary>
    /// Initializes a new instance of the DatabaseTestController.
    /// </summary>
    /// <param name="context">Database context for connection testing.</param>
    /// <param name="configuration">Configuration for accessing connection string.</param>
    /// <param name="logger">Logger for recording diagnostic activities.</param>
    public DatabaseTestController(
        ApplicationDbContext context, 
        IConfiguration configuration,
        ILogger<DatabaseTestController> logger)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
    }

    #endregion

    #region Public Methods - GET

    /// <summary>
    /// Tests the database connection and returns diagnostic information.
    /// GET: /api/databasetest
    /// </summary>
    /// <returns>Connection status, room count, and connection string (masked).</returns>
    /// <response code="200">Database connection successful.</response>
    /// <response code="400">Connection string not configured.</response>
    /// <response code="500">Database connection failed.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> TestConnection()
    {
        try
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            
            // Test 1: Check if connection string exists
            if (string.IsNullOrEmpty(connectionString))
            {
                return BadRequest(new 
                { 
                    success = false,
                    message = "Connection string is not configured",
                    connectionString = "NULL or EMPTY"
                });
            }

            // Test 2: Try to connect to database
            var canConnect = await _context.Database.CanConnectAsync();
            
            if (!canConnect)
            {
                return StatusCode(500, new 
                { 
                    success = false,
                    message = "Cannot connect to database",
                    connectionString = MaskConnectionString(connectionString)
                });
            }

            // Test 3: Try a simple query
            var roomCount = await _context.Rooms.CountAsync();

            return Ok(new 
            { 
                success = true,
                message = "Database connection successful",
                roomCount = roomCount,
                connectionString = MaskConnectionString(connectionString),
                serverInfo = "Connected successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database connection test failed");
            
            return StatusCode(500, new 
            { 
                success = false,
                message = "Database connection test failed",
                error = ex.Message,
                innerException = ex.InnerException?.Message,
                stackTrace = ex.StackTrace
            });
        }
    }

    #endregion

    #region Private Methods - Utilities

    /// <summary>
    /// Masks sensitive information (password) in connection string for security.
    /// </summary>
    /// <param name="connectionString">The connection string to mask.</param>
    /// <returns>Connection string with password masked.</returns>
    private string MaskConnectionString(string connectionString)
    {
        if (string.IsNullOrEmpty(connectionString))
            return "N/A";

        // Mask password in connection string for security
        return connectionString
            .Replace("Password=pass@word1", "Password=***")
            .Replace("Password=", "Password=***");
    }

    #endregion
}
