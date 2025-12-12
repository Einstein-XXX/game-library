import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import useAchievementStore from '../store/useAchievementStore';
import { orderAPI } from '../services/backendApi';
import { formatPrice } from '../utils/formatters';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart, getCartTotal, fetchCart } = useCartStore();
  const { isAuthenticated, fetchLibrary } = useAuthStore();
  const { checkAchievements } = useAchievementStore();

  // Fetch cart when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const order = await orderAPI.checkout();
      console.log('Checkout successful:', order);
      
      // Refresh library and cart
      await fetchLibrary();
      await fetchCart();
      
      // Check for new achievements
      const newAchievements = await checkAchievements();
      
      let message = `Purchase successful! ${cartItems.length} game(s) added to your library.`;
      if (newAchievements.length > 0) {
        message += `\n\n🎉 Unlocked ${newAchievements.length} achievement(s)! Check your achievements page.`;
      }
      
      alert(message);
      navigate('/library');
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Checkout failed. Please try again.';
      alert(errorMessage);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="text-8xl mb-6 animate-pulse-slow">🛒</div>
          <h2 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Your cart is empty</h2>
          <p className="text-gray-400 mb-10 text-lg">
            Looks like you haven't added any games to your cart yet.
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
          <h1 className="text-5xl font-black text-white mb-3 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <p className="text-gray-400 text-lg">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((game) => (
              <div key={game.id} className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all border border-gray-800 hover:border-gray-700">
                <div className="flex gap-6 p-5">
                  {/* Game Image */}
                  <Link to={`/game/${game.id}`} className="flex-shrink-0 group">
                    <div className="relative w-40 h-24 rounded-lg overflow-hidden">
                      <img
                        src={game.background_image || 'https://via.placeholder.com/160x96'}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </Link>

                  {/* Game Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link to={`/game/${game.id}`}>
                        <h3 className="text-xl font-bold text-white hover:text-primary-400 transition-colors line-clamp-1">
                          {game.name}
                        </h3>
                      </Link>
                      
                      {game.genres && game.genres.length > 0 && (
                        <p className="text-sm text-gray-400 mt-1">
                          {game.genres.slice(0, 2).map(g => g.name).join(' • ')}
                        </p>
                      )}

                      {game.platforms && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {game.platforms.slice(0, 3).map((p, index) => (
                            <span key={index} className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded">
                              {p.platform.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-2xl font-black text-white">
                      {formatPrice()}
                    </span>
                    <button
                      onClick={() => removeFromCart(game.id)}
                      className="px-4 py-2 text-red-400 hover:text-white hover:bg-red-600/20 rounded-lg text-sm font-semibold transition-all border border-red-600/30 hover:border-red-500"
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="px-6 py-3 text-red-400 hover:text-white hover:bg-red-600/20 rounded-lg text-sm font-semibold transition-all border border-red-600/30 hover:border-red-500"
            >
              🗑 Clear All Items
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden sticky top-24 border border-gray-800 shadow-2xl">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 border-b border-gray-700">
                <h2 className="text-2xl font-black text-white">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-300 text-lg">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Sales Tax</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between text-white text-2xl font-black">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
                        {formatPrice(getCartTotal())}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl transition-all shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105 mb-4"
                >
                  🎮 Proceed to Checkout
                </button>

                <Link 
                  to="/" 
                  className="block text-center text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                >
                  ← Continue Shopping
                </Link>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                  <p className="text-gray-500 text-xs mb-2">🔒 Secure Checkout</p>
                  <p className="text-gray-600 text-xs">Your payment information is safe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

