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

  const response = await api.post(
    `${API_URL}/${postId}/upload-slip`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

const getAllPostsProduct = async () => {
  return await api.get(API_URL + "/get-all");
};

const getPostByOwner = async (id) => {
  return await api.get(`${API_URL}/ownerId/${id}`);
};

const getPostById = async (id) => {
  const response = await api.get(`${API_URL}/post/${id}`);

  return response.data || null; // ใช้ response.data โดยตรง
};

const updatePostProduct = async (id, post) => {
  return await api.put(`${API_URL}/${id}`, post, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deletePostByOwner = async (id) => {
  return await api.delete(`${API_URL}/delete/${id}`);
};

const getInterestedUsers = async (postId) => {
  const response = await api.get(`${API_URL}/${postId}/interested-users`);
  return response.data.data?.interestedUsers || [];
};

const closePostAndNotify = async (postId, { buyerIds }) => {
  return await api.patch(`${API_URL}/${postId}/close`, { buyerIds });
};

const rateSeller = async (postId, ratingData) => {
  return await api.post(`${API_URL}/${postId}/rate`, ratingData);
};

const getPostsByType = async (type) => {
  // type ต้องเป็น "wts" หรือ "wtb"
  const response = await api.get(`${API_URL}?type=${type}`);
  return response.data; // ส่ง response.data กลับ
};

const PostService = {
  createPostProduct,
  getAllPostsProduct,
  getPostById,
  getPostByOwner,
  deletePostByOwner,
  updatePostProduct,
  uploadPaymentSlip,
  getInterestedUsers,
  closePostAndNotify,
  rateSeller,
  getPostsByType
};

export default PostService;
