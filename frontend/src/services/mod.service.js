import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/mod";
console.log(API_URL);

const getAllPostsByMod = async () => {
  return await api.get(API_URL);
};

const deletePostProductByMod = async (id) => {
  return await api.delete(`${API_URL}/${id}`);
};
const getPostByIdMod = async (id) => {
  return await api.get(`${API_URL}/${id}`);
}

const reviewPostByMod = async (id, data) => {
  return await api.patch(`${API_URL}/review/${id}`, data); 
};


const PostService = {
  deletePostProductByMod,
  getAllPostsByMod,
  getPostByIdMod,
  reviewPostByMod
};

export default PostService;
