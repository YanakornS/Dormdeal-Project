import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/admin"; // ชี้ไปที่ /api/admin
console.log("Admin API:", API_URL);

// 🔐 สร้างผู้ดูแลระบบใหม่ (admin เท่านั้น)
const createMod = async (data, token) => {
  return await api.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🛠️ เปลี่ยนสถานะผู้ใช้งาน
const updateUserStatus = async (data, token) => {
  return await api.put(`${API_URL}/user-status`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


const modLogin = async (credentials) => {
  return await api.post(`${API_URL}/mod-login`, credentials);
};

const AdminService = {
  createMod,
  updateUserStatus,
  modLogin,
};

export default AdminService;
