import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/mod";
console.log(API_URL);

const getAllPostsProductByMod = async () => {
  return await api.get(API_URL);
};

const deletePostProductByMod = async (id) => {
  return await api.delete(`${API_URL}/${id}`);
};

const PostService = {
  getAllPostsProductByMod,
  deletePostProductByMod
};

export default PostService;
