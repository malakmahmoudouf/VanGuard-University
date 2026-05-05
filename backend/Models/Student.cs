namespace CourseManagementSystem.Models;

public class Student : User
{
    public string FullName { get; set; } = string.Empty;
    public string Major { get; set; } = string.Empty;

    // Many-to-many relationship via Enrollment
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    // Department relationship (Optional)
    public string? DepartmentId { get; set; }
    public Department? Department { get; set; }
}
