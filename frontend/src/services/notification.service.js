import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/notification";

// ดึงรายการแจ้งเตือน (มีการแบ่งหน้า)
const getNotifications = async (page = 1, limit = 20) => {
  return await api.get(API_URL, {
    params: { page, limit }
  });
};

// ทำเครื่องหมายว่าอ่านแล้ว
const markNotificationAsRead = async (notificationId) => {
  return await api.put(`${API_URL}/${notificationId}/read`);
};

const NotificationService = {
  getNotifications,
  markNotificationAsRead
};

export default NotificationService;
