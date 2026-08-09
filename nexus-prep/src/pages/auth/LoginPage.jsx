import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { api } from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Google Login Flow
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const res = await api.post('/auth/google', {
          access_token: tokenResponse.access_token,
        });
        
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          window.location.href = '/dashboard'; 
        }
      } catch (err) {
        setError(err.response?.data?.message || "Google login failed on server.");
        setLoading(false);
      }
    },
    onError: () => setError("Google Login window closed or failed."),
  });

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black text-gray-900 font-display">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          New to NexusPrep?{' '}
          <Link to="/signup" className="font-bold text-brand-600 hover:text-brand-500">
            Create an account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-brand-900/5 sm:rounded-3xl sm:px-10 border border-surface-200">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
                  pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                  title="Please enter a valid email address"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-12 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Sign in'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Google Login Section */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              {/* 🔥 PREMIUM STYLED GOOGLE BUTTON */}
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-2.5 px-4 bg-white text-gray-700 text-sm font-bold rounded-xl border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-gray-50 hover:border-gray-300 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-all duration-200 disabled:opacity-70"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}