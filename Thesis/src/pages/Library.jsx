import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { formatDate, formatPrice } from '../utils/formatters';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Library = () => {
  const navigate = useNavigate();
  const { isAuthenticated, library, fetchLibrary } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Fetch library when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchLibrary()
        .then(() => setLoading(false))
        .catch((error) => {
          console.error('Failed to fetch library:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchLibrary]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center px-4">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="text-8xl mb-6">🔒</div>
          <h2 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Please Login</h2>
          <p className="text-gray-400 mb-10 text-lg">
            You need to be logged in to view your library.
          </p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-10 py-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  if (library.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="text-8xl mb-6 animate-pulse-slow">📚</div>
          <h2 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Your library is empty</h2>
          <p className="text-gray-400 mb-10 text-lg">
            Start building your collection by purchasing games.
          </p>
          <Link 
            to="/" 
            className="inline-block px-10 py-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105"
          >
            Browse Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-10">
          <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            My Library
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-primary-600/20 to-blue-600/20 border border-primary-500/30 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">🎮</span>
              <div>
                <p className="text-white font-bold text-lg">{library.length}</p>
                <p className="text-gray-400 text-xs">Games Owned</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">💰</span>
              <div>
                <p className="text-white font-bold text-lg">{formatPrice(library.length * 59.99)}</p>
                <p className="text-gray-400 text-xs">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {library.map((game) => (
            <div
              key={game.id}
              className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/20 transition-all border border-gray-800 hover:border-emerald-500/50 group"
            >
              {/* Game Image */}
              <Link to={`/game/${game.id}`} className="block relative aspect-[16/9] overflow-hidden bg-gray-900">
                <img
                  src={game.background_image || 'https://via.placeholder.com/400x225'}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Owned Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-lg">
                  ✓ OWNED
                </div>
                
                {game.rating && (
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-bold text-sm">{game.rating.toFixed(1)}</span>
                  </div>
                )}

                {/* Play Button on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <span className="text-black text-2xl ml-1">▶</span>
                  </div>
                </div>
              </Link>

              {/* Game Info */}
              <div className="p-5 space-y-3">
                <Link to={`/game/${game.id}`}>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
                    {game.name}
                  </h3>
                </Link>

                {game.genres && game.genres.length > 0 && (
                  <p className="text-sm text-gray-400">
                    {game.genres.slice(0, 2).map(g => g.name).join(' • ')}
                  </p>
                )}

                {game.purchasedAt && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>📅</span>
                    <span>Purchased: {formatDate(game.purchasedAt)}</span>
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2.5 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-primary-500/50">
                    ▶ Play
                  </button>
                  {game.website && (
                    <a
                      href={game.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600 border border-purple-500/50 hover:border-purple-500 text-purple-300 hover:text-white font-bold rounded-lg transition-all"
                      onClick={(e) => e.stopPropagation()}
                      title="Visit Official Website"
                    >
                      🌐
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;

