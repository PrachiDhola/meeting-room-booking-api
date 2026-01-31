using Microsoft.EntityFrameworkCore;
using MeetingRoomBookingAPI.Data;
using MeetingRoomBookingAPI.Services.Room;
using MeetingRoomBookingAPI.Services.Booking;
using MeetingRoomBookingAPI.Middleware;

var builder = WebApplication.CreateBuilder(args);

#region Configure Services

// Add Controllers with JSON options
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Handle circular references in navigation properties
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        // Format JSON output for readability
        options.JsonSerializerOptions.WriteIndented = true;
    });

// Add API Explorer for endpoint discovery
builder.Services.AddEndpointsApiExplorer();

// Add Swagger/OpenAPI for API documentation
builder.Services.AddSwaggerGen();

// Configure CORS (Cross-Origin Resource Sharing)
// Allows API to be accessed from different origins (frontend applications)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()      // Allow requests from any origin
              .AllowAnyMethod()       // Allow all HTTP methods (GET, POST, etc.)
              .AllowAnyHeader();      // Allow all headers
    });
});

// Configure Entity Framework Core DbContext with SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Application Services (Dependency Injection)
// Scoped: New instance per HTTP request
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IBookingService, BookingService>();

#endregion

// Build the application
var app = builder.Build();

#region Configure HTTP Request Pipeline

// Enable Swagger UI in Development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();      // Generate OpenAPI/Swagger JSON
    app.UseSwaggerUI();    // Serve Swagger UI at /swagger
}

// Add Global Exception Handler (must be early in pipeline to catch all exceptions)
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

// Redirect HTTP requests to HTTPS
app.UseHttpsRedirection();

// Enable CORS (must be before UseAuthorization)
app.UseCors("AllowAll");

// Enable authorization (if authentication is added later)
app.UseAuthorization();

// Map controller endpoints
app.MapControllers();

// Health check endpoint - used to verify API is running
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
    .WithName("HealthCheck")
    .WithTags("Health");

#endregion

// Start the application
app.Run();
