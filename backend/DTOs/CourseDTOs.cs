using System.ComponentModel.DataAnnotations;

namespace CourseManagementSystem.DTOs;

public class CourseCreateDto
{
    [Required]
    public string Id { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string InstructorId { get; set; } = string.Empty;

    public int EnrollmentCount { get; set; } = 0;

    [Required]
    public string DepartmentId { get; set; } = string.Empty;
}

public class CourseUpdateDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
}

public class CourseReadDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string InstructorName { get; set; } = string.Empty;
    public int EnrollmentCount { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
}
