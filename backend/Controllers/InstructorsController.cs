using CourseManagementSystem.DTOs;
using CourseManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CourseManagementSystem.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class InstructorsController : ControllerBase
{
    private readonly IInstructorService _instructorService;

    public InstructorsController(IInstructorService instructorService)
    {
        _instructorService = instructorService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetInstructors()
    {
        var instructors = await _instructorService.GetAllInstructorsAsync();
        return Ok(instructors);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetInstructor(string id)
    {
        var instructor = await _instructorService.GetInstructorByIdAsync(id);
        if (instructor == null) return NotFound();

        return Ok(instructor);
    }

    [HttpPut("{id}/profile")]
    [Authorize(Roles = "Admin,Instructor")]
    public async Task<IActionResult> UpdateProfile(string id, [FromBody] InstructorProfileUpdateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var result = await _instructorService.UpdateInstructorProfileAsync(id, dto);
        if (result == null) return NotFound();

        return Ok(result);
    }
}
