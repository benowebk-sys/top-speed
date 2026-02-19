import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Settings, Lock } from 'lucide-react';

export const Navigation = ({ onSettingsClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navigation links on public auth pages
  const isPublicPage = ['/login', '/signup', '/verify-otp'].includes(location.pathname);

  // Check if user is admin
  const ADMIN_EMAIL = 'belalmohamedyousry@gmail.com';
  const isAdmin =
    user &&
    (user.role === 'admin' ||
      (user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-black via-gray-950 to-black border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
        <Link to={user ? "/home" : "/"} className="flex items-center gap-2 hover:opacity-80 transition duration-300 group active:scale-95">
          <img 
            src="/images/logo.jpg" 
            alt="TOP SPEED Logo" 
            className="h-16 object-contain group-active:shadow-lg group-active:shadow-red-600/50 transition duration-150" 
          />
        </Link>

        {!isPublicPage && (
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/cars" 
              className="text-gray-300 hover:text-white font-medium transition duration-300 relative group"
            >
              Cars
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/service-maintenance" 
              className="text-gray-300 hover:text-white font-medium transition duration-300 relative group"
            >
              Service
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/cars-editing" 
              className="text-gray-300 hover:text-white font-medium transition duration-300 relative group"
            >
              Modifications
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="text-yellow-300 hover:text-yellow-400 font-medium transition duration-300 relative group flex items-center gap-1"
              >
                <Lock size={16} />
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-600 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </div>
        )}

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-5">
              <div className="px-4 py-1.5 rounded-lg border border-gray-700 hover:border-red-600 transition duration-300 group cursor-default">
                <span className="text-base font-semibold text-white group-hover:text-red-400 transition duration-300">
                  {user.name}
                </span>
              </div>
              <button
                onClick={onSettingsClick}
                className="text-gray-400 hover:text-white p-2.5 rounded-lg border border-transparent hover:border-gray-700 transition duration-300 flex items-center justify-center hover:bg-gray-900/50"
                title="Settings"
              >
                <Settings size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white p-2.5 rounded-lg border border-transparent hover:border-gray-700 transition duration-300 flex items-center justify-center hover:bg-gray-900/50"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};
