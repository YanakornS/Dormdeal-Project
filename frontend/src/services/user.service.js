import api from "./api";
const API_URL = "/user";

const signJwt = async (idToken) => {
  return await api.post(`${API_URL}/sign`, { idToken });
};

const addUser = async (email, displayName, photoURL) => {
  return await api.post(`${API_URL}/`, { email, displayName, photoURL});
};

const addModUser = async ({ email, displayName, role }) => {
  return await api.post(`${API_URL}/`, { email, displayName, role });
};

const updateUserPhoto = async (email, photoURL) => {
  return await api.put(`${API_URL}/photo`, { email, photoURL });
};



const UserService = {
  signJwt,
  addUser,
  addModUser,
  updateUserPhoto,
};

export default UserService;