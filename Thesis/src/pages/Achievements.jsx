import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useAchievementStore from '../store/useAchievementStore';
import { formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Achievements = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { achievements, loading, fetchAchievements, checkAchievements } = useAchievementStore();
  const [newAchievements, setNewAchievements] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAchievements();
  }, [isAuthenticated, navigate]);

  const checkForNewAchievements = async () => {
    try {
      setChecking(true);
      const newOnes = await checkAchievements();
      if (newOnes && newOnes.length > 0) {
        setNewAchievements(newOnes);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
        // Refresh achievements list
        await fetchAchievements();
      } else {
        // Show message that no new achievements were found
        alert('No new achievements found. Keep playing to unlock more!');
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
      alert('Failed to check for achievements. Please try again.');
    } finally {
      setChecking(false);
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

  const achievementGroups = {
    'Purchase': achievements.filter(a => a.achievementType.includes('PURCHASE') || a.achievementType.includes('SPENDER')),
    'Collection': achievements.filter(a => a.achievementType.includes('COLLECTOR')),
    'Social': achievements.filter(a => a.achievementType.includes('REVIEWER') || a.achievementType.includes('WISHLIST')),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-black text-white mb-4 bg-gradient-to-r from-white via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Achievements
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl backdrop-blur-sm">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-white font-bold text-lg">{achievements.length}</p>
                <p className="text-gray-400 text-xs">Total Achievements</p>
              </div>
            </div>
            <button
              onClick={checkForNewAchievements}
              disabled={checking}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-red-500/50"
            >
              {checking ? 'Checking...' : 'Check for New Achievements'}
            </button>
          </div>
        </div>

        {/* New Achievement Notification */}
        {showNotification && newAchievements.length > 0 && (
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-2 border-yellow-500/50 rounded-xl animate-pulse">
            <h3 className="text-2xl font-bold text-white mb-4">🎉 New Achievement Unlocked!</h3>
            <div className="space-y-2">
              {newAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-4">
                  <span className="text-4xl">{achievement.icon}</span>
                  <div>
                    <p className="text-white font-bold text-lg">{achievement.achievementName}</p>
                    <p className="text-gray-300">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Grid */}
        {achievements.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4">No Achievements Yet</h2>
            <p className="text-gray-400 mb-8">Start purchasing games, writing reviews, and building your collection to unlock achievements!</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/50"
            >
              Browse Games
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(achievementGroups).map(([category, categoryAchievements]) => (
              categoryAchievements.length > 0 && (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-white mb-6">{category} Achievements</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="bg-[#1a1a1a] border-2 border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-5xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {achievement.achievementName}
                            </h3>
                            <p className="text-gray-400 text-sm mb-3">
                              {achievement.description}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Unlocked: {formatDate(achievement.unlockedAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;

