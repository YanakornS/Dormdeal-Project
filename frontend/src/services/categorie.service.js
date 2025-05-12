import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/maincategory";

const getAllCategorie = async () => {
  return await api.get(API_URL);
};

const addCategory = async (data) => {
  return await api.post(`${API_URL}`, data); // POST with image
};

const deleteCategory = async (id) => {
  return await api.delete(`${API_URL}/${id}`);
};

const CategorieService = {
  getAllCategorie,
  addCategory,
  deleteCategory,
};

export default CategorieService;
