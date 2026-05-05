using CourseManagementSystem.DTOs;
using CourseManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseManagementSystem.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _studentService;

    public StudentsController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Instructor")]
    public async Task<IActionResult> GetStudents()
    {
        var students = await _studentService.GetAllStudentsAsync();
        return Ok(students);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Instructor,Student")]
    public async Task<IActionResult> GetStudent(string id)
    {
        var student = await _studentService.GetStudentByIdAsync(id);
        if (student == null) return NotFound();

        return Ok(student);
    }

    [HttpPost("{id}/enroll")]
    [Authorize(Roles = "Admin,Student")]
    public async Task<IActionResult> EnrollInCourse(string id, [FromBody] EnrollmentCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _studentService.EnrollStudentInCourseAsync(id, dto);
        if (result != "Success")
        {
            return BadRequest(new { Message = result });
        }

        return Ok(new { Message = "Enrolled successfully." });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStudent(string id, [FromBody] StudentUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        try
        {
            var result = await _studentService.UpdateStudentAsync(id, dto);
            if (result == null) return NotFound(new { Message = "Student not found." });
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}
