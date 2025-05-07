namespace StudentPerformanceDashboard.Server.Models;
using System.ComponentModel.DataAnnotations;

public class Student
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string FirstName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public string StudyProgram { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty; 


    // Remove Email/Password since these will be handled by Identity
    // Add relationship to ApplicationUser
    public string? UserId { get; set; }  // Foreign key to IdentityUser
    public virtual ApplicationUser? User { get; set; }
}