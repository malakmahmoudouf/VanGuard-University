using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using CourseManagementSystem.Data;
using CourseManagementSystem.DTOs;
using CourseManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace CourseManagementSystem.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<ValidationFailedResponse?> RegisterAsync(RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return new ValidationFailedResponse { Message = "Username already exists." };
        }

        if (!string.IsNullOrEmpty(request.DepartmentId))
        {
            var deptExists = await _context.Departments.AnyAsync(d => d.Id == request.DepartmentId);
            if (!deptExists)
            {
                return new ValidationFailedResponse { Message = "Department not found." };
            }
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        User newUser;
        switch (request.Role.ToLower())
        {
            case "admin":
                newUser = new User { Id = $"A-{await _context.Users.CountAsync(u => u.Role == "Admin") + 1}", Username = request.Username, PasswordHash = passwordHash, Role = "Admin" };
                break;
            case "instructor":
                newUser = new Instructor 
                { 
                    Id = $"I-{await _context.Users.CountAsync(u => u.Role == "Instructor") + 1}",
                    Username = request.Username, 
                    PasswordHash = passwordHash, 
                    Role = "Instructor", 
                    FullName = request.FullName ?? string.Empty,
                    DepartmentId = request.DepartmentId
                };
                break;
            case "student":
                newUser = new Student 
                { 
                    Id = $"S-{await _context.Users.CountAsync(u => u.Role == "Student") + 1}",
                    Username = request.Username, 
                    PasswordHash = passwordHash, 
                    Role = "Student", 
                    FullName = request.FullName ?? string.Empty,
                    Major = request.Major ?? string.Empty,
                    DepartmentId = request.DepartmentId
                };
                break;
            default:
                return new ValidationFailedResponse { Message = "Invalid role specified." };
        }

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();
        return null;
    }

    public async Task<(LoginResponse? Response, string? ErrorMessage)> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return (null, "Invalid username or password.");
        }

        var jwtToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken(user.Id);

        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();

        return (new LoginResponse { Token = jwtToken, RefreshToken = refreshToken.Token }, null);
    }

    public async Task<(LoginResponse? Response, string? ErrorMessage)> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var storedToken = await _context.RefreshTokens.Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == request.RefreshToken);

        if (storedToken == null || !storedToken.IsActive)
        {
            return (null, "Invalid or expired refresh token.");
        }

        // Revoke current refresh token
        storedToken.Revoked = DateTime.UtcNow;

        // Generate new tokens
        var newJwtToken = GenerateJwtToken(storedToken.User);
        var newRefreshToken = GenerateRefreshToken(storedToken.UserId);

        _context.RefreshTokens.Add(newRefreshToken);
        await _context.SaveChangesAsync();

        return (new LoginResponse { Token = newJwtToken, RefreshToken = newRefreshToken.Token }, null);
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = Encoding.UTF8.GetBytes(jwtSettings["Secret"]!);

        string fullName = string.Empty;
        if (user is Student student) fullName = student.FullName;
        else if (user is Instructor instructor) fullName = instructor.FullName;
        else fullName = "Administrator";

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("FullName", fullName)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private RefreshToken GenerateRefreshToken(string userId)
    {
        return new RefreshToken
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            Expires = DateTime.UtcNow.AddDays(7),
            Created = DateTime.UtcNow,
            UserId = userId
        };
    }
}
