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
}
