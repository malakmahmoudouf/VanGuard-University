using CourseManagementSystem.Data;
using CourseManagementSystem.DTOs;
using CourseManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagementSystem.Services;

public class StudentService : IStudentService
{
    private readonly ApplicationDbContext _context;

    public StudentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<StudentReadDto>> GetAllStudentsAsync()
    {
        return await _context.Students
            .Include(s => s.Department)
            .AsNoTracking()
            .Select(s => new StudentReadDto
            {
                Id = s.Id,
                Username = s.Username,
                FullName = s.FullName,
                Major = s.Major,
                DepartmentName = s.Department != null ? s.Department.Name : null,
                DepartmentId = s.DepartmentId,
                Enrollments = s.Enrollments.Select(e => new EnrollmentReadDto
                {
                    CourseId = e.CourseId,
                    CourseTitle = e.Course.Title,
                    Grade = e.Grade
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<StudentReadDto?> GetStudentByIdAsync(string id)
    {
        return await _context.Students
            .Include(s => s.Department)
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new StudentReadDto
            {
                Id = s.Id,
                Username = s.Username,
                FullName = s.FullName,
                Major = s.Major,
                DepartmentName = s.Department != null ? s.Department.Name : null,
                DepartmentId = s.DepartmentId,
                Enrollments = s.Enrollments.Select(e => new EnrollmentReadDto
                {
                    CourseId = e.CourseId,
                    CourseTitle = e.Course.Title,
                    Grade = e.Grade
                }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<string> EnrollStudentInCourseAsync(string studentId, EnrollmentCreateDto dto)
    {
        var studentExists = await _context.Students.AnyAsync(s => s.Id == studentId);
        if (!studentExists) return "Student not found.";

        var courseExists = await _context.Courses.AnyAsync(c => c.Id == dto.CourseId);
        if (!courseExists) return "Course not found.";

        var alreadyEnrolled = await _context.Enrollments
            .AnyAsync(e => e.StudentId == studentId && e.CourseId == dto.CourseId);
        
        if (alreadyEnrolled) return "Student is already enrolled in this course.";

        var enrollment = new Enrollment
        {
            StudentId = studentId,
            CourseId = dto.CourseId
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        return "Success";
    }

    public async Task<StudentReadDto?> UpdateStudentAsync(string id, StudentUpdateDto dto)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null) return null;

        var departmentExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId);
        if (!departmentExists) throw new ArgumentException("Invalid Department ID.");

        student.FullName = dto.FullName;
        student.Major = dto.Major;
        student.DepartmentId = dto.DepartmentId;

        await _context.SaveChangesAsync();
        return await GetStudentByIdAsync(id);
    }
}
