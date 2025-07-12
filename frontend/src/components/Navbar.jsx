import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, Menu, X, Code2, LogOut, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import NotificationDropdown from './NotificationDropdown';
import LoginModal from './LoginModel';

export default function Navbar() {
  const { state } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const unreadCount = state.notifications.filter(n => !n.read).length;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
              <Code2 className="h-8 w-8" />
              <span className="text-xl font-bold">StackIt</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Home
              </Link>
              <Link
                to="/ask"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/ask') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                  }`}
              >
                Ask Question
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {state.user.isLoggedIn ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                    >
                      <Bell className="h-6 w-6" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {isNotificationOpen && (
                      <NotificationDropdown onClose={() => setIsNotificationOpen(false)} />
                    )}
                  </div>

                  {/* User Avatar */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={state.user.avatar}
                      alt={state.user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-700">{state.user.name}</p>
                      <p className="text-xs text-gray-500">{state.user.reputation} rep</p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </button>
              )}
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/ask"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/ask') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ask Question
                </Link>

                {/* Mobile Search */}
                <div className="px-3 py-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}