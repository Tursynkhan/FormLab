import axios from 'axios';
import ApiClientInterface from '../services';
import Cookies from "js-cookie";

export const BASE_URL=import.meta.env.VITE_API_URL || 'http://localhost:3000';


export const ApiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
}) as ApiClientInterface;


const refreshToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.data.accessToken;
    Cookies.set("accessToken", newAccessToken, { expires: 1 / 1440, secure: process.env.NODE_ENV === "production" });
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Unable to refresh token");
  }
};

ApiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

ApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;

    if (error?.response?.status === 403 && !prevRequest?.sent) {
      prevRequest.sent = true;
      try {
        const newAccessToken = await refreshToken();
        prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return ApiClient(prevRequest); 
      } catch (refreshError) {

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default ApiClient;
