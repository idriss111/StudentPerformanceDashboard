using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Identity;
using StudentPerformanceDashboard.Server.Models;

public class ApplicationDbContext : DbContext// Using default IdentityUser
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Student> Students { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // If you still need the Student relationship
        modelBuilder.Entity<IdentityUser>()
            .HasOne<Student>()
            .WithOne()
            .HasForeignKey<Student>(s => s.UserId)
            .IsRequired(false);
    }
}