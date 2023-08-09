import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_NODE_ENV === "development" ? `${process.env.REACT_APP_API_DOMAIN}${process.env.REACT_APP_API_URL}` : process.env.REACT_APP_API_DOMAIN,
  withCredentials: true,
});

export const setAuthHeaders = (token) => {
  if (token) {
    localStorage.setItem("accessToken", token); // Store the token in local storage
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("accessToken"); // Remove the token from local storage
  }
};

const storedToken = localStorage.getItem("accessToken");
if (storedToken) {
  setAuthHeaders(storedToken);
}

export default api;
