using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentPerformanceDashboard.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using StudentPerformanceDashboard.Server.ML;
using Microsoft.ML;
using StudentPerformanceDashboard.Server.Controllers;
// Assuming you have a DataLoader class in this namespace    

namespace StudentDashboard.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ModelTrainer _modelTrainer;

        public StudentsController(
            ApplicationDbContext context,
            IConfiguration configuration,
            ModelTrainer modelTrainer // Injected dependency
        )
        {
            _context = context;
            _configuration = configuration;
            _modelTrainer = modelTrainer;
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

        // Loginnnnnnnnnnn
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find student by email
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Email == loginDto.Email);

            if (student == null)
            {
                // Return generic error to prevent email enumeration
                return Unauthorized(new { Message = "Invalid credentials" });
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, student.PasswordHash))
            {
                return Unauthorized(new { Message = "Invalid credentials" });
            }

            // Create claims for JWT
            var claims = new[]
            {
           new Claim(JwtRegisteredClaimNames.Sub, student.Email),
           new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
           new Claim("userId", student.Id.ToString()),
           new Claim("fullName", $"{student.FirstName} {student.LastName}")
              };

            // Get JWT config from appsettings.json
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: credentials
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = new
                {
                    student.Id,
                    student.Email,
                    student.FirstName,
                    student.LastName,
                    student.StudyProgram
                }
            });
        }

        [HttpGet("ml/analytics")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DataStats))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetDataAnalytics()
        {
            try
            {
                var loader = new DataLoader();
                var stats = loader.LoadAndAnalyzeData();

                if (stats.Errors.Count > 0)
                    return BadRequest(new { Errors = stats.Errors });

                return Ok(stats);
            }
            catch (Exception ex)
            {                                                                                                                                                                                           
                return StatusCode(500, $"Server Error: {ex.Message}");
            }
        }



        [HttpPost("ml/train")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult TrainModel()
        {
            var result = _modelTrainer.TrainRandomForest();

            if (!result.Success)
            {
                return BadRequest(new { Errors = result.Errors });
            }

            // Map ML.NET metrics to your DTO
            var metricsDto = new ModelMetricsDto
            {
                MacroAccuracy = result.Metrics?.MacroAccuracy ?? 0,
                MicroAccuracy = result.Metrics?.MicroAccuracy ?? 0, 
                LogLoss = result.Metrics?.LogLoss ?? 0,
                LogLossReduction = result.Metrics?.LogLossReduction ?? 0,
                TopKAccuracy = result.Metrics?.TopKAccuracy ?? 0,
            };

            return Ok(new
            {
                Message = "Model trained successfully",
                Metrics = metricsDto
            });
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
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}