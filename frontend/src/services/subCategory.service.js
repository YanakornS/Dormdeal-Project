import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/subcategory";

const getAllSubCategories = () => api.get(`${API_URL}/sub`);
const addSubCategory = (data) => api.post(`${API_URL}`, data);
const deleteSubCategory = (id) => api.delete(`${API_URL}/${id}`);

export default {
  getAllSubCategories,
  addSubCategory,
  deleteSubCategory,
};
