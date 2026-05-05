# Course Management System API

This is a Web Engineering assignment implementing a Course Management System API using ASP.NET Core and Entity Framework Core.

## Technologies Used
- **ASP.NET Core Web API (.NET 8):** The base framework for building the RESTful API.
- **Entity Framework Core (SQLite):** An ORM used for data access, allowing us to work with a database using .NET objects. SQLite is used as the lightweight local database.
- **JWT (JSON Web Tokens):** Used for stateless authentication. Ensures secure endpoints via Bearer tokens.
- **Hangfire:** A background job processing library, used here (as a bonus) to securely run periodic cleanup tasks for expired refresh tokens.
- **BCrypt.Net-Next:** A hashing library used to securely encrypt user passwords in the database.
- **Swagger (Swashbuckle):** Used for documenting and testing the API endpoints seamlessly from the browser.

## Why HTTP-only Cookies?
While this API utilizes JWT Bearer tokens for flexibility and demonstration of stateless API architectures, an alternative and highly secure industry standard for web applications is **HTTP-only cookies**. 

HTTP-only cookies are commonly used because:
1. **Mitigation of XSS (Cross-Site Scripting):** When an auth cookie is marked as `HttpOnly`, it cannot be accessed or read by client-side Javascript. Even if a malicious script runs on the page, it cannot steal the token.
2. **Automatic Inclusion:** The browser automatically attaches cookies to related requests, simplifying client code and ensuring the authentication state is seamlessly managed.
3. **Secure Flag Integration:** Pairing `HttpOnly` with the `Secure` flag guarantees the token is only sent over encrypted HTTPS connections, further preventing middle-man credential theft.

## How to Run the Project
1. **Prerequisites**: Ensure you have the [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) installed on your machine.
2. **Database Setup**: The project uses SQLite. The initial migration is provided. The database will automatically be generated in `course.db` when you apply migrations.
   - Run the command: `dotnet ef database update`
3. **Run the API**:
   - Navigate to the `CourseManagementSystem` directory in your terminal.
   - Execute: `dotnet run`
4. **Testing through Swagger**:
   - Open your browser and navigate to `http://localhost:<port>/swagger` (or click the URL from terminal).
   - Use the `/api/Auth/register` endpoint to create a new user (with role `Admin`, `Instructor`, or `Student`).
   - Use the `/api/Auth/login` endpoint to obtain a JWT token.
   - In Swagger, click the **"Authorize"** button at the top, type `Bearer <your-token>`, and click Authorize.
   - You can now test protected endpoints such as `/api/Courses` or `/api/Students`.

## Bonus Features Implemented
- ✅ Refresh Tokens for Authentication (Endpoints `/api/auth/refresh`)
- ✅ Hangfire Background cron job (Cleans up expired tokens daily)
