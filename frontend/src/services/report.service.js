import api from "./api";

const API_URL = import.meta.env.VITE_BASE_URL + "/report";

const createReport = async (data) => {
  return await api.post(API_URL, data);
};

const getAllReports = async () => {
  return await api.get(API_URL);
};

const getReportById = async (id) => {
  return await api.get(`${API_URL}/${id}`);
};

const deleteReport = async (id) => {
  return await api.delete(`${API_URL}/${id}`);
};

const confirmReport = async (id) => {
  return await api.post(`${API_URL}/${id}/confirm`);
};

const ReportService = {
  createReport,
  getAllReports,
  getReportById,
  deleteReport,
  confirmReport,
};

export default ReportService;
