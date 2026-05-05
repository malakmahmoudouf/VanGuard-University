namespace CourseManagementSystem.Models;

public class InstructorProfile
{
    public int Id { get; set; }
    public string Bio { get; set; } = string.Empty;
    public string OfficeLocation { get; set; } = string.Empty;
    
    // Foreign key and navigation property
    public string InstructorId { get; set; } = string.Empty;
    public Instructor Instructor { get; set; } = null!;
}
