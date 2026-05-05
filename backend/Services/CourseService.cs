using CourseManagementSystem.Data;
using CourseManagementSystem.DTOs;
using CourseManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagementSystem.Services;

public class CourseService : ICourseService
{
    private readonly ApplicationDbContext _context;

    public CourseService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CourseReadDto>> GetAllCoursesAsync()
    {
        return await _context.Courses
            .Include(c => c.Department)
            .Include(c => c.Instructor)
            .Include(c => c.Enrollments)
            .AsNoTracking()
            .Select(c => new CourseReadDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                InstructorName = c.Instructor.FullName,
                EnrollmentCount = c.BaseEnrollmentCount + c.Enrollments.Count,
                DepartmentName = c.Department != null ? c.Department.Name : string.Empty
            })
            .ToListAsync();
    }

    public async Task<CourseReadDto?> GetCourseByIdAsync(string id)
    {
        return await _context.Courses
            .Include(c => c.Department)
            .Include(c => c.Instructor)
            .Include(c => c.Enrollments)
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new CourseReadDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                InstructorName = c.Instructor.FullName,
                EnrollmentCount = c.BaseEnrollmentCount + c.Enrollments.Count,
                DepartmentName = c.Department != null ? c.Department.Name : string.Empty
            })
            .FirstOrDefaultAsync();
    }

    public async Task<CourseReadDto?> CreateCourseAsync(CourseCreateDto dto)
    {
        // Check if ID already exists
        if (await _context.Courses.AnyAsync(c => c.Id == dto.Id)) return null;

        var instructorExists = await _context.Instructors.AnyAsync(i => i.Id == dto.InstructorId);
        if (!instructorExists)
        {
            return null; // Instructor not found
        }

        var departmentExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId);
        if (!departmentExists)
        {
            return null; // Department not found
        }

        var course = new Course
        {
            Id = dto.Id,
            Title = dto.Title,
            Description = dto.Description,
            InstructorId = dto.InstructorId,
            DepartmentId = dto.DepartmentId,
            BaseEnrollmentCount = dto.EnrollmentCount
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return await GetCourseByIdAsync(course.Id);
    }

    public async Task<CourseReadDto?> UpdateCourseAsync(string id, CourseUpdateDto dto)
    {
        var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == id);
        if (course == null) return null;

        course.Title = dto.Title;
        course.Description = dto.Description;

        await _context.SaveChangesAsync();

        return await GetCourseByIdAsync(course.Id);
    }

    public async Task<bool> DeleteCourseAsync(string id)
    {
        var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == id);
        if (course == null) return false;

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
        return true;
    }
}
