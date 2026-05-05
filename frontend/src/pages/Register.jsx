import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Student', // Default role
    fullName: '',
    major: '',
    departmentId: ''
  });
  
  const [passwordReqs, setPasswordReqs] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Custom states for the new dropdowns
  const [selectedCollege, setSelectedCollege] = useState('');
  const navigate = useNavigate();

  // Mapping Colleges to backend Department IDs
  const colleges = {
    'College of Computer Science': { id: 'D-CS', majors: ['Computer Science', 'Software Engineering', 'Artificial Intelligence'] },
    'College of Mathematics': { id: 'D-MATH', majors: ['Applied Mathematics', 'Statistics', 'Actuarial Science'] },
    'College of Engineering': { id: 'D-ENG', majors: ['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering'] }
  };

  useEffect(() => {
    // Check password requirements on change
    const p = formData.password;
    setPasswordReqs({
      length: p.length >= 6,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(p)
    });
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCollegeChange = (e) => {
    const collegeName = e.target.value;
    setSelectedCollege(collegeName);
    if (collegeName && colleges[collegeName]) {
      setFormData(prev => ({ 
        ...prev, 
        departmentId: colleges[collegeName].id,
        major: '' // Reset major when college changes
      }));
    } else {
      setFormData(prev => ({ ...prev, departmentId: '', major: '' }));
    }
  };

  const validateForm = () => {
    if (!formData.username) return "University ID is required.";
    if (formData.username.length < 3) return "University ID must be at least 3 characters.";
    
    if (!passwordReqs.length || !passwordReqs.upper || !passwordReqs.lower || !passwordReqs.number || !passwordReqs.special) {
      return "Password does not meet all requirements.";
    }

    if (formData.role !== 'Admin' && !formData.fullName) {
      return "Full Name is required.";
    }

    if (formData.role !== 'Admin' && !selectedCollege) {
      return "Please select a College / Faculty.";
    }

    if (formData.role === 'Student' && !formData.major) {
      return "Please select a Major.";
    }

    return null; // Valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await authService.register(formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      // Typically backend will return "Username already exists."
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-container">
      <div className="auth-image-side"></div>
      <div className="auth-form-side">
        <div className="auth-card" style={{ maxWidth: '500px' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '2rem' }}>Create Account</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Join Vanguard University Portal</p>
          
          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: '600', textAlign: 'center', background: '#fff5f5', padding: '0.8rem', borderRadius: '8px', border: '1px solid #feb2b2' }}>{error}</div>}
          {success && <div style={{ color: 'var(--secondary)', marginBottom: '1rem', fontWeight: '600', textAlign: 'center', background: '#fdfbf7', padding: '0.8rem', borderRadius: '8px', border: '1px solid #c5a365' }}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Account Type</label>
              <select 
                name="role" 
                className="form-control" 
                value={formData.role} 
                onChange={handleChange}
              >
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label>University ID (Username)</label>
              <input 
                type="text" 
                name="username" 
                className="form-control" 
                value={formData.username} 
                onChange={handleChange} 
                placeholder="e.g. jdoe123"
              />
            </div>
            
            <div className="form-group" style={{ position: 'relative', marginBottom: '0.5rem' }}>
              <label>Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                className="form-control" 
                value={formData.password} 
                onChange={handleChange} 
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
            
            {/* Live Password Checker */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-muted)' }}>Password Requirements:</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <li style={{ color: passwordReqs.length ? '#38a169' : '#a0aec0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{passwordReqs.length ? '✓' : '○'}</span> 6+ characters
                </li>
                <li style={{ color: passwordReqs.upper ? '#38a169' : '#a0aec0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{passwordReqs.upper ? '✓' : '○'}</span> Uppercase letter
                </li>
                <li style={{ color: passwordReqs.lower ? '#38a169' : '#a0aec0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{passwordReqs.lower ? '✓' : '○'}</span> Lowercase letter
                </li>
                <li style={{ color: passwordReqs.number ? '#38a169' : '#a0aec0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{passwordReqs.number ? '✓' : '○'}</span> Number
                </li>
                <li style={{ color: passwordReqs.special ? '#38a169' : '#a0aec0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>{passwordReqs.special ? '✓' : '○'}</span> Special character
                </li>
              </ul>
            </div>

            {(formData.role === 'Student' || formData.role === 'Instructor') && (
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  className="form-control" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  placeholder="e.g. John Doe"
                />
              </div>
            )}

            {(formData.role === 'Student' || formData.role === 'Instructor') && (
              <div className="form-group">
                <label>College / Faculty</label>
                <select 
                  className="form-control" 
                  value={selectedCollege} 
                  onChange={handleCollegeChange}
                >
                  <option value="" disabled>Select your College</option>
                  {Object.keys(colleges).map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.role === 'Student' && selectedCollege && (
              <div className="form-group">
                <label>Major</label>
                <select 
                  name="major"
                  className="form-control" 
                  value={formData.major} 
                  onChange={handleChange}
                >
                  <option value="" disabled>Select your Major</option>
                  {colleges[selectedCollege].majors.map(major => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }} disabled={loading}>
              {loading ? 'Registering...' : 'Register Now'}
            </button>
          </form>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>Already have an account? <Link to="/login" style={{ color: 'var(--secondary)', fontWeight: '600', textDecoration: 'none' }}>Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
