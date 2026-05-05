using CourseManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace CourseManagementSystem.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // 1. Seed Admin
        if (!await context.Users.AnyAsync(u => u.Role == "Admin"))
        {
            context.Users.Add(new User
            {
                Id = "A-1",
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin"
            });
            await context.SaveChangesAsync();
        }

        // 2. Seed Departments
        if (!await context.Departments.AnyAsync())
        {
            var dept1 = new Department { Id = "D-CS", Name = "Computer Science", Description = "Computing and Programming" };
            var dept2 = new Department { Id = "D-MATH", Name = "Mathematics", Description = "Calculus, Algebra, and Statistics" };
            var dept3 = new Department { Id = "D-ENG", Name = "Engineering", Description = "Electrical and Mechanical Engineering" };
            
            context.Departments.AddRange(dept1, dept2, dept3);
            await context.SaveChangesAsync();
        }

        // 3. Seed Instructors
        if (!await context.Instructors.AnyAsync())
        {
            var ins1 = new Instructor
            {
                Id = "I-1",
                Username = "dr.smith",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123"),
                Role = "Instructor",
                FullName = "Dr. John Smith",
                DepartmentId = "D-CS"
            };

            var ins2 = new Instructor
            {
                Id = "I-2",
                Username = "prof.jones",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123"),
                Role = "Instructor",
                FullName = "Prof. Alice Jones",
                DepartmentId = "D-MATH"
            };

            context.Instructors.AddRange(ins1, ins2);
            await context.SaveChangesAsync();

            // Add Profiles
            context.InstructorProfiles.Add(new InstructorProfile { InstructorId = "I-1", Bio = "Expert in AI.", OfficeLocation = "Room 101" });
            context.InstructorProfiles.Add(new InstructorProfile { InstructorId = "I-2", Bio = "Loves Calculus.", OfficeLocation = "Room 205" });
            await context.SaveChangesAsync();
        }

        // 4. Seed Courses
        if (!await context.Courses.AnyAsync())
        {
            context.Courses.Add(new Course
            {
                Id = "CS101",
                Title = "Intro to Programming",
                Description = "Learn the basics of coding.",
                InstructorId = "I-1",
                DepartmentId = "D-CS",
                BaseEnrollmentCount = 0
            });

            context.Courses.Add(new Course
            {
                Id = "CS201",
                Title = "Data Structures",
                Description = "Advanced programming concepts.",
                InstructorId = "I-1",
                DepartmentId = "D-CS",
                BaseEnrollmentCount = 0
            });

            context.Courses.Add(new Course
            {
                Id = "MATH101",
                Title = "Calculus I",
                Description = "Limits, derivatives, integrals.",
                InstructorId = "I-2",
                DepartmentId = "D-MATH",
                BaseEnrollmentCount = 0
            });

            await context.SaveChangesAsync();
        }

        // 5. Seed Students
        if (!await context.Students.AnyAsync())
        {
            var stu1 = new Student
            {
                Id = "S-1",
                Username = "student1",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                Role = "Student",
                FullName = "Bob The Builder",
                Major = "Computer Science",
                DepartmentId = "D-CS"
            };

            var stu2 = new Student
            {
                Id = "S-2",
                Username = "student2",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                Role = "Student",
                FullName = "Dora Explorer",
                Major = "Mathematics",
                DepartmentId = "D-MATH"
            };

            context.Students.AddRange(stu1, stu2);
            await context.SaveChangesAsync();

            // 6. Seed Enrollments
            context.Enrollments.Add(new Enrollment { StudentId = "S-1", CourseId = "CS101", Grade = "A" });
            context.Enrollments.Add(new Enrollment { StudentId = "S-1", CourseId = "CS201" });
            context.Enrollments.Add(new Enrollment { StudentId = "S-2", CourseId = "MATH101", Grade = "B" });
            
            await context.SaveChangesAsync();
        }
    }
}
