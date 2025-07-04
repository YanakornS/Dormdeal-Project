import api from "./api";
const API_URL = "/user";

const signJwt = async (email, displayName, photoURL) => {
  return await api.post(`${API_URL}/sign`, {email, displayName, photoURL});
};

const addUser = async (email, displayName, photoURL) => {
  return await api.post(`${API_URL}/`, { email, displayName, photoURL});
};

const updateUserPhoto = async (email, photoURL) => {
  return await api.put(`${API_URL}/photo`, { email, photoURL });
};



const UserService = {
  signJwt,
  addUser,
  updateUserPhoto,
};

export default UserService;