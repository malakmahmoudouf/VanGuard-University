using CourseManagementSystem.Data;
using CourseManagementSystem.DTOs;
using CourseManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagementSystem.Services;

public class InstructorService : IInstructorService
{
    private readonly ApplicationDbContext _context;

    public InstructorService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<InstructorReadDto>> GetAllInstructorsAsync()
    {
        return await _context.Instructors
            .Include(i => i.Department)
            .AsNoTracking()
            .Select(i => new InstructorReadDto
            {
                Id = i.Id,
                Username = i.Username,
                FullName = i.FullName,
                Bio = i.Profile != null ? i.Profile.Bio : null,
                OfficeLocation = i.Profile != null ? i.Profile.OfficeLocation : null,
                DepartmentName = i.Department != null ? i.Department.Name : null,
                DepartmentId = i.DepartmentId,
                Courses = i.Courses.Select(c => new CourseReadDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    InstructorName = i.FullName,
                    EnrollmentCount = c.Enrollments.Count
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<InstructorReadDto?> GetInstructorByIdAsync(string id)
    {
        return await _context.Instructors
            .Include(i => i.Department)
            .AsNoTracking()
            .Where(i => i.Id == id)
            .Select(i => new InstructorReadDto
            {
                Id = i.Id,
                Username = i.Username,
                FullName = i.FullName,
                Bio = i.Profile != null ? i.Profile.Bio : null,
                OfficeLocation = i.Profile != null ? i.Profile.OfficeLocation : null,
                DepartmentName = i.Department != null ? i.Department.Name : null,
                DepartmentId = i.DepartmentId,
                Courses = i.Courses.Select(c => new CourseReadDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    InstructorName = i.FullName,
                    EnrollmentCount = c.Enrollments.Count
                }).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<InstructorReadDto?> UpdateInstructorProfileAsync(string id, InstructorProfileUpdateDto dto)
    {
        var instructor = await _context.Instructors
            .Include(i => i.Profile)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (instructor == null) return null;

        if (instructor.Profile == null)
        {
            instructor.Profile = new InstructorProfile
            {
                Bio = dto.Bio,
                OfficeLocation = dto.OfficeLocation
            };
        }
        else
        {
            instructor.Profile.Bio = dto.Bio;
            instructor.Profile.OfficeLocation = dto.OfficeLocation;
        }

        await _context.SaveChangesAsync();
        return await GetInstructorByIdAsync(instructor.Id);
    }

    public async Task<InstructorReadDto?> UpdateInstructorAdminAsync(string id, InstructorUpdateAdminDto dto)
    {
        var instructor = await _context.Instructors
            .Include(i => i.Profile)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (instructor == null) return null;

        var departmentExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId);
        if (!departmentExists) throw new ArgumentException("Invalid Department ID.");

        instructor.FullName = dto.FullName;
        instructor.DepartmentId = dto.DepartmentId;

        if (instructor.Profile == null)
        {
            instructor.Profile = new InstructorProfile
            {
                Bio = dto.Bio,
                OfficeLocation = dto.OfficeLocation
            };
        }
        else
        {
            instructor.Profile.Bio = dto.Bio;
            instructor.Profile.OfficeLocation = dto.OfficeLocation;
        }

        await _context.SaveChangesAsync();
        return await GetInstructorByIdAsync(instructor.Id);
    }
}
