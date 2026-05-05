# VanGuard University - Course Management System

A full-stack web application for managing courses, departments, instructors, and students at VanGuard University.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Authentication](#authentication)

## Overview

VanGuard University Course Management System is a comprehensive platform designed to streamline academic operations. It enables administrators, instructors, and students to manage courses, enrollments, and academic records efficiently.

## Tech Stack

### Backend
- **Framework**: ASP.NET Core 8
- **Language**: C#
- **Database**: Entity Framework Core with SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Job Scheduling**: Hangfire

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS
- **HTTP Client**: Axios
- **State Management**: React Context

## Project Structure

```
VanGuard University/
├── backend/                      # .NET Core API
│   ├── Controllers/             # API Controllers
│   │   ├── AuthController.cs
│   │   ├── CoursesController.cs
│   │   ├── DepartmentsController.cs
│   │   ├── InstructorsController.cs
│   │   └── StudentsController.cs
│   ├── Models/                  # Entity Models
│   │   ├── User.cs
│   │   ├── Student.cs
│   │   ├── Instructor.cs
│   │   ├── Course.cs
│   │   ├── Department.cs
│   │   ├── Enrollment.cs
│   │   ├── RefreshToken.cs
│   │   └── InstructorProfile.cs
│   ├── Services/                # Business Logic
│   │   ├── AuthService.cs
│   │   ├── CourseService.cs
│   │   ├── DepartmentService.cs
│   │   ├── InstructorService.cs
│   │   └── StudentService.cs
│   ├── DTOs/                    # Data Transfer Objects
│   │   ├── AuthDTOs.cs
│   │   ├── CourseDTOs.cs
│   │   ├── DepartmentDTOs.cs
│   │   ├── InstructorDTOs.cs
│   │   └── StudentDTOs.cs
│   ├── Data/                    # Database Context & Seeding
│   │   ├── ApplicationDbContext.cs
│   │   └── DatabaseSeeder.cs
│   ├── Migrations/              # EF Core Migrations
│   ├── Program.cs               # Application Configuration
│   └── CourseManagementSystem.csproj
│
├── frontend/                     # React Application
│   ├── src/
│   │   ├── components/          # Reusable Components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/               # Page Components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Departments.jsx
│   │   │   ├── Instructors.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── InstructorDashboard.jsx
│   │   ├── services/            # API Services
│   │   │   ├── api.js           # Axios Configuration
│   │   │   └── authService.js   # Auth Service
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── Screenshots/                 # Application Screenshots
└── README.md                    # This File
```

## Backend Setup

### Prerequisites
- .NET 8 SDK
- Visual Studio or VS Code with C# extension

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Update the database:
```bash
dotnet ef database update
```

4. Run the application:
```bash
dotnet run
```

The API will be available at `https://localhost:7061` (or as configured in `launchSettings.json`)

### Configuration Files

- **appsettings.json**: Production configuration
- **appsettings.Development.json**: Development configuration with detailed logging

## Frontend Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

The application will be available at `http://localhost:5173`

## Database

### Database Technology
- **Type**: SQLite
- **ORM**: Entity Framework Core
- **Location**: `hangfire.db` in the backend directory

### Core Models

#### User (Base Entity)
- Id
- Username
- Email
- PasswordHash
- Role (Admin, Student, Instructor)

#### Student
- Id
- UserId (FK to User)
- FirstName
- LastName
- EnrollmentDate

#### Instructor
- Id
- UserId (FK to User)
- FirstName
- LastName
- HireDate
- InstructorProfile (1-to-1)

#### Course
- Id
- Title
- Description
- Credits
- DepartmentId (FK)
- InstructorId (FK)

#### Department
- Id
- Name
- Description

#### Enrollment
- Id
- StudentId (FK)
- CourseId (FK)
- EnrollmentDate
- Grade

#### RefreshToken
- Id
- UserId (FK)
- Token
- ExpiryDate

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get specific course
- `POST /api/courses` - Create course (Admin/Instructor)
- `PUT /api/courses/{id}` - Update course (Admin/Instructor)
- `DELETE /api/courses/{id}` - Delete course (Admin/Instructor)

### Department Endpoints
- `GET /api/departments` - Get all departments
- `GET /api/departments/{id}` - Get specific department
- `POST /api/departments` - Create department (Admin)
- `PUT /api/departments/{id}` - Update department (Admin)
- `DELETE /api/departments/{id}` - Delete department (Admin)

### Student Endpoints
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student details
- `POST /api/students` - Create student (Admin)
- `PUT /api/students/{id}` - Update student (Admin)
- `DELETE /api/students/{id}` - Delete student (Admin)

### Instructor Endpoints
- `GET /api/instructors` - Get all instructors
- `GET /api/instructors/{id}` - Get instructor details
- `POST /api/instructors` - Create instructor (Admin)
- `PUT /api/instructors/{id}` - Update instructor (Admin)
- `DELETE /api/instructors/{id}` - Delete instructor (Admin)

## Features

### Authentication & Authorization
- User registration and login
- JWT token-based authentication
- Role-based access control (RBAC)
- Token refresh mechanism
- Password hashing and security

### Course Management
- Create and manage courses
- Assign courses to instructors and departments
- View course details and enrollments
- Track course credits

### Department Management
- Organize courses by departments
- Manage department information
- View department courses and instructors

### Student Management
- Student enrollment in courses
- View enrolled courses
- Track grades and academic progress
- Student dashboard for viewing personal information

### Instructor Features
- Manage assigned courses
- View enrolled students
- Grade students
- Instructor dashboard

### Dashboard Features
- **Student Dashboard**: View enrolled courses, grades, and academic progress
- **Instructor Dashboard**: View assigned courses and enrolled students

## Authentication

The system uses **JWT (JSON Web Tokens)** for authentication:

1. User logs in with credentials
2. Server validates and issues JWT token
3. Client includes token in Authorization header for subsequent requests
4. Token expires after a set period
5. Client can use refresh token to get a new access token

### Token Claims
- `sub` (Subject): User ID
- `email`: User email
- `role`: User role
- `username`: Username

## Development Notes

### Running Both Frontend and Backend
1. Open two terminal windows
2. In first terminal:
```bash
cd backend && dotnet run
```
3. In second terminal:
```bash
cd frontend && npm run dev
```

### Common Issues

**CORS Issues**: Make sure the backend CORS policy allows requests from the frontend URL.

**Database Connection**: Ensure the SQLite database file has proper permissions.

**Port Conflicts**: If default ports are in use, update the configuration in:
- Backend: `launchSettings.json`
- Frontend: `vite.config.js`

## Testing the Application

1. Register a new user account
2. Login with the registered credentials
3. Navigate through different sections based on user role
4. For admin features, use an admin account (if seeded)

## Future Enhancements

- Advanced analytics and reporting
- Email notifications
- API documentation (Swagger)
- Unit and integration tests
- Docker containerization
- Payment gateway integration for fees

## License

This project is part of VanGuard University.

## Support

For issues or questions, please contact the development team.
