import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { orderAPI } from '../services/backendApi';
import { formatPrice } from '../utils/formatters';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart, getCartTotal, fetchCart } = useCartStore();
  const { isAuthenticated, fetchLibrary } = useAuthStore();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await orderAPI.checkout();
      await fetchLibrary();
      await fetchCart();
      alert('Purchase successful! Games added to your library.');
      navigate('/library');
    } catch (error) {
      alert(error.response?.data?.message || 'Checkout failed. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">
            Looks like you haven't added any games to your cart yet.
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((game) => (
              <div key={game.id} className="card">
                <div className="flex gap-4 p-4">
                  {/* Game Image */}
                  <Link to={`/game/${game.id}`} className="flex-shrink-0">
                    <img
                      src={game.background_image || 'https://via.placeholder.com/150x100'}
                      alt={game.name}
                      className="w-32 h-20 object-cover rounded"
                    />
                  </Link>

                  {/* Game Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/game/${game.id}`}>
                      <h3 className="text-lg font-semibold text-white hover:text-primary-400 truncate">
                        {game.name}
                      </h3>
                    </Link>
                    
                    {game.genres && game.genres.length > 0 && (
                      <p className="text-sm text-gray-400 mt-1">
                        {game.genres.slice(0, 2).map(g => g.name).join(', ')}
                      </p>
                    )}

                    {game.platforms && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {game.platforms.slice(0, 3).map((p, index) => (
                          <span key={index} className="text-xs bg-gray-700 px-2 py-1 rounded">
                            {p.platform.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price and Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-xl font-bold text-primary-400">
                      {formatPrice()}
                    </span>
                    <button
                      onClick={() => removeFromCart(game.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Items ({cartItems.length})</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between text-white text-xl font-bold">
                      <span>Total</span>
                      <span>{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary py-3 text-lg"
                >
                  Proceed to Checkout
                </button>

                <Link to="/" className="block text-center text-primary-400 hover:text-primary-300 mt-4">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

