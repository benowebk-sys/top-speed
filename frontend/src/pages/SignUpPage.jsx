import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, Eye, EyeOff, User } from 'lucide-react';

export const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (pwd) => {
    if (!pwd || pwd.length < 8) return 'Password must be at least 8 characters';
    // Allow any password composed of letters and numbers only (no symbols)
    if (/[^a-zA-Z0-9]/.test(pwd)) return 'Password must not contain special characters or symbols';
    return '';
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Full name is required');
      return;
    }

    if (formData.name.trim().length < 2) {
      setError('Full name must be at least 2 characters');
      return;
    }

    if (!formData.email) {
      setError('Email is required');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authService.register(formData.name, formData.email, formData.password);
      // Redirect to OTP verification page
      navigate('/verify-otp', { state: { email: formData.email, name: formData.name } });
    } catch (err) {
      const errorMessage = 
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-12">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-500 text-xs sm:text-sm">Sign up to access TOP SPEED</p>
        </div>

        {/* Form Card */}
        <div className="border border-gray-800 rounded-lg p-4 sm:p-6 md:p-8 bg-gradient-to-b from-gray-900 to-black">
          <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-2 sm:mb-3">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-gray-900 border border-gray-800 rounded-lg text-white text-xs sm:text-sm placeholder-gray-600 focus:border-red-600 focus:outline-none transition-colors duration-200"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-600 focus:border-red-600 focus:outline-none transition-colors duration-200"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-600 focus:border-red-600 focus:outline-none transition-colors duration-200"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-white text-sm font-medium mb-3">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm placeholder-gray-600 focus:border-red-600 focus:outline-none transition-colors duration-200"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-2">
              <p className="text-gray-400 text-xs font-medium">Password Requirements:</p>
              <ul className="text-gray-500 text-xs space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Minimum 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  Letters and numbers allowed (no symbols)
                </li>
              </ul>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                <p>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors duration-200 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Login Link */}
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500 text-sm text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-red-600 hover:text-red-500 font-medium transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-gray-600 text-xs text-center mt-8">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
