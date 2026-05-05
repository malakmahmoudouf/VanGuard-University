using CourseManagementSystem.DTOs;

namespace CourseManagementSystem.Services;

public interface IInstructorService
{
    Task<IEnumerable<InstructorReadDto>> GetAllInstructorsAsync();
    Task<InstructorReadDto?> GetInstructorByIdAsync(string id);
    Task<InstructorReadDto?> UpdateInstructorProfileAsync(string id, InstructorProfileUpdateDto dto);
    Task<InstructorReadDto?> UpdateInstructorAdminAsync(string id, InstructorUpdateAdminDto dto);
}
