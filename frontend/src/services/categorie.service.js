import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/maincategory";

const getAllCategorie = async () => {
  return await api.get(API_URL);
};

const CategorieService = {
  getAllCategorie,
};

export default CategorieService;
