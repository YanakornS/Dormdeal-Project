import api from "./api";

export const toggleWishlist = async (postId) => {
  return api.post("/wishlist/toggle", { postId });
};

export const getWishlist = async () => {
  return api.get("/wishlist");
};

const WishListService = {
  toggleWishlist,
  getWishlist,
};

export default WishListService;