import React, { useState } from 'react';
import { X, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/api';

export const SettingsPanel = ({ isOpen, onClose }) => {
  const { user, updateEmail } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (newEmail === user?.email) {
        setMessage({ type: 'info', text: 'Please enter a different email address' });
        setIsLoading(false);
        return;
      }

      const response = await authService.updateEmail(newEmail, password);
      
      updateEmail(response.data.token, response.data.user);
      setMessage({ type: 'success', text: 'Email updated successfully!' });
      setPassword('');
      setIsEditing(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewEmail(user?.email || '');
    setPassword('');
    setMessage({ type: '', text: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-gray-800 z-50 overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Settings</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Welcome Message */}
              <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 rounded-lg p-6 border border-red-600/30">
                <p className="text-white text-lg font-semibold">
                  Welcome, <span className="text-red-600">{user?.name || 'User'}</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">Manage your account settings below</p>
              </div>

              {/* Account Section */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>

                {/* Email Display */}
                <div className="mb-4">
                  <label className="text-sm text-gray-400 block mb-2">Email Address</label>
                  <div className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white">
                    {user?.email}
                  </div>
                </div>

                {/* Edit Email Section */}
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Change Email
                  </button>
                ) : (
                  <form onSubmit={handleEmailChange} className="space-y-4">
                    {/* New Email Input */}
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">New Email Address</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                        placeholder="Enter new email"
                        required
                      />
                    </div>

                    {/* Password Input */}
                    <div>
                      <label className="text-sm text-gray-400 block mb-2">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-white transition"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Message Display */}
                    {message.text && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-2 p-3 rounded-lg ${
                          message.type === 'error'
                            ? 'bg-red-900/30 border border-red-700 text-red-300'
                            : message.type === 'success'
                            ? 'bg-green-900/30 border border-green-700 text-green-300'
                            : 'bg-blue-900/30 border border-blue-700 text-blue-300'
                        }`}
                      >
                        {message.type === 'success' ? (
                          <Check size={18} />
                        ) : (
                          <AlertCircle size={18} />
                        )}
                        <span className="text-sm">{message.text}</span>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        {isLoading ? 'Updating...' : 'Update Email'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Profile Info Section */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Username</label>
                    <p className="text-white mt-1">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email Address</label>
                    <p className="text-white mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Account Type</label>
                    <p className="text-white mt-1 capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>

              {/* Other Settings Section */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Additional Settings</h3>
                <p className="text-gray-400 text-sm">More settings coming soon...</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
