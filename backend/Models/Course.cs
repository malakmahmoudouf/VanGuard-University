namespace CourseManagementSystem.Models;

public class Course
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int BaseEnrollmentCount { get; set; } = 0;

    // Foreign key and navigation property (1-to-many)
    public string InstructorId { get; set; } = string.Empty;
    public Instructor Instructor { get; set; } = null!;

    // Many-to-many relationship via Enrollment
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    // Department relationship
    public string DepartmentId { get; set; } = string.Empty;
    public Department Department { get; set; } = null!;
}
