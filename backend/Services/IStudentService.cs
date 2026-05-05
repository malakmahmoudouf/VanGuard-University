using CourseManagementSystem.DTOs;

namespace CourseManagementSystem.Services;

public interface IStudentService
{
    Task<IEnumerable<StudentReadDto>> GetAllStudentsAsync();
    Task<StudentReadDto?> GetStudentByIdAsync(string id);
    Task<string> EnrollStudentInCourseAsync(string studentId, EnrollmentCreateDto dto);
}
