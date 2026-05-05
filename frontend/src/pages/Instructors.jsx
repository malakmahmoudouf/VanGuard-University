import { useState, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/authService';

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const user = authService.getUser();
  const isAdmin = user && user.role === 'Admin';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // For Add (Registration)
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    fullName: '',
    departmentId: ''
  });

  // For Edit (Profile/Admin)
  const [profileData, setProfileData] = useState({
    fullName: '',
    departmentId: '',
    bio: '',
    officeLocation: ''
  });

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/instructors');
      setInstructors(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch instructors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingInstructor(null);
    setRegisterData({ username: '', password: '', fullName: '', departmentId: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (instructor) => {
    setEditingInstructor(instructor);
    setProfileData({ 
      fullName: instructor.fullName || '',
      departmentId: instructor.departmentId || '',
      bio: instructor.bio || '', 
      officeLocation: instructor.officeLocation || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingInstructor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInstructor) {
        // Update Details (Admin)
        await api.put(`/instructors/${editingInstructor.id}/admin`, profileData);
      } else {
        // Add new (Register)
        await authService.register({
          ...registerData,
          role: 'Instructor'
        });
      }
      closeModal();
      fetchInstructors();
    } catch (err) {
      alert('Failed to save instructor. Check constraints (e.g. password rules).');
    }
  };

  const filteredInstructors = instructors.filter(i => 
    i.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (i.departmentName && i.departmentName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div className="flex-between">
        <h2>Instructors Directory</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openAddModal}>Add New Instructor</button>
        )}
      </div>

      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search instructors by name or department..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

      {loading ? (
        <p>Loading instructors...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Office</th>
              <th>Bio</th>
              <th>Courses Taught</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? "7" : "6"} style={{ textAlign: 'center' }}>No instructors found.</td>
              </tr>
            ) : (
              filteredInstructors.map(instructor => (
                <tr key={instructor.id}>
                  <td>{instructor.id}</td>
                  <td>{instructor.fullName} ({instructor.username})</td>
                  <td>{instructor.departmentName || 'N/A'}</td>
                  <td>{instructor.officeLocation || 'N/A'}</td>
                  <td>{instructor.bio || 'N/A'}</td>
                  <td>
                    {instructor.courses && instructor.courses.length > 0 
                      ? instructor.courses.map(c => c.title).join(', ') 
                      : 'None'}
                  </td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn-primary" onClick={() => openEditModal(instructor)}>Edit Details</button>
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
            <h3>{editingInstructor ? `Edit Profile: ${editingInstructor.fullName}` : 'Register New Instructor'}</h3>
            <form onSubmit={handleSubmit}>
              {!editingInstructor ? (
                <>
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
                      style={{ paddingRight: '40px' }}
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
                        color: '#4fd1c5'
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
                    <label>Department ID (e.g. D-CS)</label>
                    <input type="text" name="departmentId" className="form-control" value={registerData.departmentId} onChange={handleRegisterChange} required />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="fullName" className="form-control" value={profileData.fullName} onChange={handleProfileChange} required />
                  </div>
                  <div className="form-group">
                    <label>Department ID (e.g. D-CS)</label>
                    <input type="text" name="departmentId" className="form-control" value={profileData.departmentId} onChange={handleProfileChange} required />
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <input type="text" name="bio" className="form-control" value={profileData.bio} onChange={handleProfileChange} />
                  </div>
                  <div className="form-group">
                    <label>Office Location</label>
                    <input type="text" name="officeLocation" className="form-control" value={profileData.officeLocation} onChange={handleProfileChange} />
                  </div>
                </>
              )}
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

export default Instructors;
