import { create } from 'zustand';
import { achievementAPI } from '../services/backendApi';

const useAchievementStore = create((set, get) => ({
  achievements: [],
  loading: false,
  
  fetchAchievements: async () => {
    try {
      set({ loading: true });
      const achievements = await achievementAPI.getMyAchievements();
      set({ achievements, loading: false });
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      set({ loading: false });
    }
  },
  
  checkAchievements: async () => {
    try {
      const response = await achievementAPI.checkAchievements();
      // Always refresh achievements list after checking
      await get().fetchAchievements();
      
      // Return new achievements if any, otherwise empty array
      if (response && response.newAchievements && Array.isArray(response.newAchievements)) {
        return response.newAchievements;
      }
      return [];
    } catch (error) {
      console.error('Failed to check achievements:', error);
      // Still refresh achievements in case some were unlocked
      try {
        await get().fetchAchievements();
      } catch (fetchError) {
        console.error('Failed to refresh achievements:', fetchError);
      }
      throw error; // Re-throw so the UI can handle it
    }
  },
  
  getAchievementCount: () => get().achievements.length,
  
  hasAchievement: (achievementType) => {
    return get().achievements.some(a => a.achievementType === achievementType);
  },
}));

export default useAchievementStore;

