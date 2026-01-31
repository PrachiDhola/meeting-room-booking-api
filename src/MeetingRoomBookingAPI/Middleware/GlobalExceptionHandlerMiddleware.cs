using System.Net;
using System.Text.Json;

namespace MeetingRoomBookingAPI.Middleware;

/// <summary>
/// Global exception handling middleware.
/// Catches all unhandled exceptions and returns a consistent error response.
/// Should be registered early in the middleware pipeline.
/// </summary>
public class GlobalExceptionHandlerMiddleware
{
    #region Fields

    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    #endregion

    #region Constructor

    /// <summary>
    /// Initializes a new instance of the GlobalExceptionHandlerMiddleware.
    /// </summary>
    /// <param name="next">The next middleware in the pipeline.</param>
    /// <param name="logger">Logger for recording exceptions.</param>
    /// <param name="environment">Hosting environment (Development/Production).</param>
    public GlobalExceptionHandlerMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionHandlerMiddleware> logger,
        IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    #endregion

    #region Public Methods

    /// <summary>
    /// Invokes the middleware to process the HTTP request.
    /// Catches any unhandled exceptions and processes them.
    /// </summary>
    /// <param name="context">The HTTP context for the current request.</param>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Continue to next middleware in pipeline
            await _next(context);
        }
        catch (Exception ex)
        {
            // Log the exception for monitoring/debugging
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            
            // Handle the exception and return error response
            await HandleExceptionAsync(context, ex);
        }
    }

    #endregion

    #region Private Methods - Utilities

    /// <summary>
    /// Handles the exception and creates an appropriate HTTP response.
    /// </summary>
    /// <param name="context">The HTTP context for the current request.</param>
    /// <param name="exception">The exception that was caught.</param>
    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        // Set response content type and status code
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        // Create error response object
        // In Development: Include detailed error information
        // In Production: Return generic message for security
        var response = new
        {
            message = "An error occurred while processing your request",
            error = _environment.IsDevelopment() ? exception.Message : null,
            innerException = _environment.IsDevelopment() ? exception.InnerException?.Message : null,
            stackTrace = _environment.IsDevelopment() ? exception.StackTrace : null
        };

        // Serialize response to JSON
        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        // Write response to HTTP context
        await context.Response.WriteAsync(jsonResponse);
    }

    #endregion
}
