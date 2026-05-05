using CourseManagementSystem.DTOs;

namespace CourseManagementSystem.Services;

public interface ICourseService
{
    Task<IEnumerable<CourseReadDto>> GetAllCoursesAsync();
    Task<CourseReadDto?> GetCourseByIdAsync(string id);
    Task<CourseReadDto?> CreateCourseAsync(CourseCreateDto dto);
    Task<CourseReadDto?> UpdateCourseAsync(string id, CourseUpdateDto dto);
    Task<bool> DeleteCourseAsync(string id);
}
