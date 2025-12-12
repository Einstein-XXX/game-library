import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { recommendationAPI } from '../services/backendApi';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import GameCard from '../components/ui/GameCard';

const Home = () => {
  const [searchParams] = useSearchParams();
  const { games, loading, error, fetchGames, searchGames } = useGameStore();
  const { addToCart, isInCart } = useCartStore();
  const { isInLibrary, isAuthenticated } = useAuthStore();
  const [recommendations, setRecommendations] = useState([]);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const featuredGamesRef = useRef(null);
  const newArrivalsRef = useRef(null);

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      searchGames(searchQuery);
    } else {
      fetchGames(1, 40);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      recommendationAPI.getRecommendations()
        .then(data => setRecommendations(data))
        .catch(() => setRecommendations([]));
    }
  }, [isAuthenticated]);

  // Auto-cycle highlights every 5 seconds
  useEffect(() => {
    if (games && games.length > 0) {
      const interval = setInterval(() => {
        setCurrentHighlightIndex((prev) => {
          const highlightGames = games.slice(0, Math.min(5, games.length));
          return (prev + 1) % highlightGames.length;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [games]);

  const handleAddToCart = async (game, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(game);
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  };

  const scrollHorizontal = (ref, direction) => {
    if (!ref.current) return;
    const scrollAmount = 600;
    ref.current.scrollBy({ left: direction === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  };

  const nextHighlight = () => {
    const highlightGames = games?.slice(0, Math.min(5, games.length)) || [];
    setCurrentHighlightIndex((prev) => (prev + 1) % highlightGames.length);
  };

  const prevHighlight = () => {
    const highlightGames = games?.slice(0, Math.min(5, games.length)) || [];
    setCurrentHighlightIndex((prev) => (prev - 1 + highlightGames.length) % highlightGames.length);
  };

  if (loading && !games?.length) {
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

  const highlightGames = games?.slice(0, Math.min(5, games.length)) || [];
  const currentHighlight = highlightGames[currentHighlightIndex];
  const welcomeGames = games?.slice(0, 8) || [];
  const newArrivals = games?.slice(8, 16) || [];
  const highlights = games?.slice(16, 24) || [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Flowing gradient overlays with more red */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-70">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-950/18 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-red-900/15 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 via-transparent to-red-900/10"></div>
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: `
              radial-gradient(ellipse 60% 40% at 30% 20%, rgba(127, 29, 29, 0.25) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 70% 80%, rgba(153, 27, 27, 0.22) 0%, transparent 70%),
              radial-gradient(ellipse 40% 50% at 50% 50%, rgba(127, 29, 29, 0.28) 0%, transparent 80%),
              radial-gradient(ellipse 55% 45% at 10% 60%, rgba(185, 28, 28, 0.18) 0%, transparent 75%)
            `,
            animation: 'gradient-flow 20s ease infinite'
          }}
        ></div>
      </div>

      <div className="relative z-10 pt-4 sm:pt-6">
        {/* Highlights Section - Cycling with Navigation - Now at the top */}
        {currentHighlight && highlightGames.length > 0 && (
          <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8 relative group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                <span className="bg-gradient-to-r from-white via-red-400 to-red-600 bg-clip-text text-transparent">Highlights</span>
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={prevHighlight}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-900/30 to-red-800/30 hover:from-red-800/50 hover:to-red-700/50 backdrop-blur-md rounded-lg flex items-center justify-center text-white transition-all border border-red-700/40 hover:border-red-600/60 opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 btn-animate"
                  aria-label="Previous highlight"
                >
                  ←
                </button>
                <button
                  onClick={nextHighlight}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-900/30 to-red-800/30 hover:from-red-800/50 hover:to-red-700/50 backdrop-blur-md rounded-lg flex items-center justify-center text-white transition-all border border-red-700/40 hover:border-red-600/60 opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 btn-animate"
                  aria-label="Next highlight"
                >
                  →
                </button>
              </div>
            </div>
            
            <Link to={`/game/${currentHighlight.id}`} className="block group animate-fade-in">
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden border-2 border-red-900/50 hover:border-red-700/70 transition-all hover:shadow-2xl hover:shadow-red-950/50" style={{ transitionDuration: '400ms' }}>
                {/* Cycling Images with Smooth Transition */}
                {highlightGames.map((game, index) => (
                  <div
                    key={game.id}
                    className={`absolute inset-0 transition-opacity ease-in-out ${
                      index === currentHighlightIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                    style={{ transitionDuration: '1200ms' }}
                  >
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex items-end p-4 sm:p-6 md:p-10 z-20">
                      <div className="max-w-3xl">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 md:mb-5">
                          <span className="bg-gradient-to-r from-white via-red-200 to-red-300 bg-clip-text text-transparent">
                            {game.name}
                          </span>
                        </h2>
                        <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4 md:mb-5 line-clamp-2 leading-relaxed">
                          {game.description_raw || 'Experience an epic adventure in this masterpiece.'}
                        </p>
                        <div className="flex items-center gap-4">
                          {game.rating && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-red-900/40 border border-red-700/50 rounded-lg backdrop-blur-sm">
                              <span className="text-red-400 text-xl">★</span>
                              <span className="text-white font-bold text-lg">{game.rating.toFixed(1)}</span>
                            </div>
                          )}
                          <div className="px-4 py-2 bg-green-900/40 border border-green-700/50 rounded-lg backdrop-blur-sm">
                            <span className="text-green-400 font-bold text-lg">Save 10%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Link>

            {/* Indicator Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {highlightGames.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHighlightIndex(index)}
                  className={`transition-all rounded-full ${
                    index === currentHighlightIndex
                      ? 'w-8 h-2 bg-gradient-to-r from-red-600 to-red-500'
                      : 'w-2 h-2 bg-red-900/50 hover:bg-red-700/70'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Featured Games - Horizontal Scroll */}
        <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
            <span className="bg-gradient-to-r from-white via-red-400 to-red-600 bg-clip-text text-transparent">Featured Games</span>
          </h3>
          <div
            ref={featuredGamesRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            {highlights.map((game) => (
              <div key={game.id} className="flex-none w-48 sm:w-56 md:w-64">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        {isAuthenticated && recommendations.length > 0 && (
          <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
              <span className="bg-gradient-to-r from-white via-red-300 to-red-500 bg-clip-text text-transparent">
                Recommended for You
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {recommendations.slice(0, 12).map((game) => (
                <GameCard key={game.id || game.gameId} game={game} />
              ))}
            </div>
          </div>
        )}

        {/* New Arrivals - Horizontal Scroll */}
        <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              <span className="bg-gradient-to-r from-white via-red-400 to-red-600 bg-clip-text text-transparent">New arrivals</span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => scrollHorizontal(newArrivalsRef, 'prev')}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-900/30 to-red-800/30 hover:from-red-800/50 hover:to-red-700/50 backdrop-blur-md rounded-lg flex items-center justify-center text-white transition-all border border-red-700/40 hover:border-red-600/60 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 btn-animate"
                aria-label="Previous games"
              >
                ←
              </button>
              <button
                onClick={() => scrollHorizontal(newArrivalsRef, 'next')}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-900/30 to-red-800/30 hover:from-red-800/50 hover:to-red-700/50 backdrop-blur-md rounded-lg flex items-center justify-center text-white transition-all border border-red-700/40 hover:border-red-600/60 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50 btn-animate"
                aria-label="Next games"
              >
                →
              </button>
            </div>
          </div>
          <div
            ref={newArrivalsRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
          >
            {newArrivals.map((game) => (
              <div key={game.id} className="flex-none w-48 sm:w-56 md:w-64">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>

        {/* All Games Grid */}
        <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8" id="all-games-section">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
            <span className="bg-gradient-to-r from-white via-red-400 to-red-600 bg-clip-text text-transparent">
              All Games
            </span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {games?.slice(0, 24).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

        {/* Welcome Offer Banner - Moved to bottom */}
        <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <div className="bg-gradient-to-r from-red-900/40 via-red-800/30 to-red-900/40 rounded-xl p-4 sm:p-6 border border-red-800/50 backdrop-blur-sm hover:border-red-700/70 hover:shadow-xl hover:shadow-red-950/50 transition-all">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-black text-white mb-2">Don't miss your Welcome Offer!</h2>
                <p className="text-gray-300 text-sm sm:text-base mb-4">Start your game collection with these special limited-time deals up to -80%</p>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-red-600/30 border border-red-500/50 rounded-lg text-red-300 text-sm font-bold">
                    6 days left
                  </span>
                  <Link
                    to="/"
                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-red-500/50 hover:scale-105 btn-animate"
                  >
                    Browse the deals
                  </Link>
                </div>
              </div>
              
              {/* Game Carousel */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {welcomeGames.map((game) => (
                    <Link
                      key={game.id}
                      to={`/game/${game.id}`}
                      className="flex-none w-32 group"
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden border-2 border-red-900/50 bg-gradient-to-br from-red-950/50 to-black">
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
