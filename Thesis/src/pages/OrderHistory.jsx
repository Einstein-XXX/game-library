import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { orderAPI } from '../services/backendApi';
import { formatPrice, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getMyOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load order history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a]">
        <ErrorMessage message={error} onRetry={fetchOrders} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="text-8xl mb-6 animate-pulse-slow">📦</div>
          <h2 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            No Orders Yet
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            You haven't made any purchases yet. Start building your collection!
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

  const totalSpent = orders.reduce((sum, order) => {
    return sum + (parseFloat(order.totalAmount) || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Order History
          </h1>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-primary-600/20 to-blue-600/20 border border-primary-500/30 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">📦</span>
              <div>
                <p className="text-white font-bold text-lg">{orders.length}</p>
                <p className="text-gray-400 text-xs">Total Orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">💰</span>
              <div>
                <p className="text-white font-bold text-lg">{formatPrice(totalSpent)}</p>
                <p className="text-gray-400 text-xs">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all cursor-pointer"
              onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        Order #{order.id?.substring(0, 8).toUpperCase()}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          order.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {order.createdAt ? formatDate(order.createdAt) : 'Date not available'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white mb-1">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <p className="text-gray-400 text-xs">Total</p>
                  </div>
                </div>

                {/* Order Items (Expandable) */}
                {selectedOrder?.id === order.id && order.orderItems && (
                  <div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
                    <h4 className="text-lg font-bold text-white mb-4">Order Items</h4>
                    {order.orderItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg"
                      >
                        <img
                          src={item.gameImageUrl || 'https://via.placeholder.com/80x45'}
                          alt={item.gameTitle}
                          className="w-20 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-white font-semibold">{item.gameTitle}</p>
                          <p className="text-gray-400 text-sm">Game ID: {item.gameId}</p>
                        </div>
                        <p className="text-white font-bold">{formatPrice(item.price)}</p>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Payment Method</span>
                        <span className="text-white font-semibold">
                          {order.paymentMethod || 'Credit Card'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;

