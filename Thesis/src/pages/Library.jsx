import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { formatDate } from '../utils/formatters';

const Library = () => {
  const navigate = useNavigate();
  const { isAuthenticated, library } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold text-white mb-4">Please Login</h2>
          <p className="text-gray-400 mb-8">
            You need to be logged in to view your library.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Login
          </button>
        </div>
      </div>
    );
  }

  if (library.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-3xl font-bold text-white mb-4">Your library is empty</h2>
          <p className="text-gray-400 mb-8">
            Start building your collection by purchasing games.
          </p>
          <Link to="/" className="btn-primary">
            Browse Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Library</h1>
          <p className="text-gray-400">
            You own {library.length} {library.length === 1 ? 'game' : 'games'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {library.map((game) => (
            <Link
              key={game.id}
              to={`/game/${game.id}`}
              className="card group hover:scale-105 transition-transform duration-200"
            >
              {/* Game Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={game.background_image || 'https://via.placeholder.com/400x200'}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded text-xs font-semibold">
                  Owned
                </div>
                {game.rating && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-sm">
                    ⭐ {game.rating.toFixed(1)}
                  </div>
                )}
              </div>

              {/* Game Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 truncate">
                  {game.name}
                </h3>

                {game.genres && game.genres.length > 0 && (
                  <p className="text-sm text-gray-400 mb-2">
                    {game.genres.slice(0, 2).map(g => g.name).join(', ')}
                  </p>
                )}

                {game.purchasedAt && (
                  <p className="text-xs text-gray-500">
                    Purchased: {formatDate(game.purchasedAt)}
                  </p>
                )}

                <button className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors">
                  Play Now
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;

