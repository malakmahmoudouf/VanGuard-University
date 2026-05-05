using CourseManagementSystem.Data;
using CourseManagementSystem.DTOs;
using CourseManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagementSystem.Services;

public class DepartmentService : IDepartmentService
{
    private readonly ApplicationDbContext _context;

    public DepartmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<DepartmentReadDto>> GetAllDepartmentsAsync()
    {
        return await _context.Departments
            .AsNoTracking()
            .Select(d => new DepartmentReadDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description
            })
            .ToListAsync();
    }

    public async Task<DepartmentReadDto?> GetDepartmentByIdAsync(string id)
    {
        return await _context.Departments
            .AsNoTracking()
            .Where(d => d.Id == id)
            .Select(d => new DepartmentReadDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description
            })
            .FirstOrDefaultAsync();
    }

    public async Task<DepartmentReadDto?> CreateDepartmentAsync(DepartmentCreateDto dto)
    {
        if (await _context.Departments.AnyAsync(d => d.Id == dto.Id)) return null;

        var department = new Department
        {
            Id = dto.Id,
            Name = dto.Name,
            Description = dto.Description
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        return await GetDepartmentByIdAsync(department.Id);
    }

    public async Task<DepartmentReadDto?> UpdateDepartmentAsync(string id, DepartmentUpdateDto dto)
    {
        var department = await _context.Departments.FirstOrDefaultAsync(d => d.Id == id);
        if (department == null) return null;

        department.Name = dto.Name;
        department.Description = dto.Description;

        await _context.SaveChangesAsync();

        return await GetDepartmentByIdAsync(department.Id);
    }

    public async Task<bool> DeleteDepartmentAsync(string id)
    {
        var department = await _context.Departments.FirstOrDefaultAsync(d => d.Id == id);
        if (department == null) return false;

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
        return true;
    }
}
