import { Link } from 'react-router-dom';
import { formatRating, formatDate } from '../../utils/formatters';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const GameCard = ({ game }) => {
  const { addToCart, isInCart } = useCartStore();
  const { isInLibrary } = useAuthStore();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(game);
    } catch (error) {
      // Error is already handled in useCartStore with alert
      console.error('Add to cart error:', error);
    }
  };

  const handleVisitWebsite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (game.website) {
      window.open(game.website, '_blank');
    }
  };

  const inCart = isInCart(game.id);
  const inLibrary = isInLibrary(game.id);

  return (
    <Link 
      to={`/game/${game.id}`} 
      className="group block bg-gradient-to-br from-[#1a1a1a] via-[#1f0f0f] to-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-red-500/30 transition-all ease-out hover:-translate-y-2 border border-red-900/20 hover:border-red-700/40 animate-scale-in"
      style={{ transitionDuration: '400ms' }}
    >
      {/* Game Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-900">
        <img
          src={game.background_image || 'https://via.placeholder.com/400x225?text=No+Image'}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-red-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ease-out" style={{ transitionDuration: '400ms' }}></div>
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {inLibrary && (
            <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded shadow-lg backdrop-blur-sm">
              ✓ OWNED
            </span>
          )}
          {game.metacritic && game.metacritic >= 80 && (
            <span className="px-2.5 py-1 bg-yellow-500 text-black text-xs font-bold rounded shadow-lg">
              {game.metacritic}
            </span>
          )}
        </div>

        {/* Rating Badge */}
        {game.rating && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-white font-semibold text-sm">{game.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform ease-out" style={{ transitionDuration: '400ms' }}>
          <div className="flex gap-1.5 sm:gap-2">
            {!inLibrary && (
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className={`flex-1 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all btn-animate ${
                  inCart
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-200 shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                {inCart ? '✓ In Cart' : 'Add to Cart'}
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/compare?ids=${game.id}`;
              }}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-600/90 backdrop-blur-sm hover:bg-purple-700 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl hover:scale-105 btn-animate"
              title="Compare Game"
            >
              ⚖️
            </button>
            {game.website && (
              <button
                onClick={handleVisitWebsite}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-sm hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl hover:shadow-red-500/50 hover:scale-105 btn-animate"
                title="Visit Official Website"
              >
                🔗
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-red-200 group-hover:to-red-300 group-hover:bg-clip-text group-hover:text-transparent">
          {game.name}
        </h3>
        
        {/* Genres */}
        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {game.genres.slice(0, 2).map((genre, index) => (
              <span key={index} className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Info */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Price</span>
            <span className="text-white font-bold text-base sm:text-lg">$59.99</span>
          </div>

          {/* Platforms Icons */}
          {game.parent_platforms && (
            <div className="flex gap-1.5 text-gray-500">
              {game.parent_platforms.slice(0, 3).map((p, i) => (
                <span key={i} className="text-sm" title={p.platform.name}>
                  {p.platform.name === 'PC' ? '💻' : 
                   p.platform.name.includes('PlayStation') ? '🎮' :
                   p.platform.name.includes('Xbox') ? '🎮' :
                   p.platform.name.includes('Nintendo') ? '🎮' : '📱'}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;

