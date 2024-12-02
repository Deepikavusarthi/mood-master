// apiService.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://127.0.0.1:8000/api/';
const BE_URL = process.env.REACT_APP_BE_URL || 'http://127.0.0.1:8000/';
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get token from localStorage
const getToken = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

// Helper function to set token in localStorage
const setToken = async (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

// Intercept requests to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = getToken(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token.replace(/^"|"$/g, '')}`;
    }
    return config;
  },
  (error) => {
    console.log("Error in request config:", error);
    return Promise.reject(error);
  }
);

// Intercept responses to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getToken(REFRESH_TOKEN);
        
        if (!refreshToken) {
          console.log("Refresh token not found, Please login again!");
          // You might want to redirect to login page or dispatch a logout action
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const res = await axios.post(
          `${BASE_URL}auth/token/refresh/`,
          {},
          {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshToken.replace(/^"|"$/g, '')}`
            }
          }
        );
        console.log("Refresh token response:", res.data);
        if (res.data.access_token) {
          await setToken(ACCESS_TOKEN, res.data.access_token);
          api.defaults.headers['Authorization'] = `Bearer ${res.data.access_token}`;
          return api(originalRequest);
        } else {
          throw new Error('New access token not received');
        }
      } catch (error) {
        console.log("Token refresh error:", error.message);
        
        if (error.response) {
          console.log("Error data:", error.response.data);
          console.log("Error status:", error.response.status);
          console.log("Error headers:", error.response.headers);
        } else if (error.request) {
          console.log("No response received:", error.request);
        } else {
          console.log("Error setting up request:", error.message);
        }
        
        // Redirect to login or dispatch logout action
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

const apiCall = async (method, endpoint, data = null, params = null) => {
  try {
    const config = {
      method: method,
      url: endpoint,
      params: params,
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      config.data = data;
      if (data instanceof FormData) {
        config.headers = {
          ...config.headers,
          'Content-Type': 'application/json',
        };
      }
    }

    const response = await api(config);
    
    if (response?.success || Math.floor(response.status / 100) === 2) {
      return {
        success: true,
        data: response?.data,
        status: response?.status,
      };
    }
  } catch (error) {
    throw handleApiError(error);
  }
};

const handleApiError = (error) => {
  if (error.response) {
    console.log(`API error: ${error?.response?.status} - ${JSON.stringify(error.response?.data)}`);
    console.log('Error response data:', error.response.data);
    console.log('Error response status:', error.response.status);
    console.log('Error response headers:', error.response.headers);

    return {
      success: false,
      error: {
        message: error?.response?.data?.message || error?.message || 'An error occurred',
        status: error?.response?.status,
        data: error?.response?.data,
      },
    };
  } else if (error.request) {
    console.log('API error: No response received');
    console.log('Error request:', error.request);
    throw {
      success: false,
      error: {
        message: 'No response received from server',
        isNetworkError: true,
      },
    };
  } else {
    console.log('API error:', error.message);
    throw {
      success: false,
      error: {
        message: error?.message,
      },
    };
  }
};

export { apiCall, handleApiError, BE_URL };