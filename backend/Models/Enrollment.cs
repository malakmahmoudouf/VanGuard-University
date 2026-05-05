namespace CourseManagementSystem.Models;

public class Enrollment
{
    public int Id { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public Student Student { get; set; } = null!;

    public string CourseId { get; set; } = string.Empty;
    public Course Course { get; set; } = null!;

    public string? Grade { get; set; }
}
