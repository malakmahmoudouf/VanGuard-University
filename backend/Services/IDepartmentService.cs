using CourseManagementSystem.DTOs;

namespace CourseManagementSystem.Services;

public interface IDepartmentService
{
    Task<IEnumerable<DepartmentReadDto>> GetAllDepartmentsAsync();
    Task<DepartmentReadDto?> GetDepartmentByIdAsync(string id);
    Task<DepartmentReadDto?> CreateDepartmentAsync(DepartmentCreateDto dto);
    Task<DepartmentReadDto?> UpdateDepartmentAsync(string id, DepartmentUpdateDto dto);
    Task<bool> DeleteDepartmentAsync(string id);
}
