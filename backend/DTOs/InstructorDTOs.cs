using System.ComponentModel.DataAnnotations;

namespace CourseManagementSystem.DTOs;

public class InstructorReadDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? OfficeLocation { get; set; }
    public string? DepartmentName { get; set; }
    public List<CourseReadDto> Courses { get; set; } = new();
}

public class InstructorProfileUpdateDto
{
    [MaxLength(1000)]
    public string Bio { get; set; } = string.Empty;

    [MaxLength(100)]
    public string OfficeLocation { get; set; } = string.Empty;
}
