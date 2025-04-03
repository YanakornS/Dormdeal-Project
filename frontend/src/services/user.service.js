import api from "./api";
const API_URL = "/user";

const signJwt = async (email, displayName, photoURL) => {
  return await api.post(`${API_URL}/sign`, {email, displayName, photoURL});
};

const addUser = async (email, displayName, photoURL) => {
  return await api.post(`${API_URL}/`, { email, displayName, photoURL});
};

const UserService = {
  signJwt,
  addUser,
};

export default UserService;