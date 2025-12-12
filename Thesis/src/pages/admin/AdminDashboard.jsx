import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/backendApi';
import useAuthStore from '../../store/useAuthStore';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalOrders}</p>
              </div>
              <div className="text-4xl">🛒</div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-3xl font-bold text-white mt-2">${(stats.totalOrders * 59.99).toFixed(2)}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg p-6 transition-colors"
          >
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-lg font-semibold">Manage Users</h3>
            <p className="text-sm text-gray-200 mt-1">View and manage all users</p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 transition-colors"
          >
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-lg font-semibold">Manage Orders</h3>
            <p className="text-sm text-gray-200 mt-1">View all orders and transactions</p>
          </Link>

          <Link
            to="/admin/games"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-6 transition-colors"
          >
            <div className="text-3xl mb-2">🎮</div>
            <h3 className="text-lg font-semibold">Manage Games</h3>
            <p className="text-sm text-gray-200 mt-1">Add and update games</p>
          </Link>

          <Link
            to="/admin/analytics"
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg p-6 transition-colors"
          >
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-lg font-semibold">Analytics</h3>
            <p className="text-sm text-gray-200 mt-1">View detailed reports</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

