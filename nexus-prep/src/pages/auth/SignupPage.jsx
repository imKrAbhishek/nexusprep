import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Loader, ArrowRight, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google'; // Added Google Hook
import { api } from '../../services/api'; // Added API

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    role: 'admin',
    targetExam: 'GATE' 
  });
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
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Check console for details.');
      console.error("Signup Error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Google Signup Flow (Same as Login, backend handles creation)
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
        setError(err.response?.data?.message || "Google registration failed on server.");
        setLoading(false);
      }
    },
    onError: () => setError("Google window closed or failed."),
  });

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black text-gray-900 font-display">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-500">
            Sign in instead
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-brand-900/5 sm:rounded-3xl sm:px-10 border border-surface-200">
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center font-medium border border-red-100">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="fullName"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  required
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
                  minLength="6"
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

            {/* Role Selection */}
            <div className="flex items-center justify-between p-3 border border-surface-200 rounded-xl bg-surface-50">
              <span className="text-sm font-bold text-gray-700">I am registering as a:</span>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                className="text-sm bg-white border border-surface-200 rounded-lg px-2 py-1 outline-none font-medium"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Exam Goal Selection */}
            {formData.role === 'student' && (
              <div className="flex items-center justify-between p-3 border border-surface-200 rounded-xl bg-surface-50">
                <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Target className="w-4 h-4 text-brand-600" /> Target Exam:
                </span>
                <select 
                  name="targetExam" 
                  value={formData.targetExam} 
                  onChange={handleChange}
                  className="text-sm bg-white border border-surface-200 rounded-lg px-2 py-1 outline-none font-medium max-w-[150px]"
                >
                  <option value="GATE">GATE</option>
                  <option value="JEE">JEE</option>
                  <option value="CAT">CAT</option>
                  <option value="Placement">Placements</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Google Signup Section */}
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