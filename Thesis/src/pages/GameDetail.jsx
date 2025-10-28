import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGameStore from '../store/useGameStore';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { formatDate } from '../utils/formatters';
import { gamesAPI } from '../services/api';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedGame, loading, error, fetchGameById } = useGameStore();
  const { addToCart, isInCart } = useCartStore();
  const { isInLibrary, isAuthenticated } = useAuthStore();
  const [screenshots, setScreenshots] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchGameById(id);
    
    // Fetch screenshots
    gamesAPI.getGameScreenshots(id).then((data) => {
      setScreenshots(data.results || []);
    }).catch(console.error);
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(selectedGame);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#121212]">
      <ErrorMessage message={error} onRetry={() => fetchGameById(id)} />
    </div>
  );

  if (!selectedGame) return null;

  const inCart = isInCart(selectedGame.id);
  const inLibrary = isInLibrary(selectedGame.id);

  const displayImages = [
    selectedGame.background_image,
    ...(screenshots.map(s => s.image) || [])
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden bg-black">
        <img
          src={displayImages[selectedImage] || selectedGame.background_image}
          alt={selectedGame.name}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 -mt-64 relative z-10">
        {/* Image Gallery */}
        {displayImages.length > 1 && (
          <div className="mb-8">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4">
              {displayImages.slice(0, 6).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-40 h-24 rounded overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-white scale-105' 
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-500'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Rating */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white">
                {selectedGame.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6">
                {selectedGame.rating && (
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 text-2xl">★</span>
                    <div>
                      <span className="text-white text-xl font-bold">{selectedGame.rating.toFixed(1)}</span>
                      <span className="text-gray-400 text-sm ml-2">({selectedGame.ratings_count} ratings)</span>
                    </div>
                  </div>
                )}
                {selectedGame.metacritic && (
                  <div className="flex items-center space-x-2 bg-green-600 px-3 py-1 rounded">
                    <span className="text-white font-bold">{selectedGame.metacritic}</span>
                    <span className="text-white text-sm">Metacritic</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedGame.genres && selectedGame.genres.map((genre) => (
                  <span key={genre.id} className="px-3 py-1 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700 transition-colors cursor-pointer">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">About</h2>
              <div
                className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedGame.description || 'No description available.' }}
              />
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Platforms */}
              {selectedGame.platforms && selectedGame.platforms.length > 0 && (
                <div className="bg-[#1a1a1a] rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <span className="mr-2">💻</span>
                    Available on
                  </h3>
                  <div className="space-y-2">
                    {selectedGame.platforms.slice(0, 6).map((p, index) => (
                      <div key={index} className="text-gray-400 text-sm">
                        {p.platform.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Release Info */}
              <div className="bg-[#1a1a1a] rounded-lg p-6 space-y-4">
                {selectedGame.released && (
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Release Date</h3>
                    <p className="text-white font-semibold">{formatDate(selectedGame.released)}</p>
                  </div>
                )}
                {selectedGame.developers && selectedGame.developers.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Developer</h3>
                    <p className="text-white font-semibold">{selectedGame.developers.map(d => d.name).join(', ')}</p>
                  </div>
                )}
                {selectedGame.publishers && selectedGame.publishers.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Publisher</h3>
                    <p className="text-white font-semibold">{selectedGame.publishers.map(p => p.name).join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tags Section */}
            {selectedGame.tags && selectedGame.tags.length > 0 && (
              <div>
                <h3 className="text-white font-semibold text-xl mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGame.tags.slice(0, 15).map((tag) => (
                    <span key={tag.id} className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-sm hover:bg-gray-700 hover:text-white transition-colors cursor-pointer">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden sticky top-24">
              {/* Cover Image */}
              <div className="aspect-[3/4] overflow-hidden bg-gray-800">
                <img
                  src={selectedGame.background_image}
                  alt={selectedGame.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-4">
                {inLibrary ? (
                  <>
                    <div className="bg-green-600/20 border border-green-600 text-green-400 text-center py-3 rounded font-semibold">
                      ✓ In Your Library
                    </div>
                    <button
                      className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded transition-colors"
                    >
                      Play Now
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-gray-400 text-sm">Buy Now</span>
                        <div className="text-3xl font-bold text-white">
                          $59.99
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs">Includes VAT</p>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={inCart}
                      className={`w-full py-3 rounded font-semibold text-lg transition-colors ${
                        inCart
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      {inCart ? '✓ Added to Cart' : 'Add to Cart'}
                    </button>

                    {inCart && (
                      <button
                        onClick={() => navigate('/cart')}
                        className="w-full py-3 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-semibold rounded transition-colors"
                      >
                        View Cart
                      </button>
                    )}
                  </>
                )}

                {/* Additional Info */}
                <div className="pt-4 border-t border-gray-800 space-y-3 text-sm">
                  {selectedGame.esrb_rating && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating</span>
                      <span className="text-white font-medium">{selectedGame.esrb_rating.name}</span>
                    </div>
                  )}
                  {selectedGame.playtime && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Playtime</span>
                      <span className="text-white font-medium">{selectedGame.playtime} hours</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Refund Type</span>
                    <span className="text-white font-medium">Self-Service</span>
                  </div>
                </div>

                {/* Links */}
                <div className="pt-4 border-t border-gray-800 space-y-2">
                  {selectedGame.website && (
                    <a
                      href={selectedGame.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Official Website →
                    </a>
                  )}
                  {selectedGame.reddit_url && (
                    <a
                      href={selectedGame.reddit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Community →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
