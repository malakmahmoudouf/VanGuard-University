import { useState, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/authService';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const user = authService.getUser();
  const isAdmin = user && user.role === 'Admin';
  const isInstructor = user && user.role === 'Instructor';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Custom states for the new dropdowns
  const [selectedCollege, setSelectedCollege] = useState('');

  // Mapping Colleges to backend Department IDs
  const colleges = {
    'College of Computer Science': { id: 'D-CS', majors: ['Computer Science', 'Software Engineering', 'Artificial Intelligence'] },
    'College of Mathematics': { id: 'D-MATH', majors: ['Applied Mathematics', 'Statistics', 'Actuarial Science'] },
    'College of Engineering': { id: 'D-ENG', majors: ['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering'] }
  };

  // For Add (Registration)
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    fullName: '',
    major: '',
    departmentId: ''
  });

  // For Enroll
  const [enrollData, setEnrollData] = useState({
    courseId: ''
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/students');
      setStudents(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (err) {
      console.error('Failed to fetch courses for enrollment');
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const handleCollegeChange = (e) => {
    const collegeName = e.target.value;
    setSelectedCollege(collegeName);
    if (collegeName && colleges[collegeName]) {
      setRegisterData(prev => ({ 
        ...prev, 
        departmentId: colleges[collegeName].id,
        major: '' // Reset major when college changes
      }));
    } else {
      setRegisterData(prev => ({ ...prev, departmentId: '', major: '' }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setRegisterData({ username: '', password: '', fullName: '', major: '', departmentId: '' });
    setSelectedCollege('');
    setIsModalOpen(true);
  };

  const closeAddModal = () => {
    setIsModalOpen(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register({
        ...registerData,
        role: 'Student'
      });
      closeAddModal();
      fetchStudents();
    } catch (err) {
      alert('Failed to register student. Check constraints (e.g. password rules).');
    }
  };

  const openEnrollModal = (student) => {
    setSelectedStudent(student);
    setEnrollData({ courseId: '' });
    setIsEnrollModalOpen(true);
  };

  const closeEnrollModal = () => {
    setIsEnrollModalOpen(false);
    setSelectedStudent(null);
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!enrollData.courseId) return;

    try {
      await api.post(`/students/${selectedStudent.id}/enroll`, enrollData);
      closeEnrollModal();
      fetchStudents();
      alert('Successfully enrolled!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll student.');
    }
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.major && s.major.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (s.departmentName && s.departmentName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div className="flex-between">
        <h2>Students Directory</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openAddModal}>Register New Student</button>
        )}
      </div>

      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search students by name, major, or department..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Major</th>
              <th>Department</th>
              <th>Enrolled Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No students found.</td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.fullName} ({student.username})</td>
                  <td>{student.major}</td>
                  <td>{student.departmentName || 'N/A'}</td>
                  <td>
                    {student.enrollments && student.enrollments.length > 0 
                      ? student.enrollments.map(e => e.courseTitle).join(', ') 
                      : 'None'}
                  </td>
                  <td>
                    {isAdmin && (
                      <button className="btn btn-primary" onClick={() => openEnrollModal(student)}>Enroll in Course</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Add Student Modal */}
      {isModalOpen && isAdmin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Register New Student</h3>
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" className="form-control" value={registerData.username} onChange={handleRegisterChange} required />
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Password (Min 6, 1 Upper, 1 Lower, 1 Num, 1 Spec)</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  className="form-control" 
                  value={registerData.password} 
                  onChange={handleRegisterChange} 
                  required 
                  style={{ paddingRight: '60px' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '38px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--primary)'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" className="form-control" value={registerData.fullName} onChange={handleRegisterChange} required />
              </div>

              <div className="form-group">
                <label>College / Faculty</label>
                <select 
                  className="form-control" 
                  value={selectedCollege} 
                  onChange={handleCollegeChange}
                  required
                >
                  <option value="" disabled>Select College</option>
                  {Object.keys(colleges).map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>

              {selectedCollege && (
                <div className="form-group">
                  <label>Major</label>
                  <select 
                    name="major"
                    className="form-control" 
                    value={registerData.major} 
                    onChange={handleRegisterChange}
                    required
                  >
                    <option value="" disabled>Select Major</option>
                    {colleges[selectedCollege].majors.map(major => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">Save Student</button>
                <button type="button" className="btn" onClick={closeAddModal} style={{ backgroundColor: '#e2e8f0', color: '#4a5568' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Modal */}
      {isEnrollModalOpen && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enroll {selectedStudent.fullName}</h3>
            <form onSubmit={handleEnrollSubmit}>
              <div className="form-group">
                <label>Select Course</label>
                <select 
                  name="courseId" 
                  className="form-control" 
                  value={enrollData.courseId} 
                  onChange={(e) => setEnrollData({ courseId: e.target.value })} 
                  required
                >
                  <option value="">-- Choose a course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.id})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">Enroll</button>
                <button type="button" className="btn" onClick={closeEnrollModal} style={{ backgroundColor: '#e2e8f0', color: '#4a5568' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
