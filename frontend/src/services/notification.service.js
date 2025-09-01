import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/notification";

const getNotifications = async (page = 1, limit = 20) => {
  return await api.get(API_URL, {
    params: { page, limit }
  });
};

const markNotificationAsRead = async (notificationId) => {
  return await api.put(`${API_URL}/${notificationId}/read`);
};

const markAllAsRead = async () => {
  return await api.put(`${API_URL}/read-all`);
};

const NotificationService = {
  getNotifications,
  markNotificationAsRead,
  markAllAsRead
};

export default NotificationService;
