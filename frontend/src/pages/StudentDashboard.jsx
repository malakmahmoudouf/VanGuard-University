import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import authService from '../services/authService';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollLoading, setEnrollLoading] = useState({});
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'profile'); // profile, current, grades, catalog

  const user = authService.getUser();

  const fetchData = async () => {
    try {
      setLoading(true);
      if (user && user.id) {
        // Fetch student profile
        const studentRes = await api.get(`/students/${user.id}`);
        setStudent(studentRes.data);
        
        // Fetch all courses
        const coursesRes = await api.get('/courses');
        
        // Filter out courses the student is already enrolled in
        const enrolledCourseIds = studentRes.data.enrollments?.map(e => e.courseId) || [];
        const unEnrolledCourses = coursesRes.data.filter(c => !enrolledCourseIds.includes(c.id));
        setAvailableCourses(unEnrolledCourses);
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      setEnrollLoading(prev => ({ ...prev, [courseId]: true }));
      await api.post(`/students/${user.id}/enroll`, { courseId });
      alert('Successfully enrolled!');
      fetchData(); // Refresh everything
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll.');
    } finally {
      setEnrollLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

  if (loading) return <div className="container"><p>Loading portal...</p></div>;
  if (error) return <div className="container"><p style={{ color: 'var(--danger)' }}>{error}</p></div>;
  if (!student) return <div className="container"><p>No profile found.</p></div>;

  const currentClasses = student.enrollments?.filter(e => !e.grade) || [];
  const completedClasses = student.enrollments?.filter(e => e.grade) || [];

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Student Portal</h2>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--border-light)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </button>
        <button 
          className={`btn ${activeTab === 'current' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('current')}
        >
          Current Classes
        </button>
        <button 
          className={`btn ${activeTab === 'grades' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('grades')}
        >
          Academic Record / Grades
        </button>
        <button 
          className={`btn ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('catalog')}
        >
          Course Catalog
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="features-grid" style={{ marginBottom: '2rem' }}>
          <div className="card">
            <h3 style={{ color: 'var(--text-nav)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Personal Information</h3>
            <p><strong>Name:</strong> {student.fullName}</p>
            <p><strong>University ID:</strong> {student.username}</p>
            <p><strong>Major:</strong> {student.major}</p>
            <p><strong>College:</strong> {student.departmentName || 'N/A'}</p>
          </div>
          <div className="card" style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Academic Status</h3>
            <h1 style={{ fontSize: '3rem', color: 'var(--primary-hover)', margin: 0 }}>
              {currentClasses.length}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Active Enrollments</p>
            <h1 style={{ fontSize: '3rem', color: 'var(--primary-hover)', margin: 0, marginTop: '1rem' }}>
              {completedClasses.length}
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Completed Courses</p>
          </div>
        </div>
      )}

      {/* Current Classes Tab */}
      {activeTab === 'current' && (
        <div className="card">
          <h3 style={{ color: 'var(--text-nav)', marginBottom: '1rem' }}>My Schedule (In Progress)</h3>
          {currentClasses.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentClasses.map((enrollment, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{enrollment.courseId}</td>
                    <td>{enrollment.courseTitle}</td>
                    <td><span style={{ color: 'var(--text-muted)' }}>In Progress</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>You are not currently enrolled in any classes.</p>
          )}
        </div>
      )}

      {/* Grades Tab */}
      {activeTab === 'grades' && (
        <div className="card">
          <h3 style={{ color: 'var(--text-nav)', marginBottom: '1rem' }}>Academic Record (Completed Courses)</h3>
          {completedClasses.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Final Grade</th>
                </tr>
              </thead>
              <tbody>
                {completedClasses.map((enrollment, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{enrollment.courseId}</td>
                    <td>{enrollment.courseTitle}</td>
                    <td>
                      <span style={{ 
                        background: '#d1fae5', 
                        color: '#065f46', 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '12px', 
                        fontWeight: 'bold',
                        fontSize: '0.9rem' 
                      }}>
                        {enrollment.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>You do not have any completed courses on your record yet.</p>
          )}
        </div>
      )}

      {/* Course Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="card">
          <h3 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Course Catalog (Available for Enrollment)</h3>
          {availableCourses.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Instructor</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {availableCourses.map(course => (
                  <tr key={course.id}>
                    <td style={{ fontWeight: '600' }}>{course.id}</td>
                    <td>{course.title}</td>
                    <td>{course.departmentName || 'N/A'}</td>
                    <td>{course.instructorName || 'TBA'}</td>
                    <td>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollLoading[course.id]}
                        style={{ padding: '0.4rem 1rem' }}
                      >
                        {enrollLoading[course.id] ? 'Enrolling...' : 'Enroll Now'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No more courses available to enroll in.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
