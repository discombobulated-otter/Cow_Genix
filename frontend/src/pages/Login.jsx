import React, { useState } from 'react';
import axios from 'axios';
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = ({url}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${url}/auth/user/login`, formData, { withCredentials: true });
      console.log('Login successful:', res.data);
      
      // Store the token
      localStorage.setItem('token', res.data.token);
      
      // Update auth context
      await login(res.data.token);
      
      navigate("/home");
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="w-full p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-6">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input 
                id="email"
                name="email"
                type="email" 
                placeholder="Enter your email" 
                required 
                value={formData.email} 
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input 
                id="password"
                name="password"
                type="password" 
                placeholder="Enter your password" 
                required 
                value={formData.password} 
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button 
              className="w-full flex items-center justify-center gap-2 p-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              onClick={() => window.location.href = `${url}/auth/google`}
            >
              <FcGoogle size={20} /> Sign in with Google
            </button>

            <div className="text-center space-y-3">
              <Link to="/signup" className="block text-sm text-green-600 hover:text-green-700">
                Don't have an account? Sign up
              </Link>
              <Link to="/otp-login" className="block text-sm text-green-600 hover:text-green-700">
                Sign in with OTP
              </Link>
              <Link 
                to="/vet/signup" 
                className="block text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                Sign up as a Vet
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
