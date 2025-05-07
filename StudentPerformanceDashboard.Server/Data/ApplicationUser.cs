using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentPerformanceDashboard.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        // Extended properties
        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        // Navigation property to Student
        [ForeignKey("UserId")]
        public virtual Student? Student { get; set; }
    }
}