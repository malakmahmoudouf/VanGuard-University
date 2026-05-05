import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!authService.isAuthenticated()) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const user = authService.getUser();
    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect to home if user does not have permission
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
