import { useState, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/authService';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const user = authService.getUser();
  const isAdmin = user && user.role === 'Admin';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/departments');
      setDepartments(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch departments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ id: '', name: '', description: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setFormData({ id: dept.id, name: dept.name, description: dept.description || '' });
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
        await api.put(`/departments/${formData.id}`, formData);
      } else {
        await api.post('/departments', formData);
      }
      closeModal();
      fetchDepartments();
    } catch (err) {
      alert('Failed to save department. Ensure ID is unique.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/departments/${id}`);
        fetchDepartments();
      } catch (err) {
        alert('Failed to delete department. It might be in use.');
      }
    }
  };

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex-between">
        <h2>Colleges / Departments Management</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openAddModal}>Add New College</button>
        )}
      </div>

      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search colleges by name or ID..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? "4" : "3"} style={{ textAlign: 'center' }}>No colleges found.</td>
              </tr>
            ) : (
              filteredDepartments.map(dept => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>
                  <td>{dept.name}</td>
                  <td>{dept.description || 'N/A'}</td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn-primary" style={{ marginRight: '0.5rem' }} onClick={() => openEditModal(dept)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(dept.id)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {isModalOpen && isAdmin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit College' : 'Add New College'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>College ID (e.g. D-ENG)</label>
                <input type="text" name="id" className="form-control" value={formData.id} onChange={handleChange} disabled={isEditing} required />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" name="description" className="form-control" value={formData.description} onChange={handleChange} />
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

export default Departments;
