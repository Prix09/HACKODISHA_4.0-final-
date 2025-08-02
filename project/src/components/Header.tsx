import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, Bell, User, LogOut } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'My Cards', href: '/cards', icon: '💳' },
    { name: 'Authorized Users', href: '/authorized-users', icon: '👥' },
    { name: 'Transactions', href: '/transactions', icon: '📋' },
    { name: 'ATM Simulator', href: '/atm-simulator', icon: '🏧' },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <Shield className="h-8 w-8" />
            <span className="text-xl font-bold">Banker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.href
                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Profile Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{user.name}</span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700">
                <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;