import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getCartCount } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-[#0f0f0f]/98 via-[#1a0a0a]/98 to-[#0f0f0f]/98 border-b border-red-900/40 sticky top-0 z-50 backdrop-blur-xl shadow-lg shadow-red-950/20">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left Section - Logo & Nav */}
          <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-2.5 group btn-animate">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-lg flex items-center justify-center group-hover:from-red-700 group-hover:via-red-800 group-hover:to-red-900 transition-all shadow-lg shadow-red-500/40 group-hover:scale-110 group-hover:shadow-red-500/60 overflow-hidden relative border border-red-500/30">
                {/* Modern Game Controller Icon */}
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform drop-shadow-lg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Controller Body - Rounded Rectangle */}
                  <path 
                    d="M18 5H6C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V7C20 5.89543 19.1046 5 18 5Z" 
                    fill="currentColor"
                    fillOpacity="0.95"
                  />
                  {/* Left Grip */}
                  <path 
                    d="M5 8C5 7.44772 5.44772 7 6 7H7C7.55228 7 8 7.44772 8 8V16C8 16.5523 7.55228 17 7 17H6C5.44772 17 5 16.5523 5 16V8Z" 
                    fill="white"
                    fillOpacity="0.3"
                  />
                  {/* Right Grip */}
                  <path 
                    d="M16 8C16 7.44772 16.4477 7 17 7H18C18.5523 7 19 7.44772 19 8V16C19 16.5523 18.5523 17 18 17H17C16.4477 17 16 16.5523 16 16V8Z" 
                    fill="white"
                    fillOpacity="0.3"
                  />
                  {/* D-Pad - Cross */}
                  <path 
                    d="M9 9.5C9.27614 9.5 9.5 9.72386 9.5 10V14C9.5 14.2761 9.27614 14.5 9 14.5C8.72386 14.5 8.5 14.2761 8.5 14V10C8.5 9.72386 8.72386 9.5 9 9.5Z" 
                    fill="white"
                    fillOpacity="0.9"
                  />
                  <path 
                    d="M7.5 11C7.5 10.7239 7.72386 10.5 8 10.5H10C10.2761 10.5 10.5 10.7239 10.5 11C10.5 11.2761 10.2761 11.5 10 11.5H8C7.72386 11.5 7.5 11.2761 7.5 11Z" 
                    fill="white"
                    fillOpacity="0.9"
                  />
                  {/* Action Buttons - Right Side */}
                  <circle 
                    cx="15.5" 
                    cy="10.5" 
                    r="1.8" 
                    fill="white"
                    fillOpacity="0.9"
                  />
                  <circle 
                    cx="15.5" 
                    cy="13.5" 
                    r="1.8" 
                    fill="white"
                    fillOpacity="0.9"
                  />
                  {/* Inner highlight for depth */}
                  <circle 
                    cx="15.5" 
                    cy="10.5" 
                    r="0.8" 
                    fill="white"
                    fillOpacity="0.4"
                  />
                  <circle 
                    cx="15.5" 
                    cy="13.5" 
                    r="0.8" 
                    fill="white"
                    fillOpacity="0.4"
                  />
                </svg>
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg blur-sm"></div>
              </div>
              <span className="text-white font-bold text-lg sm:text-xl tracking-tight hidden sm:block bg-gradient-to-r from-white via-red-200 to-red-300 bg-clip-text text-transparent group-hover:via-red-300 group-hover:to-red-400 transition-all">STORE</span>
            </Link>

            {/* Main Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                to="/library" 
                className="px-3 sm:px-4 py-2 text-gray-300 hover:text-white text-sm font-medium transition-all hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/20 rounded-lg hover:shadow-md hover:shadow-red-900/20 btn-animate"
              >
                Library
              </Link>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden lg:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-400 transition-colors">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games, genres, developers..."
                className="w-full pl-11 pr-4 py-2.5 bg-gradient-to-r from-[#1a1a1a] via-[#1f0f0f] to-[#1a1a1a] text-white placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-gradient-to-r focus:from-[#202020] focus:via-[#2a0f0f] focus:to-[#202020] transition-all border border-red-900/20 focus:border-red-600/40"
              />
            </form>
          </div>

          {/* Right Section - User & Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 text-gray-300 hover:text-white text-sm font-medium transition-all hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/20 rounded-lg hover:shadow-md hover:shadow-red-900/20 btn-animate"
            >
              <span>❤️</span>
              <span>Wishlist</span>
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative flex items-center space-x-1.5 px-3 py-2 text-gray-300 hover:text-white text-sm font-medium transition-all hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/20 rounded-lg hover:shadow-md hover:shadow-red-900/20 btn-animate"
            >
              <span className="text-lg">🛒</span>
              <span className="hidden md:inline">Cart</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg shadow-red-500/50 animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2.5 px-3 py-2 text-gray-300 hover:text-white transition-all hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/20 rounded-lg hover:shadow-md hover:shadow-red-900/20 btn-animate">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 ring-2 ring-gray-800 group-hover:ring-red-500 group-hover:scale-110 transition-all">
                    <span className="text-white text-sm font-bold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium">{user?.username}</span>
                  <span className="hidden lg:block text-gray-500 text-xs">▼</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-64 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top scale-95 group-hover:scale-100">
                  <div className="p-4 border-b border-gray-800 bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-xl">
                    <p className="text-white font-bold text-lg">{user?.username}</p>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <span>⚙️</span>
                      <span>Account Settings</span>
                    </Link>
                    <Link
                      to="/library"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <span>📚</span>
                      <span>My Library</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <span>📦</span>
                      <span>Order History</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <span>❤️</span>
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      to="/statistics"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <span>📊</span>
                      <span>Statistics</span>
                    </Link>
                    <Link
                      to="/achievements"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <span>🏆</span>
                      <span>Achievements</span>
                    </Link>
                    <Link
                      to="/compare"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <span>⚖️</span>
                      <span>Compare Games</span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-800 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs sm:text-sm font-bold rounded-lg transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 btn-animate"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu/Sidebar Toggle Button */}
            <button
              onClick={onMenuClick || (() => setMobileMenuOpen(!mobileMenuOpen))}
              className="lg:hidden text-gray-300 hover:text-white hover:scale-110 transition-all btn-animate"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen || (onMenuClick === undefined) ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Only show if no sidebar (pages without sidebar) */}
        {mobileMenuOpen && !onMenuClick && (
          <div className="lg:hidden py-4 border-t border-gray-800">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search store"
                className="w-full px-4 py-2 bg-[#2a2a2a] text-white placeholder-gray-500 rounded text-sm"
              />
            </form>
            <div className="space-y-2">
              <Link to="/library" className="block text-gray-300 hover:text-white px-3 py-2">
                My Library
              </Link>
              {!isAuthenticated && (
                <Link to="/login" className="block text-gray-300 hover:text-white px-3 py-2">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
