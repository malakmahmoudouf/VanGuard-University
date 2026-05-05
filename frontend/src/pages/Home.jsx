import { Link } from 'react-router-dom';
import authService from '../services/authService';

const Home = () => {
  const isAuthenticated = authService.isAuthenticated();
  const user = isAuthenticated ? authService.getUser() : null;

  return (
    <div className="home-container">
      <div className="hero-section">
        <img src="/logo.png" alt="Vanguard University" className="hero-logo-large" />
        
        {isAuthenticated ? (
          <>
            <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              Welcome back, {user?.fullName}!
            </h1>
            <p className="hero-subtitle" style={{ marginBottom: '3rem' }}>
              Access your personalized dashboard and academic tools below.
            </p>
            
            <div className="features-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem',
              textAlign: 'left',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              {user?.role === 'Admin' && (
                <>
                  <Link to="/departments" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Colleges</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Manage academic departments and faculties.</p>
                  </Link>
                  <Link to="/courses" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Courses</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Create and manage the university course catalog.</p>
                  </Link>
                  <Link to="/instructors" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Instructors</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Manage faculty members and assignments.</p>
                  </Link>
                  <Link to="/students" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Students</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Register new students and manage enrollments.</p>
                  </Link>
                </>
              )}

              {user?.role === 'Instructor' && (
                <>
                  <Link to="/instructor-dashboard" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>My Dashboard</h3>
                    <p style={{ color: 'var(--text-muted)' }}>View your assigned courses and schedules.</p>
                  </Link>
                  <Link to="/students" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Students Directory</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Access the student directory to view profiles.</p>
                  </Link>
                </>
              )}

              {user?.role === 'Student' && (
                <>
                  <Link to="/student-dashboard" state={{ tab: 'profile' }} className="card" style={{ textDecoration: 'none', color: 'inherit', borderLeft: '4px solid var(--secondary)' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>My Profile</h3>
                    <p style={{ color: 'var(--text-muted)' }}>View your personal details and academic status.</p>
                  </Link>
                  <Link to="/student-dashboard" state={{ tab: 'current' }} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Current Classes</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Check your in-progress schedule.</p>
                  </Link>
                  <Link to="/student-dashboard" state={{ tab: 'grades' }} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Academic Record</h3>
                    <p style={{ color: 'var(--text-muted)' }}>View your completed courses and final grades.</p>
                  </Link>
                  <Link to="/student-dashboard" state={{ tab: 'catalog' }} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Course Catalog</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Browse available courses and enroll for the semester.</p>
                  </Link>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className="hero-title">Vanguard University Portal</h1>
            <p className="hero-subtitle">
              Lead. Learn. Achieve. Access your academic records, enroll in courses, 
              and manage your university journey through our unified digital campus.
            </p>
            
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary hero-btn">Sign In</Link>
              <Link to="/register" className="btn btn-secondary hero-btn">Create Account</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
