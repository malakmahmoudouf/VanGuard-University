using CourseManagementSystem.DTOs;

namespace CourseManagementSystem.Services;

public interface IAuthService
{
    Task<ValidationFailedResponse?> RegisterAsync(RegisterRequest request);
    Task<(LoginResponse? Response, string? ErrorMessage)> LoginAsync(LoginRequest request);
    Task<(LoginResponse? Response, string? ErrorMessage)> RefreshTokenAsync(RefreshTokenRequest request);
}
