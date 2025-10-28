import { Link } from 'react-router-dom';
import { formatRating, formatDate, truncateText } from '../../utils/formatters';
import useCartStore from '../../store/useCartStore';
import useAuthStore from '../../store/useAuthStore';

const GameCard = ({ game }) => {
  const { addToCart, isInCart } = useCartStore();
  const { isInLibrary } = useAuthStore();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(game);
  };

  const inCart = isInCart(game.id);
  const inLibrary = isInLibrary(game.id);

  return (
    <Link to={`/game/${game.id}`} className="card group hover:scale-105 transition-transform duration-200">
      {/* Game Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={game.background_image || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {game.rating && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-sm">
            {formatRating(game.rating)}
          </div>
        )}
        {inLibrary && (
          <div className="absolute top-2 left-2 bg-green-600 px-2 py-1 rounded text-xs font-semibold">
            In Library
          </div>
        )}
      </div>

      {/* Game Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 truncate">
          {game.name}
        </h3>
        
        {/* Platforms */}
        {game.parent_platforms && (
          <div className="flex flex-wrap gap-2 mb-2">
            {game.parent_platforms.slice(0, 3).map((p, index) => (
              <span key={index} className="text-xs bg-gray-700 px-2 py-1 rounded">
                {p.platform.name}
              </span>
            ))}
          </div>
        )}

        {/* Genres */}
        {game.genres && game.genres.length > 0 && (
          <div className="text-sm text-gray-400 mb-2">
            {game.genres.slice(0, 2).map(g => g.name).join(', ')}
          </div>
        )}

        {/* Release Date */}
        {game.released && (
          <div className="text-xs text-gray-500 mb-3">
            Released: {formatDate(game.released)}
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-primary-400 font-bold text-lg">$59.99</span>
          {!inLibrary && (
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                inCart
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {inCart ? 'In Cart' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;

