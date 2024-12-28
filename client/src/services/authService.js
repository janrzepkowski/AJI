import axios from "axios";

const baseUrl = "http://localhost:3001/api";

const login = async (credentials) => {
  const response = await axios.post(`${baseUrl}/login`, credentials);
  return response.data;
};

const signup = async (userData) => {
  const response = await axios.post(`${baseUrl}/signup`, userData);
  return response.data;
};

export default { login, signup };
