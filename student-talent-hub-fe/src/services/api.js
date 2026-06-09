const API_BASE_URL = 'http://127.0.0.1:8000';

export const api = {
  /**
   * Phase 2: Login API (POST /users/login)
   * MUST send data as application/x-www-form-urlencoded using URLSearchParams.
   * Keys must strictly be `username` (which holds the user's email) and `password`.
   */
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // backend expects 'username'
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed. Please check your credentials.');
    }

    const data = await response.json();
    if (data.access_token) {
      // Upon success, save the access_token to localStorage
      localStorage.setItem('access_token', data.access_token);
    }
    return data;
  },

  /**
   * Phase 2: Register API (POST /users/register)
   * Send data as standard application/json.
   */
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Registration failed.');
    }

    return await response.json();
  },

  /**
   * Phase 2: Protected Routes (All other APIs)
   * Every fetch request to a protected endpoint MUST include the Authorization header.
   * Handle 401 Unauthorized errors globally by clearing localStorage and redirecting to /login.
   */
  fetchWithAuth: async (endpoint, options = {}) => {
    const token = localStorage.getItem('access_token');
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Attach Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized globally
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      // Redirect to login page
      window.location.href = '/login';
      throw new Error('Unauthorized session. Please login again.');
    }

    return response;
  },

  /**
   * Helper utility to logout a user globally
   */
  logout: () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }
};
