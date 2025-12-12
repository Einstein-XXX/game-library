import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/backendApi';
import useAuthStore from '../../store/useAuthStore';

const OrderManagement = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await adminAPI.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <p className="text-white">Access Denied</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#121212] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Order Management</h1>

        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#2a2a2a]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.map(order => (
                  <tr key={order.orderId} className="hover:bg-[#2a2a2a]">
                    <td className="px-6 py-4 text-white">#{order.orderId}</td>
                    <td className="px-6 py-4 text-gray-400">{order.user?.email}</td>
                    <td className="px-6 py-4 text-white">${order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'COMPLETED' ? 'bg-green-600' : 'bg-yellow-600'
                      } text-white`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;

