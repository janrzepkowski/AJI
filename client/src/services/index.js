import axios from "axios";

const baseUrl = "http://localhost:3001/api";

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials, {
    withCredentials: true,
  });
  return response.data;
};

const signup = async (userData) => {
  const response = await axios.post(`${baseUrl}/signup`, userData, {
    withCredentials: true,
  });
  return response.data;
};

const refreshToken = async () => {
  const response = await axios.post(
    `${baseUrl}/refresh-token`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

const getOrders = async () => {
  const response = await axios.get(`${baseUrl}/orders`);
  return response.data;
};

const getOrderById = async (id) => {
  const response = await axios.get(`${baseUrl}/orders/${id}`);
  return response.data;
};

const getOrdersByStatus = async (statusId) => {
  const response = await axios.get(`${baseUrl}/orders/status/${statusId}`);
  return response.data;
};

const createOrder = async (orderData, token) => {
  const response = await axios.post(`${baseUrl}/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const updateOrder = async (id, patchData, token) => {
  const response = await axios.patch(`${baseUrl}/orders/${id}`, patchData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const addOrderOpinion = async (id, opinionData, token) => {
  const response = await axios.post(
    `${baseUrl}/orders/${id}/opinions`,
    opinionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
  return response.data;
};

const getProducts = async () => {
  const response = await axios.get(`${baseUrl}/products`);
  return response.data;
};

const getProductById = async (id) => {
  const response = await axios.get(`${baseUrl}/products/${id}`);
  return response.data;
};

const getProductSeoDescription = async (id) => {
  const response = await axios.get(`${baseUrl}/products/${id}/seo-description`);
  return response.data;
};

const createProduct = async (productData, token) => {
  const response = await axios.post(`${baseUrl}/products`, productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const updateProduct = async (id, productData, token) => {
  const response = await axios.put(`${baseUrl}/products/${id}`, productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const deleteProduct = async (id, token) => {
  const response = await axios.delete(`${baseUrl}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

const getCategories = async () => {
  const response = await axios.get(`${baseUrl}/categories`);
  return response.data;
};

const getStatuses = async () => {
  const response = await axios.get(`${baseUrl}/status`);
  return response.data;
};

const initProducts = async (data, token) => {
  const response = await axios.post(`${baseUrl}/init`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return response.data;
};

export default {
  login,
  signup,
  refreshToken,
  getOrders,
  getOrderById,
  getOrdersByStatus,
  createOrder,
  updateOrder,
  addOrderOpinion,
  getProducts,
  getProductById,
  getProductSeoDescription,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getStatuses,
  initProducts,
};
