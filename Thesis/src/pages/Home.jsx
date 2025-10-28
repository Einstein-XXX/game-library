import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const Home = () => {
  const [searchParams] = useSearchParams();
  const { games, loading, error, fetchGames, searchGames } = useGameStore();
  const { addToCart, isInCart } = useCartStore();
  const { isInLibrary } = useAuthStore();
  const [featuredGame, setFeaturedGame] = useState(null);

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      searchGames(searchQuery);
    } else {
      fetchGames(1, 40); // Fetch more games for multiple sections
    }
  }, [searchParams]);

  useEffect(() => {
    if (games && games.length > 0) {
      // Set first high-rated game as featured
      const featured = games.find(g => g.rating >= 4.0 && g.background_image) || games[0];
      setFeaturedGame(featured);
    }
  }, [games]);

  const handleAddToCart = (game, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(game);
  };

  if (loading && !featuredGame) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <ErrorMessage message={error} onRetry={() => fetchGames()} />
      </div>
    );
  }

  // Split games into different sections
  const newReleases = games.slice(0, 8);
  const topRated = games.filter(g => g.rating >= 4.0).slice(0, 8);
  const freeGames = games.filter(g => g.id % 3 === 0).slice(0, 8); // Mock free games
  const onSale = games.slice(8, 16);

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Hero Banner */}
      {featuredGame && (
        <div className="relative h-[600px] overflow-hidden">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <img
              src={featuredGame.background_image}
              alt={featuredGame.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
            <div className="max-w-2xl space-y-6">
              {/* Logo/Title */}
              <div className="space-y-4">
                <h1 className="text-6xl font-bold text-white tracking-tight">
                  {featuredGame.name}
                </h1>
                {featuredGame.rating && (
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 text-2xl">★</span>
                    <span className="text-white text-xl font-semibold">
                      {featuredGame.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed line-clamp-3">
                {featuredGame.description_raw || 'Experience an epic adventure in this amazing game. Unlock new content and discover thrilling gameplay.'}
              </p>

              {/* Genres */}
              {featuredGame.genres && featuredGame.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {featuredGame.genres.slice(0, 3).map((genre) => (
                    <span key={genre.id} className="px-3 py-1 bg-gray-800/80 text-gray-300 rounded text-sm">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex items-center space-x-4 pt-4">
                <Link
                  to={`/game/${featuredGame.id}`}
                  className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded transition-colors text-lg"
                >
                  View Details
                </Link>
                {!isInLibrary(featuredGame.id) && (
                  <button
                    onClick={(e) => handleAddToCart(featuredGame, e)}
                    className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-semibold rounded transition-colors text-lg"
                  >
                    {isInCart(featuredGame.id) ? 'In Cart' : 'Add to Cart'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Side Featured Cards */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 space-y-4 hidden xl:block">
            {games.slice(1, 4).map((game) => (
              <Link
                key={game.id}
                to={`/game/${game.id}`}
                className="flex items-center space-x-3 bg-gray-900/90 backdrop-blur-sm hover:bg-gray-800/90 rounded-lg p-3 transition-all group w-80"
              >
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate group-hover:text-primary-400 transition-colors">
                    {game.name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {game.rating ? `★ ${game.rating.toFixed(1)}` : 'New Release'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Game Sections */}
      <div className="max-w-[1920px] mx-auto px-8 py-12 space-y-12">
        {/* Discover Something New */}
        <GameCarousel title="Discover Something New" games={newReleases} />

        {/* Top Rated */}
        <GameCarousel title="Top Rated Games" games={topRated} />

        {/* Free Games */}
        <GameCarousel title="Free Games" games={freeGames} showFreeTag={true} />

        {/* On Sale */}
        <GameCarousel title="Special Offers" games={onSale} showDiscount={true} />
      </div>
    </div>
  );
};

// Game Carousel Component
const GameCarousel = ({ title, games, showFreeTag = false, showDiscount = false }) => {
  const { addToCart, isInCart } = useCartStore();
  const { isInLibrary } = useAuthStore();

  const handleAddToCart = (game, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(game);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <button className="text-gray-400 hover:text-white transition-colors">
          View More →
        </button>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {games.map((game) => (
            <Link
              key={game.id}
              to={`/game/${game.id}`}
              className="flex-none w-[280px] group snap-start"
            >
              {/* Game Card */}
              <div className="bg-[#1a1a1a] rounded-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-800">
                  <img
                    src={game.background_image || 'https://via.placeholder.com/280x350?text=No+Image'}
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Tags */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    {showFreeTag && (
                      <span className="px-2 py-1 bg-black/80 text-white text-xs font-semibold rounded">
                        FREE
                      </span>
                    )}
                    {showDiscount && (
                      <span className="px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded">
                        -20%
                      </span>
                    )}
                    {isInLibrary(game.id) && (
                      <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded">
                        OWNED
                      </span>
                    )}
                  </div>

                  {/* Quick Add to Cart - Shows on Hover */}
                  {!isInLibrary(game.id) && (
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleAddToCart(game, e)}
                        className={`w-full py-2 rounded font-semibold text-sm transition-colors ${
                          isInCart(game.id)
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-black hover:bg-gray-200'
                        }`}
                        disabled={isInCart(game.id)}
                      >
                        {isInCart(game.id) ? 'In Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <h3 className="text-white font-semibold truncate group-hover:text-primary-400 transition-colors">
                    {game.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {game.rating && (
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400 text-sm">★</span>
                          <span className="text-gray-400 text-sm">{game.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {showDiscount ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 line-through text-sm">$59.99</span>
                          <span className="text-white font-bold">$47.99</span>
                        </div>
                      ) : showFreeTag ? (
                        <span className="text-gray-400 text-sm">Free</span>
                      ) : (
                        <span className="text-gray-400 text-sm">$59.99</span>
                      )}
                    </div>
                  </div>

                  {/* Platforms */}
                  {game.parent_platforms && (
                    <div className="flex gap-1 text-gray-500">
                      {game.parent_platforms.slice(0, 4).map((p, i) => (
                        <span key={i} className="text-xs">
                          {p.platform.name === 'PC' ? '💻' : 
                           p.platform.name.includes('PlayStation') ? '🎮' :
                           p.platform.name.includes('Xbox') ? '🎮' :
                           p.platform.name.includes('Nintendo') ? '🎮' : '🎮'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
