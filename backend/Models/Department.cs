namespace CourseManagementSystem.Models;

public class Department
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Navigation properties
    public ICollection<Course> Courses { get; set; } = new List<Course>();
    public ICollection<Instructor> Instructors { get; set; } = new List<Instructor>();
    public ICollection<Student> Students { get; set; } = new List<Student>();
}
