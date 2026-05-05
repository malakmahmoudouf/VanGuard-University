import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(formData.username, formData.password);
      
      const user = authService.getUser();
      if (user?.role === 'Admin') navigate('/courses');
      else if (user?.role === 'Instructor') navigate('/instructor-dashboard');
      else if (user?.role === 'Student') navigate('/student-dashboard');
      else navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      <div className="auth-image-side"></div>
      <div className="auth-form-side">
        <div className="auth-card">
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '2rem' }}>Welcome Back</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to Vanguard University Portal</p>
          
          {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem', fontWeight: '600', textAlign: 'center' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>University ID (Username)</label>
              <input 
                type="text" 
                name="username" 
                className="form-control" 
                value={formData.username} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group" style={{ position: 'relative' }}>
              <label>Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                className="form-control" 
                value={formData.password} 
                onChange={handleChange} 
                required 
                style={{ paddingRight: '60px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '40px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--secondary)'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>Need an account? <Link to="/register" style={{ color: 'var(--secondary)', fontWeight: '600', textDecoration: 'none' }}>Register here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
