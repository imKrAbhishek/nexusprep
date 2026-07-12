import { CONFIG } from '../constants/config';

const getToken   = ()  => localStorage.getItem(CONFIG.TOKEN_KEY);
const setToken   = (t) => localStorage.setItem(CONFIG.TOKEN_KEY, t);
const clearToken = ()  => localStorage.removeItem(CONFIG.TOKEN_KEY);

let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

async function request(endpoint, options = {}, retry = true) {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, config);

  // Check if this is a login or register attempt
  const isAuthAttempt = endpoint === '/auth/login' || endpoint === '/auth/register';

  // FIX: ONLY intercept 401 errors if it is NOT a login/register attempt.
  // If it is a login attempt, we want it to fail normally so the UI can show the error.
  if (response.status === 401 && retry && !isAuthAttempt) {
    
    // If the refresh token itself expired, force log out
    if (endpoint === '/auth/refresh') {
      clearToken();
      window.location.href = '/login';
      return;
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => request(endpoint, options, false));
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch(
        `${CONFIG.API_BASE_URL}/auth/refresh`,
        { method: 'POST', credentials: 'include' }
      );

      if (!refreshResponse.ok) throw new Error('Refresh failed');

      const refreshData = await refreshResponse.json();
      const newToken    = refreshData?.data?.accessToken || refreshData?.accessToken;

      if (newToken) {
        setToken(newToken);
        processQueue(null, newToken);
        return request(endpoint, options, false);
      } else {
        throw new Error('No token found in refresh response');
      }

    } catch (refreshError) {
      processQueue(refreshError, null);
      clearToken();
      window.location.href = '/login';
      return;
    } finally {
      isRefreshing = false;
    }
  }

  // Parse the backend JSON response
  const data = await response.json();

  // If the backend returned an error (like Wrong Password), throw it down to the component
  if (!response.ok) {
    const error      = new Error(data.message || 'Something went wrong');
    error.response   = data;
    error.status     = response.status;
    throw error; 
  }

  return data;
}

export const api = {
  get:    (endpoint)       => request(endpoint),
  post:   (endpoint, body) => request(endpoint, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (endpoint, body) => request(endpoint, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (endpoint, body) => request(endpoint, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (endpoint)       => request(endpoint, { method: 'DELETE' }),
};