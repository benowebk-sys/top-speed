import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      login(response.data.token, response.data.user);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-12">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-gray-500 text-xs sm:text-sm">Access your TOP SPEED account</p>
        </div>

        {/* Form Card */}
        <div className="border border-gray-800 rounded-lg p-4 sm:p-6 md:p-8 bg-gradient-to-b from-gray-900 to-black">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white text-xs sm:text-sm font-medium mb-2 sm:mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-gray-900 border border-gray-800 rounded-lg text-white text-xs sm:text-sm placeholder-gray-600 focus:border-red-600 focus:outline-none transition-colors duration-200"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <label className="block text-white text-xs sm:text-sm font-medium">Password</label>
                <a href="#" className="text-red-600 hover:text-red-500 text-xs font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 sm:pl-12 pr-12 py-2 sm:py-3 bg-gray-900 border border-gray-800 rounded-lg text-white text-xs sm:text-sm placeholder-gray-600 focus:border-red-600 focus:outline-none transition-colors duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
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
                  Signing In
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Sign Up Link */}
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500 text-sm text-center">
                Don't have an account?{' '}
                <Link to="/" className="text-red-600 hover:text-red-500 font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-gray-600 text-xs text-center mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
