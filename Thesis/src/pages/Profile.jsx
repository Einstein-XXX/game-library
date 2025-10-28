import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile, library } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className="lg:col-span-2 card">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary-400 hover:text-primary-300"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Username</label>
                    <p className="text-white text-lg">{user?.username}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <p className="text-white text-lg">{user?.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Role</label>
                    <p className="text-white text-lg capitalize">{user?.role}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="space-y-6">
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-sm">Games Owned</span>
                      <span className="text-primary-400 font-bold text-xl">{library.length}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-sm">Total Spent</span>
                      <span className="text-primary-400 font-bold text-xl">
                        ${(library.length * 59.99).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-sm">Member Since</span>
                      <span className="text-white font-semibold">2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/library')}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    📚 View Library
                  </button>
                  <button
                    onClick={() => navigate('/cart')}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    🛒 View Cart
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    🎮 Browse Games
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

