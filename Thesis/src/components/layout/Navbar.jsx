import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

const Navbar = () => {
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
    <nav className="bg-[#121212] border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-[1920px] mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo & Nav */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                <span className="text-black font-bold text-lg">G</span>
              </div>
              <span className="text-white font-semibold text-lg hidden sm:block">STORE</span>
            </Link>

            {/* Main Nav Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Discover
              </Link>
              <Link 
                to="/" 
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Browse
              </Link>
              <Link 
                to="/library" 
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                News
              </Link>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search store"
                className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] text-white placeholder-gray-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </form>
          </div>

          {/* Right Section - User & Cart */}
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <Link 
              to="/library" 
              className="hidden md:block text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              Wishlist
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              <span className="hidden md:inline">Cart</span>
              <span className="md:hidden text-xl">🛒</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user?.username}</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-4 border-b border-gray-800">
                    <p className="text-white font-semibold">{user?.username}</p>
                    <p className="text-gray-500 text-xs">{user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      Account Settings
                    </Link>
                    <Link
                      to="/library"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      My Library
                    </Link>
                  </div>
                  <div className="border-t border-gray-800 py-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
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
              <Link to="/" className="block text-gray-300 hover:text-white px-3 py-2">
                Discover
              </Link>
              <Link to="/" className="block text-gray-300 hover:text-white px-3 py-2">
                Browse
              </Link>
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
