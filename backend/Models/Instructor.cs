namespace CourseManagementSystem.Models;

public class Instructor : User
{
    public string FullName { get; set; } = string.Empty;
    // 1-to-1 relationship
    public InstructorProfile? Profile { get; set; }

    // 1-to-many relationship
    public ICollection<Course> Courses { get; set; } = new List<Course>();

    // Department relationship
    public string? DepartmentId { get; set; }
    public Department? Department { get; set; }
}
