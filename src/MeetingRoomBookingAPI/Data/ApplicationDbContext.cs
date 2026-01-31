using Microsoft.EntityFrameworkCore;
using MeetingRoomBookingAPI.Models.Room;
using MeetingRoomBookingAPI.Models.Booking;

namespace MeetingRoomBookingAPI.Data;

/// <summary>
/// Entity Framework Core DbContext for the Meeting Room Booking API.
/// Manages database connections and entity configurations.
/// </summary>
public class ApplicationDbContext : DbContext
{
    #region Constructor

    /// <summary>
    /// Initializes a new instance of the ApplicationDbContext.
    /// </summary>
    /// <param name="options">DbContext options containing connection string and configuration.</param>
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    #endregion

    #region DbSets

    /// <summary>
    /// DbSet for Room entities.
    /// Represents the Rooms table in the database.
    /// </summary>
    public DbSet<Room> Rooms { get; set; } = null!;

    /// <summary>
    /// DbSet for Booking entities.
    /// Represents the Bookings table in the database.
    /// </summary>
    public DbSet<Booking> Bookings { get; set; } = null!;

    #endregion

    #region Protected Methods - Configuration

    /// <summary>
    /// Configures entity relationships, constraints, and database schema.
    /// Called by Entity Framework when building the model.
    /// </summary>
    /// <param name="modelBuilder">Builder used to configure the model.</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureRoomEntity(modelBuilder);
        ConfigureBookingEntity(modelBuilder);
    }

    #endregion

    #region Private Methods - Entity Configuration

    /// <summary>
    /// Configures the Room entity with its properties and constraints.
    /// </summary>
    /// <param name="modelBuilder">Builder used to configure the model.</param>
    private void ConfigureRoomEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Room>(entity =>
        {
            // Set Id as primary key
            entity.HasKey(e => e.Id);

            // Configure Name property: Required, max 100 characters
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);

            // Configure Capacity property: Required, must be positive
            entity.Property(e => e.Capacity).IsRequired();

            // Configure Location property: Required, max 200 characters
            entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
        });
    }

    /// <summary>
    /// Configures the Booking entity with its properties, constraints, and relationships.
    /// </summary>
    /// <param name="modelBuilder">Builder used to configure the model.</param>
    private void ConfigureBookingEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Booking>(entity =>
        {
            // Set Id as primary key
            entity.HasKey(e => e.Id);

            // Configure RoomId: Required foreign key
            entity.Property(e => e.RoomId).IsRequired();

            // Configure Title: Required, max 200 characters
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);

            // Configure StartTime: Required datetime
            entity.Property(e => e.StartTime).IsRequired();

            // Configure EndTime: Required datetime
            entity.Property(e => e.EndTime).IsRequired();

            // Configure CreatedBy: Required, max 100 characters
            entity.Property(e => e.CreatedBy).IsRequired().HasMaxLength(100);

            // Configure CreatedAt: Required datetime
            entity.Property(e => e.CreatedAt).IsRequired();

            // Configure relationship: Room (1) -> Bookings (Many)
            // One room can have many bookings, but each booking belongs to one room
            entity.HasOne(e => e.Room)
                  .WithMany(r => r.Bookings)
                  .HasForeignKey(e => e.RoomId)
                  .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete - cannot delete room if it has bookings
        });
    }

    #endregion
}
