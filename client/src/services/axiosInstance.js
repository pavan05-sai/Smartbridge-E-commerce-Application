import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Resolves backend API URL in production, defaults to Vite local proxy in development
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token into Headers
axiosInstance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global HTTP errors (like 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid: logout user by purging state and localstorage
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cartItems');
      // Force page refresh if not on login already to clear states
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
