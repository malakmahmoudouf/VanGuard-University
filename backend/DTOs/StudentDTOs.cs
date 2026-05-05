using System.ComponentModel.DataAnnotations;

namespace CourseManagementSystem.DTOs;

public class StudentReadDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Major { get; set; } = string.Empty;
    public string? DepartmentName { get; set; }
    public string? DepartmentId { get; set; }
    public List<EnrollmentReadDto> Enrollments { get; set; } = new();
}

public class EnrollmentReadDto
{
    public string CourseId { get; set; } = string.Empty;
    public string CourseTitle { get; set; } = string.Empty;
    public string? Grade { get; set; }
}

public class EnrollmentCreateDto
{
    [Required]
    public string CourseId { get; set; } = string.Empty;
}

public class StudentUpdateDto
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Major { get; set; } = string.Empty;

    [Required]
    public string DepartmentId { get; set; } = string.Empty;
}
