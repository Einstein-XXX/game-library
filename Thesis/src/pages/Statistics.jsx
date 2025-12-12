import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { statsAPI, recommendationAPI } from '../services/backendApi';
import { formatPrice } from '../utils/formatters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import GameCard from '../components/ui/GameCard';

const Statistics = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      const [statsData, recData] = await Promise.all([
        statsAPI.getUserStats(),
        recommendationAPI.getRecommendations().catch(() => [])
      ]);
      setStats(statsData);
      setRecommendations(recData);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-black text-white mb-10 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Statistics Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-primary-600/20 to-blue-600/20 border border-primary-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">🎮</span>
            </div>
            <div className="text-3xl font-black text-white mb-1">{stats?.gamesOwned || 0}</div>
            <div className="text-gray-400 text-sm">Games Owned</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">💰</span>
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {formatPrice(stats?.totalSpent || 0)}
            </div>
            <div className="text-gray-400 text-sm">Total Spent</div>
          </div>

          <div className="bg-gradient-to-br from-pink-600/20 to-red-600/20 border border-pink-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">❤️</span>
            </div>
            <div className="text-3xl font-black text-white mb-1">{stats?.wishlistCount || 0}</div>
            <div className="text-gray-400 text-sm">Wishlist Items</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-4xl">⭐</span>
            </div>
            <div className="text-3xl font-black text-white mb-1">{stats?.reviewsCount || 0}</div>
            <div className="text-gray-400 text-sm">Reviews Written</div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-4">Purchase History</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Orders</span>
                <span className="text-white font-bold text-xl">{stats?.totalOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Average Order Value</span>
                <span className="text-white font-bold">
                  {stats?.totalOrders > 0
                    ? formatPrice((stats?.totalSpent || 0) / stats.totalOrders)
                    : formatPrice(0)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-4">Activity Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Games in Library</span>
                <span className="text-white font-bold">{stats?.gamesOwned || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Games in Wishlist</span>
                <span className="text-white font-bold">{stats?.wishlistCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Reviews Submitted</span>
                <span className="text-white font-bold">{stats?.reviewsCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.slice(0, 8).map((game) => (
                <GameCard key={game.id || game.gameId} game={game} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;

