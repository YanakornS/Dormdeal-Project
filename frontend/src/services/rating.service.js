import api from "./api";

const API_URL =  import.meta.env.VITE_BASE_URL + "/rating";

const getSellerRatings = async (sellerId) => {
  return await api.get(`${API_URL}/seller/${sellerId}`);
};

const RatingService = {
  getSellerRatings
};

export default RatingService;
