import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const user = isAuthenticated ? authService.getUser() : null;

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand-container">
        <img src="/logo.png" alt="Vanguard University" className="navbar-logo" />
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            {user?.role === 'Admin' && (
              <>
                <Link to="/departments">Colleges</Link>
                <Link to="/courses">Courses</Link>
                <Link to="/instructors">Instructors</Link>
                <Link to="/students">Students</Link>
              </>
            )}
            
            {user?.role === 'Instructor' && (
              <>
                <Link to="/instructor-dashboard">My Dashboard</Link>
                <Link to="/students">Students</Link>
              </>
            )}

            {user?.role === 'Student' && (
              <>
                <Link to="/student-dashboard">My Portal</Link>
              </>
            )}

            <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: '1.5rem', padding: '0.4rem 1.2rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
