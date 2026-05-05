import { useState, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/authService';

const InstructorDashboard = () => {
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = authService.getUser();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (user && user.id) {
          const response = await api.get(`/instructors/${user.id}`);
          setInstructor(response.data);
        }
        setError('');
      } catch (err) {
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!instructor) return <p>No profile found.</p>;

  return (
    <div>
      <h2>Instructor Dashboard</h2>
      
      <div className="card" style={{ padding: '20px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>My Profile</h3>
        <p><strong>Name:</strong> {instructor.fullName}</p>
        <p><strong>Username:</strong> {instructor.username}</p>
        <p><strong>Department:</strong> {instructor.departmentName || 'N/A'}</p>
        <p><strong>Office Location:</strong> {instructor.officeLocation || 'Not Set'}</p>
        <p><strong>Bio:</strong> {instructor.bio || 'No bio provided'}</p>
      </div>

      <div className="card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>My Assigned Courses</h3>
        {instructor.courses && instructor.courses.length > 0 ? (
          <table style={{ width: '100%', marginTop: '10px' }}>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Enrollments</th>
              </tr>
            </thead>
            <tbody>
              {instructor.courses.map(course => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>{course.enrollmentCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You have no courses assigned to you at this time.</p>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
