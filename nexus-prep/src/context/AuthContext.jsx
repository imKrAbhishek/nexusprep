import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to safely extract user data from various backend response structures
  const extractUser = (response) => {
    if (!response) return null;
    if (response?.data?.user) return response.data.user;
    if (response?.user) return response.user;
    if (response?.data) return response.data;
    return response;
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await authService.getMe();
        const validUser = extractUser(response);
        if (validUser && validUser.email) {
          
          // ADD THIS: Check for a saved avatar in local storage
          const savedAvatar = localStorage.getItem('nexus_avatar');
          if (savedAvatar) {
            validUser.avatar = savedAvatar;
          }

          setUser(validUser);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authService.login({ email, password });
    const userData = extractUser(response);
    
    // Protection against setting undefined/null state on successful API call
    if (!userData || !userData.name) {
      console.error("Backend didn't return a valid user object:", response);
    }
    
    setUser(userData);
    return userData;
  }, []);

  const signup = useCallback(async (formData) => {
    const response = await authService.signup(formData);
    const userData = extractUser(response);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout request failed, clearing local state", err);
    } finally {
      setUser(null);
    }
  }, []);

  // ADDED: updateUser function to handle state changes from the Settings page
 const updateUser = useCallback((updatedData) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updatedData };
      
      // ADD THIS: Save the avatar to local storage
      if (newUser.avatar) {
        localStorage.setItem('nexus_avatar', newUser.avatar);
      }
      
      return newUser;
    });
  }, []);

  // ADDED: Included updateUser in the exposed context values
  const value = { 
    user, 
    login, 
    signup, 
    register: signup, 
    logout, 
    updateUser, 
    isLoggedIn: !!user, 
    loading 
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}