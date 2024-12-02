import { apiCall } from './ApiClient';

// User Services
export const UserService = {
  async createUser(userData) {
    try {
      const response = await apiCall('POST', '/users/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await apiCall('POST', '/login/', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserProfile() {
    try {
      const response = await apiCall('GET', '/users/me/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUserProfile(userData) {
    try {
      const response = await apiCall('PATCH', '/users/me/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteUser() {
    try {
      const response = await apiCall('DELETE', '/users/me/');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Custom Activity Services
export const CustomActivityService = {
  async getCustomActivities() {
    try {
      const response = await apiCall('GET', '/users/custom_activity/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createCustomActivity(activityData) {
    try {
      const response = await apiCall('POST', '/users/custom_activity/', activityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateCustomActivity(id, activityData) {
    try {
      const response = await apiCall('PATCH', `/users/custom_activity/${id}`, activityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteCustomActivity(id) {
    try {
      const response = await apiCall('DELETE', `/users/custom_activity/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Mood Services
export const MoodService = {
  async getMoods(skip = 0, limit = 10) {
    try {
      const response = await apiCall('GET', '/moods/', null, { skip, limit });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getMoodById(id) {
    try {
      const response = await apiCall('GET', `/moods/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getMoodByDate(date) {
    try {
      const response = await apiCall('GET', `/moods/date/${date}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createMood(moodData) {
    try {
      const response = await apiCall('POST', '/moods/', moodData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateMood(id, moodData) {
    try {
      const response = await apiCall('PUT', `/moods/${id}`, moodData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteMood(id) {
    try {
      const response = await apiCall('DELETE', `/moods/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateJournal(moodId, journalId, journalData) {
    try {
      const response = await apiCall('PATCH', `/moods/${moodId}/journal/${journalId}`, journalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateActivity(moodId, activityId, activityData) {
    try {
      const response = await apiCall('PATCH', `/moods/${moodId}/activity/${activityId}`, activityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Setting Services
export const SettingService = {
  async getSettings() {
    try {
      const response = await apiCall('GET', '/setting/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createSettings(settingData) {
    try {
      const response = await apiCall('POST', '/setting/', settingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateSettings(settingData) {
    try {
      const response = await apiCall('PATCH', '/setting/', settingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getNotifications() {
    try {
      const response = await apiCall('GET', '/setting/notification');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createNotifications(notificationData) {
    try {
      const response = await apiCall('POST', '/setting/notification', notificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateNotification(id, notificationData) {
    try {
      const response = await apiCall('PATCH', `/setting/notification/${id}`, notificationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Reward Services
export const RewardService = {
  async getReward() {
    try {
      const response = await apiCall('GET', '/users/reward/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createReward(rewardData) {
    try {
      const response = await apiCall('POST', '/users/reward/', rewardData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};