import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/maincategory";

const getAllMainCategories = () => api.get(API_URL);
const addMainCategory = (data) => api.post(API_URL, data);
const deleteMainCategory = (id) => api.delete(`${API_URL}/${id}`);

export default {
  getAllMainCategories,
  addMainCategory,
  deleteMainCategory,
};
