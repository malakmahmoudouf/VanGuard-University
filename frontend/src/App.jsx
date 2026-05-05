import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Departments from './pages/Departments';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Instructors from './pages/Instructors';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/departments/*" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Departments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/*" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Instructor', 'Student']}>
                <Courses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students/*" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Instructor']}>
                <Students />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructors/*" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Instructor', 'Student']}>
                <Instructors />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructor-dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={['Instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student-dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
