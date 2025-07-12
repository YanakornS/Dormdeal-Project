import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/admin";
console.log("Admin API:", API_URL);

const getAllUsers = async (token) => {
  return await api.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createMod = async (data, token) => {
  return await api.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

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
  getAllUsers,
  createMod,
  updateUserStatus,
  modLogin,
};

export default AdminService;
