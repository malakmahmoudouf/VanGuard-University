using CourseManagementSystem.DTOs;
using CourseManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseManagementSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var errorResponse = await _authService.RegisterAsync(request);
        if (errorResponse != null)
        {
            return BadRequest(new { errorResponse.Message });
        }

        return Ok(new { Message = "User registered successfully." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (response, errorMessage) = await _authService.LoginAsync(request);

        if (errorMessage != null)
        {
            return Unauthorized(new { Message = errorMessage });
        }

        return Ok(response);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (response, errorMessage) = await _authService.RefreshTokenAsync(request);

        if (errorMessage != null)
        {
            return Unauthorized(new { Message = errorMessage });
        }

        return Ok(response);
    }
}
