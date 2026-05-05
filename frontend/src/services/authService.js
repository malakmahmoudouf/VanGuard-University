import api from './api';
import Cookies from 'js-cookie';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data && response.data.token) {
      // Store token in cookie
      Cookies.set('token', response.data.token, { expires: 1 }); // expires in 1 day
      if (response.data.refreshToken) {
        Cookies.set('refreshToken', response.data.refreshToken, { expires: 7 });
      }
    }
    return response.data;
  },

  register: async (userData) => {
    // userData could contain username, password, fullName, role, major
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!Cookies.get('token');
  },

  getUser: () => {
    const token = Cookies.get('token');
    if (!token) return null;
    const decoded = parseJwt(token);
    if (!decoded) return null;
    return {
      role: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.role,
      id: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.nameid || decoded.id,
      username: decoded.sub || decoded.username,
      fullName: decoded.FullName || decoded.fullname || decoded.sub
    };
  }
};

export default authService;
