import { api } from './api';
import { CONFIG } from '../constants/config';

export const authService = {
  login: async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    
    const token = res?.data?.token || res?.data?.accessToken || res?.accessToken || res?.token;
    const user = res?.data?.data?.user || res?.data?.user || res?.user;

    if (token) {
      localStorage.setItem(CONFIG.TOKEN_KEY, token);
    }
    return { user };
  },

  signup: async (formData) => {
    const payload = {
      fullName:   formData.fullName, 
      email:      formData.email,
      password:   formData.password,
      role:       formData.role,
      targetExam: formData.targetExam || 'GATE',
    };
    
    try {
      const res = await api.post('/auth/register', payload);
      
      const token = res?.data?.token || res?.data?.accessToken || res?.accessToken || res?.token;
      const user = res?.data?.data?.user || res?.data?.user || res?.user;

      if (token) {
        localStorage.setItem(CONFIG.TOKEN_KEY, token);
      }
      return { user };
    } catch (error) {
      console.error("Signup API Error:", error.response?.data);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Clear local state regardless of server response
    } finally {
      localStorage.removeItem(CONFIG.TOKEN_KEY);
    }
  },

  getMe: async () => {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    if (!token) return null;
    
    const res = await api.get('/auth/me');
    return res?.data?.data?.user || res?.data?.user || res?.user;
  },
};