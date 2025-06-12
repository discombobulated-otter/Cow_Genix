import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OtpLogin = ({url}) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(60);
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post(`${url}/auth/send-otp`, { phone });
      setSent(true);
      startCountdown();
    } catch (error) {
      console.error('OTP send error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${url}/auth/verify-otp`, { phone, otp });
      console.log('OTP verified:', res.data);
      
      // Store the token
      localStorage.setItem('token', res.data.token);
      
      // Update auth context
      await login(res.data.token);
      
      navigate("/home");
    } catch (error) {
      console.error('OTP verification error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    await sendOtp(new Event('submit'));
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">OTP Login</h2>
            <p className="text-gray-500 mb-6">Sign in using your phone number</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {!sent ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input 
                  id="phone"
                  type="tel" 
                  placeholder="Enter your phone number" 
                  required 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input 
                  id="otp"
                  type="text" 
                  placeholder="Enter the OTP sent to your phone" 
                  required 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={countdown > 0}
                  className="text-sm text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center space-y-2">
            <Link to="/login" className="block text-sm text-green-600 hover:text-green-700">
              Sign in with password
            </Link>
            <Link to="/signup" className="block text-sm text-green-600 hover:text-green-700">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpLogin;
