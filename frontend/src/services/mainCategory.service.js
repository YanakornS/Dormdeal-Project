import api from "./api";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const MAIN_URL = `${BASE_URL}/maincategory`;

const SUB_URL = `${BASE_URL}/subcategory`;

const getAllMainCategories = async () => {
  return await api.get(MAIN_URL);
};

const getMainCategoryById = async (id) => {
  return await api.get(`${MAIN_URL}/${id}`);
};

const addMainCategory = async (formData) => {
  return await api.post(`${MAIN_URL}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};



const updateMainCategory = async (id, formData) => {
  return await api.put(`${MAIN_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


const deleteMainCategory = async (id) => {
  return await api.delete(`${MAIN_URL}/${id}`);
};

const getAllSubCategories = async () => {
  return await api.get(`${SUB_URL}/sub`);
};

const getSubCategoryById = async (id) => {
  return await api.get(`${SUB_URL}/${id}`);
};

const addSubCategory = async (data) => {
  return await api.post(SUB_URL, data);
};

const updateSubCategory = async (id, data) => {
  return await api.put(`${SUB_URL}/${id}`, data);
};

const deleteSubCategory = async (id) => {
  return await api.delete(`${SUB_URL}/${id}`);
};

const mainCategoryService = {
  // Main Category
  getAllMainCategories,
  getMainCategoryById,
  addMainCategory,
  updateMainCategory,
  deleteMainCategory,

  // Sub Category
  getAllSubCategories,
  getSubCategoryById,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
};

export default mainCategoryService;
