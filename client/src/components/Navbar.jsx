import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (!user) return [];

    if (user.role === 'admin') {
      return [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/branches', label: 'Manage Branches', icon: '🏪' },
        { path: '/sales', label: 'Sales', icon: '💰' },
        { path: '/ingredients', label: 'Ingredients', icon: '🥛' }
      ];
    } else {
      return [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/user-branches', label: 'Our Branches', icon: '🏪' },
        { path: '/sales', label: 'Sales', icon: '💰' },
        { path: '/ingredients', label: 'Ingredients', icon: '🥛' }

      ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-gradient-to-r from-yellow-500 to-pink-500 shadow-xl backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-3xl animate-wave">🍦</div>
            <h1 className="text-white text-2xl font-bold tracking-wide">
              Ice Cream Franchise
            </h1>
            {user && (
              <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded-full text-xs font-medium">
                {user.role === 'admin' ? 'Admin' : 'User'}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    location.pathname === item.path
                      ? 'bg-white bg-opacity-30 text-white shadow-lg'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'admin' ? (
                  <div className="text-white text-sm">
                    <div className="font-semibold">Welcome, Admin!</div>
                    <div className="text-xs opacity-80">Franchise Manager</div>
                    <span className="text-2xl animate-float">🍦</span>
                  </div>
                ) : (
                  <div className="text-white text-sm">
                    <div className="font-semibold">
                      Welcome, {user.username || 'User'}!
                    </div>
                    <div className="text-xs opacity-80">
                      {user.branch || 'Branch'}
                    </div>
                    <span className="text-lg animate-float">👋</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Login
              </button>
            )}

            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white border-opacity-20">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-white bg-opacity-30 text-white'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
