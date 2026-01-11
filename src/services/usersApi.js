// services/userApi.js
import api from '@/utils/api';

export const fetchUsers = async (page = 1, limit = 20) => {
  return await api.get('/users', { params: { page, limit } });
};

export const searchUsers = async (query) => {
  return await api.get('/users/search', { params: { query } });
};

export const followUser = async (userId) => {
  return await api.post(`/users/${userId}/follow`);
};

export const unfollowUser = async (userId) => {
  return await api.post(`/users/${userId}/unfollow`);
};

export const fetchUserProfile = async (userId) => {
  return await api.get(`/users/${userId}/profile`);
};

export const fetchFollowers = async (userId, page = 1, limit = 20) => {
  return await api.get(`/users/${userId}/followers`, { params: { page, limit } });
};

export const fetchFollowing = async (userId, page = 1, limit = 20) => {
  return await api.get(`/users/${userId}/following`, { params: { page, limit } });
};

export const fetchSuggestedUsers = async () => {
  return await api.get('/users/suggested');
};

export const updateUserProfile = async (userId, profileData) => {
  return await api.put(`/users/${userId}/profile`, profileData);
};

export const blockUser = async (userId) => {
  return await api.post(`/users/${userId}/block`);
};

export const unblockUser = async (userId) => {
  return await api.post(`/users/${userId}/unblock`);
};

export const fetchBlockedUsers = async () => {
  return await api.get('/users/blocked');
};

export const fetchUserStats = async (userId) => {
  return await api.get(`/users/${userId}/stats`);
};

export const getUserById = async (userId) => {
  return await api.get(`/users/${userId}`);
};
// Optional: For avatar upload
export const uploadAvatar = async (formData) => {
  return await api.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};