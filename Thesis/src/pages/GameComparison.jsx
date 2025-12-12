import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import { gamesAPI } from '../services/api';
import { formatPrice, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const GameComparison = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchGameById } = useGameStore();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const gameIds = searchParams.get('ids');
    if (gameIds) {
      const ids = gameIds.split(',').filter(Boolean).slice(0, 3);
      if (ids.length > 0) {
        loadGames(ids);
      }
    }
  }, [searchParams]);

  const loadGames = async (ids) => {
    setLoading(true);
    try {
      const gamePromises = ids.map(id => gamesAPI.getGameById(id));
      const gameData = await Promise.all(gamePromises);
      setGames(gameData.filter(Boolean));
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const data = await gamesAPI.searchGames(query, { page_size: 10 });
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const addGameToComparison = (game) => {
    if (games.length >= 3) {
      alert('You can compare up to 3 games at a time. Remove a game first.');
      return;
    }

    if (games.some(g => g.id === game.id)) {
      alert('This game is already in the comparison.');
      return;
    }

    const newGames = [...games, game];
    setGames(newGames);
    updateURL(newGames);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  const removeGame = (gameId) => {
    const newGames = games.filter(g => g.id !== gameId);
    setGames(newGames);
    updateURL(newGames);
  };

  const updateURL = (gameList) => {
    if (gameList.length === 0) {
      setSearchParams({});
    } else {
      const ids = gameList.map(g => g.id).join(',');
      setSearchParams({ ids });
    }
  };

  const clearComparison = () => {
    setGames([]);
    setSearchParams({});
  };

  if (loading && games.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Compare Games
          </h1>
          <p className="text-gray-400 text-lg">Compare up to 3 games side-by-side</p>
        </div>

        {/* Add Game Search */}
        {games.length < 3 && (
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                placeholder="Search games to compare..."
                className="w-full px-6 py-4 bg-[#1a1a1a] border-2 border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all text-lg"
              />
              
              {/* Search Results Dropdown */}
              {showSearch && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border-2 border-gray-800 rounded-xl overflow-hidden shadow-2xl max-h-96 overflow-y-auto">
                  {searchResults.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => addGameToComparison(game)}
                      className="w-full px-6 py-4 hover:bg-gray-800 transition-colors text-left flex items-center gap-4"
                    >
                      <img
                        src={game.background_image || 'https://via.placeholder.com/80x45'}
                        alt={game.name}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-white font-semibold">{game.name}</p>
                        {game.genres && game.genres.length > 0 && (
                          <p className="text-gray-400 text-sm">{game.genres[0].name}</p>
                        )}
                      </div>
                      <span className="text-primary-400">+ Add</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {searchQuery && searchResults.length === 0 && showSearch && (
              <p className="text-gray-500 mt-2 text-sm">No games found</p>
            )}
          </div>
        )}

        {/* Comparison Table */}
        {games.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">⚖️</div>
            <h2 className="text-3xl font-bold text-white mb-4">No Games Selected</h2>
            <p className="text-gray-400 mb-8">Search and add games above to start comparing</p>
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all"
            >
              Browse Games
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Game Cards Row */}
            <div className={`grid gap-6 ${games.length === 1 ? 'grid-cols-1' : games.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {games.map((game, index) => (
                <div key={game.id} className="bg-[#1a1a1a] rounded-xl overflow-hidden border-2 border-gray-800 relative">
                  <button
                    onClick={() => removeGame(game.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-all"
                    title="Remove from comparison"
                  >
                    ×
                  </button>
                  
                  <Link to={`/game/${game.id}`}>
                    <div className="aspect-[16/9] overflow-hidden bg-gray-900">
                      <img
                        src={game.background_image || 'https://via.placeholder.com/400x225'}
                        alt={game.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <Link to={`/game/${game.id}`}>
                      <h3 className="text-xl font-bold text-white hover:text-primary-400 transition-colors mb-2">
                        {game.name}
                      </h3>
                    </Link>
                    
                    {game.rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-yellow-400 text-xl">★</span>
                        <span className="text-white font-bold text-lg">{game.rating.toFixed(1)}</span>
                        {game.ratings_count && (
                          <span className="text-gray-400 text-sm">({game.ratings_count.toLocaleString()} ratings)</span>
                        )}
                      </div>
                    )}
                    
                    <div className="text-3xl font-black text-white mb-2">
                      {formatPrice(59.99)}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty Slots */}
              {games.length < 3 && (
                <div className="bg-[#1a1a1a] border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="text-6xl mb-4">➕</div>
                    <p className="text-gray-400">Add another game</p>
                  </div>
                </div>
              )}
            </div>

            {/* Comparison Table */}
            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border-2 border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-bold">Feature</th>
                      {games.map((game) => (
                        <th key={game.id} className="px-6 py-4 text-left">
                          <Link to={`/game/${game.id}`} className="text-white font-bold hover:text-primary-400">
                            {game.name}
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Price */}
                    <tr className="border-t border-gray-800">
                      <td className="px-6 py-4 text-gray-400 font-semibold">Price</td>
                      {games.map((game) => (
                        <td key={game.id} className="px-6 py-4 text-white font-bold text-lg">
                          {formatPrice(59.99)}
                        </td>
                      ))}
                    </tr>

                    {/* Rating */}
                    <tr className="border-t border-gray-800">
                      <td className="px-6 py-4 text-gray-400 font-semibold">Rating</td>
                      {games.map((game) => (
                        <td key={game.id} className="px-6 py-4">
                          {game.rating ? (
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-400">★</span>
                              <span className="text-white font-bold">{game.rating.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Release Date */}
                    <tr className="border-t border-gray-800">
                      <td className="px-6 py-4 text-gray-400 font-semibold">Release Date</td>
                      {games.map((game) => (
                        <td key={game.id} className="px-6 py-4 text-white">
                          {game.released ? formatDate(game.released) : 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Genres */}
                    <tr className="border-t border-gray-800">
                      <td className="px-6 py-4 text-gray-400 font-semibold">Genres</td>
                      {games.map((game) => (
                        <td key={game.id} className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {game.genres && game.genres.length > 0 ? (
                              game.genres.slice(0, 3).map((genre) => (
                                <span key={genre.id} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm">
                                  {genre.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Platforms */}
                    <tr className="border-t border-gray-800">
                      <td className="px-6 py-4 text-gray-400 font-semibold">Platforms</td>
                      {games.map((game) => (
                        <td key={game.id} className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {game.platforms && game.platforms.length > 0 ? (
                              game.platforms.slice(0, 4).map((p, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm">
                                  {p.platform.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Metacritic Score */}
                    <tr className="border-t border-gray-800">
                      <td className="px-6 py-4 text-gray-400 font-semibold">Metacritic</td>
                      {games.map((game) => (
                        <td key={game.id} className="px-6 py-4">
                          {game.metacritic ? (
                            <span className={`px-3 py-1 rounded font-bold ${
                              game.metacritic >= 75 ? 'bg-green-600 text-white' :
                              game.metacritic >= 50 ? 'bg-yellow-600 text-white' :
                              'bg-red-600 text-white'
                            }`}>
                              {game.metacritic}
                            </span>
                          ) : (
                            <span className="text-gray-500">N/A</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Developer */}
                    <tr className="border-t border-gray-800">
                      <td className="px-6 py-4 text-gray-400 font-semibold">Developer</td>
                      {games.map((game) => (
                        <td key={game.id} className="px-6 py-4 text-white">
                          {game.developers && game.developers.length > 0
                            ? game.developers.map(d => d.name).join(', ')
                            : 'N/A'}
                        </td>
                      ))}
                    </tr>

                    {/* Publisher */}
                    <tr className="border-t border-gray-800">
                      <td className="px-6 py-4 text-gray-400 font-semibold">Publisher</td>
                      {games.map((game) => (
                        <td key={game.id} className="px-6 py-4 text-white">
                          {game.publishers && game.publishers.length > 0
                            ? game.publishers.map(p => p.name).join(', ')
                            : 'N/A'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={clearComparison}
                className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 hover:text-red-300 font-bold rounded-lg transition-all"
              >
                Clear Comparison
              </button>
              <Link
                to="/"
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
              >
                Browse More Games
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Click outside to close search */}
      {showSearch && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSearch(false)}
        />
      )}
    </div>
  );
};

export default GameComparison;

