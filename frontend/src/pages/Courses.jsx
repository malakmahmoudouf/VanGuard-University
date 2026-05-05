import { useState, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/authService';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const user = authService.getUser();
  const isAdmin = user && user.role === 'Admin';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    instructorId: '',
    departmentId: '',
    baseEnrollmentCount: 0
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      setCourses(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }));
  };

  const openAddModal = () => {
    setFormData({ id: '', title: '', description: '', instructorId: '', departmentId: '', baseEnrollmentCount: 0 });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setFormData({
      id: course.id,
      title: course.title,
      description: course.description || '',
      instructorId: course.instructorId || '',
      departmentId: course.departmentId || '',
      baseEnrollmentCount: course.baseEnrollmentCount || 0
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/courses/${formData.id}`, formData);
      } else {
        await api.post('/courses', formData);
      }
      closeModal();
      fetchCourses();
    } catch (err) {
      alert('Failed to save course. Ensure ID is unique and fields are correct.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
      } catch (err) {
        alert('Failed to delete course.');
      }
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.departmentName && c.departmentName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div className="flex-between">
        <h2>Courses Management</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openAddModal}>Add New Course</button>
        )}
      </div>

      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search courses by title, ID, or department..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Department</th>
              <th>Instructor</th>
              <th>Base Enrollments</th>
              <th>Total Enrolled</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? "8" : "7"} style={{ textAlign: 'center' }}>No courses found.</td>
              </tr>
            ) : (
              filteredCourses.map(course => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.title}</td>
                  <td>{course.description || 'N/A'}</td>
                  <td>{course.departmentName || 'N/A'}</td>
                  <td>{course.instructorName || 'N/A'}</td>
                  <td>{course.baseEnrollmentCount}</td>
                  <td>{course.totalEnrollments}</td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn-primary" style={{ marginRight: '0.5rem' }} onClick={() => openEditModal(course)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(course.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {isModalOpen && isAdmin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Course' : 'Add New Course'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Course ID (e.g. CS101)</label>
                <input type="text" name="id" className="form-control" value={formData.id} onChange={handleChange} disabled={isEditing} required />
              </div>
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" className="form-control" value={formData.description} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Instructor ID (Optional)</label>
                <input type="text" name="instructorId" className="form-control" value={formData.instructorId} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Department ID (Optional)</label>
                <input type="text" name="departmentId" className="form-control" value={formData.departmentId} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Base Enrollment Count</label>
                <input type="number" name="baseEnrollmentCount" className="form-control" value={formData.baseEnrollmentCount} onChange={handleChange} min="0" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn" onClick={closeModal} style={{ backgroundColor: '#e2e8f0', color: '#4a5568' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
