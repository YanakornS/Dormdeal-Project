import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/post";

const createPostProduct = async (post) => {
  const response = await api.post(API_URL, post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const getAllPostsProduct = async () => {
  return await api.get(API_URL);
};

const getPostById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data || null;  // ใช้ response.data โดยตรง
};



// const getPostById = async (id) => {
//   return await api.get(`${API_URL}/${id}`);
// }

const PostService = {
  createPostProduct,
  getAllPostsProduct,
  getPostById
};

export default PostService;
