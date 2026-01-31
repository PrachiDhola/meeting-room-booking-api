using Microsoft.AspNetCore.Mvc;

namespace MeetingRoomBookingAPI.Controllers.Health;

/// <summary>
/// Controller for health check endpoints.
/// Used to verify that the API is running and responding.
/// Base route: /api/health
/// </summary>
[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    #region Public Methods - GET

    /// <summary>
    /// Health check endpoint.
    /// GET: /api/health
    /// </summary>
    /// <returns>Health status with current timestamp.</returns>
    /// <response code="200">API is healthy and running.</response>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetHealthStatus()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }

    #endregion
}
