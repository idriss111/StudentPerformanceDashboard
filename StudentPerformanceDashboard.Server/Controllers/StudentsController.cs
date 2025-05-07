using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentPerformanceDashboard.Server.Models;

namespace StudentDashboard.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if email already exists
            if (await _context.Students.AnyAsync(s => s.Email == registerDto.Email))
            {
                return BadRequest(new { Message = "Email already registered." });
            }

            // Create new student entity
            var student = new Student
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                StudyProgram = registerDto.StudyProgram,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password)
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync(); // Don't forget to save changes!

            return Ok(new { Message = "Registration successful!" });
        }
    }

    public class RegisterDto
    {
        [Required] public string FirstName { get; set; }
        [Required] public string LastName { get; set; }
        [Required] public string StudyProgram { get; set; }
        [Required, EmailAddress] public string Email { get; set; }
        [Required, MinLength(8)] public string Password { get; set; }
    }
}