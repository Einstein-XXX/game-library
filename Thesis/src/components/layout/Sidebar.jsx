import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

const Sidebar = ({ onLinkClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { getCartCount } = useCartStore();

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  const handleSearchClick = () => {
    // Navigate to home if not already there
    if (location.pathname !== '/') {
      navigate('/');
    }
    // Focus the search input in navbar
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="Search"]');
      if (searchInput) {
        searchInput.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAllGamesClick = (e) => {
    e.preventDefault();
    // Navigate to home if not already there
    if (location.pathname !== '/') {
      navigate('/', { replace: false });
      // Wait for navigation, then scroll
      setTimeout(() => {
        scrollToAllGames();
      }, 300);
    } else {
      scrollToAllGames();
    }
  };

  const scrollToAllGames = () => {
    setTimeout(() => {
      const allGamesSection = document.getElementById('all-games-section');
      if (allGamesSection) {
        // Calculate offset to account for navbar (56px = 14 * 4 = h-14)
        const navbarHeight = 56;
        const elementPosition = allGamesSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll to bottom
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <aside className="w-72 sm:w-64 bg-gradient-to-b from-[#151515] via-[#1a0a0a] to-[#151515] border-r border-red-900/40 min-h-[calc(100vh-3.5rem)] fixed left-0 top-14 overflow-y-auto scrollbar-hide z-40 lg:z-20 shadow-2xl shadow-red-950/30">
      <div className="p-4 space-y-6">
        {/* GAME STORE Section */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3">GAME STORE</h3>
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all btn-animate ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-red-600/30 to-red-700/20 text-red-400 border-l-2 border-red-600 shadow-md shadow-red-900/30' 
                  : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/10 hover:shadow-md hover:shadow-red-900/20'
              }`}
            >
              <span>🏠</span>
              <span>Home</span>
            </Link>
            <button
              onClick={(e) => {
                handleAllGamesClick(e);
                handleLinkClick();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/10 hover:shadow-md hover:shadow-red-900/20 transition-all text-left btn-animate"
            >
              <span>🎮</span>
              <span>All games</span>
            </button>
            <Link
              to="/wishlist"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/10 hover:shadow-md hover:shadow-red-900/20 transition-all btn-animate"
            >
              <span>❤️</span>
              <span>Wishlist</span>
              <span className="ml-auto text-xs text-gray-500">0</span>
            </Link>
            <Link
              to="/cart"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/10 hover:shadow-md hover:shadow-red-900/20 transition-all btn-animate"
            >
              <span>🛒</span>
              <span>Cart</span>
              {getCartCount() > 0 && (
                <span className="ml-auto px-2 py-0.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full font-bold shadow-md shadow-red-500/50 animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>
            <Link
              to="/orders"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/10 hover:shadow-md hover:shadow-red-900/20 transition-all btn-animate"
            >
              <span>📋</span>
              <span>Orders history</span>
            </Link>
          </nav>
        </div>

        {/* GAMES Section */}
        {isAuthenticated && (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3">GAMES</h3>
            <nav className="space-y-1">
              <Link
                to="/library"
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all btn-animate ${
                  isActive('/library') 
                    ? 'bg-gradient-to-r from-red-600/30 to-red-700/20 text-red-400 border-l-2 border-red-600 shadow-md shadow-red-900/30' 
                    : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/10 hover:shadow-md hover:shadow-red-900/20'
                }`}
              >
                <span>📚</span>
                <span>Owned games</span>
                <span className="ml-auto text-xs text-gray-500">0</span>
              </Link>
            </nav>
          </div>
        )}

        {/* DISCOVER Section */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-3">DISCOVER</h3>
          <nav className="space-y-1">
            <button
              onClick={() => {
                handleSearchClick();
                handleLinkClick();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/10 hover:shadow-md hover:shadow-red-900/20 transition-all text-left btn-animate"
            >
              <span>🔍</span>
              <span>Search</span>
            </button>
            <Link
              to="/statistics"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/10 hover:shadow-md hover:shadow-red-900/20 transition-all btn-animate"
            >
              <span>📊</span>
              <span>Statistics</span>
            </Link>
            <Link
              to="/compare"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all btn-animate ${
                isActive('/compare') 
                  ? 'bg-gradient-to-r from-red-600/30 to-red-700/20 text-red-400 border-l-2 border-red-600 shadow-md shadow-red-900/30' 
                  : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/10 hover:shadow-md hover:shadow-red-900/20'
              }`}
            >
              <span>⚖️</span>
              <span>Compare Games</span>
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

