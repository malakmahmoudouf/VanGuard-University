using CourseManagementSystem.DTOs;
using CourseManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseManagementSystem.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentService _departmentService;

    public DepartmentsController(IDepartmentService departmentService)
    {
        _departmentService = departmentService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetDepartments()
    {
        var departments = await _departmentService.GetAllDepartmentsAsync();
        return Ok(departments);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDepartment(string id)
    {
        var department = await _departmentService.GetDepartmentByIdAsync(id);
        if (department == null) return NotFound();

        return Ok(department);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateDepartment([FromBody] DepartmentCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _departmentService.CreateDepartmentAsync(dto);
        if (result == null) return BadRequest(new { Message = "Department ID already exists." });

        return CreatedAtAction(nameof(GetDepartment), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateDepartment(string id, [FromBody] DepartmentUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _departmentService.UpdateDepartmentAsync(id, dto);
        if (result == null) return NotFound();

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteDepartment(string id)
    {
        var success = await _departmentService.DeleteDepartmentAsync(id);
        if (!success) return NotFound();

        return NoContent();
    }
}
