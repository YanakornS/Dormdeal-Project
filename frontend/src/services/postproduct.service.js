import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/post";

const createPostProduct = async (post) => {
  const response = await api.post(API_URL + "/create", post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const uploadPaymentSlip = async (postId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`${API_URL}/${postId}/upload-slip`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

const getAllPostsProduct = async () => {
  return await api.get(API_URL + "/get-all");
};

const getPostByOwner = async (id) => {
  return await api.get(`${API_URL}/ownerId/${id}`);
}


const getPostById = async (id) => {
  const response = await api.get(`${API_URL}/post${id}`);
  
  return response.data || null;  // ใช้ response.data โดยตรง
};

const updatePostProduct = async (id, post) => {
  return await api.put(`${API_URL}/${id}`, post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


const deletePostByOwner = async (id) => {
  return await api.delete(`${API_URL}/delete${id}`);
};


const PostService = {
  createPostProduct,
  getAllPostsProduct,
  getPostById,
  getPostByOwner,
  deletePostByOwner,
  updatePostProduct,
  uploadPaymentSlip
};

export default PostService;
