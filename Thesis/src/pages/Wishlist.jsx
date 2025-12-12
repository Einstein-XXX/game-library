import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { wishlistItems, removeFromWishlist, fetchWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, navigate, fetchWishlist]);

  const handleAddToCart = async (game) => {
    await addToCart(game);
    alert('Game added to cart!');
  };

  if (!isAuthenticated) {
    return null;
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="text-8xl mb-6 animate-pulse-slow">❤️</div>
          <h2 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Start adding games you want to buy later!
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
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            My Wishlist
          </h1>
          <p className="text-gray-400 text-lg">{wishlistItems.length} {wishlistItems.length === 1 ? 'game' : 'games'} saved</p>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((game) => (
            <div
              key={game.id}
              className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-pink-500/20 transition-all border border-gray-800 hover:border-pink-500/50 group"
            >
              {/* Game Image */}
              <Link to={`/game/${game.id}`} className="block relative aspect-[16/9] overflow-hidden bg-gray-900">
                <img
                  src={game.background_image || game.imageUrl || 'https://via.placeholder.com/400x225'}
                  alt={game.name || game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Wishlist Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-500 px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-lg">
                  ❤️ WISHLIST
                </div>
              </Link>

              {/* Game Info */}
              <div className="p-5 space-y-3">
                <Link to={`/game/${game.id}`}>
                  <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-1">
                    {game.name || game.title}
                  </h3>
                </Link>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleAddToCart(game)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-primary-500/50 text-sm"
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(game.id)}
                    className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600 border border-red-600/50 hover:border-red-500 text-red-400 hover:text-white font-bold rounded-lg transition-all text-sm"
                    title="Remove from Wishlist"
                  >
                    ❌
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

