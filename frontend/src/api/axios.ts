import axios from "axios";
import ApiClientInterface from "./ApiClientInterface";
import Cookies from "js-cookie";
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const userUrl = `${BASE_URL}/auth`;
const formUrl = `${BASE_URL}/forms`;
const FORMS_URL = `${formUrl}`;

const User = {
  login: `${userUrl}/login`,
  register: `${userUrl}/register`,
  refresh: `${userUrl}/refresh`,
  logout: `${userUrl}/logout`,
};

export const ApiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
}) as ApiClientInterface;

const refreshToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.data.accessToken;
    Cookies.set("accessToken", newAccessToken, {
      expires: 1 / 1440,
      secure: process.env.NODE_ENV === "production",
    });
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw new Error("Unable to refresh token");
  }
};

// interceptors

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

// auth
ApiClient.loginUser = async (data) => {
  const response = await ApiClient.post(User.login, data, {
    withCredentials: true,
  });
  return response;
};

ApiClient.registerUser = async (data) => {
  const response = await ApiClient.post(User.register, data, {
    withCredentials: true,
  });
  return response;
};

ApiClient.refreshUser = async (data) => {
  const response = await ApiClient.post(User.refresh, data, {
    withCredentials: true,
  });
  return response;
};
ApiClient.logoutUser = async () => {
  const response = await ApiClient.post(
    User.logout,
    {},
    { withCredentials: true }
  );
  return response;
};

// forms
ApiClient.getAllForms = async (data) => {
  const response = await ApiClient.get(FORMS_URL, {
    data,
  });
  return response;
};

ApiClient.deleteFormById = async (formId) => {
  const response = await ApiClient.delete(`${FORMS_URL}/${formId}`, {});
  return response;
};

ApiClient.getResponseStatus = async (templateId, userId) => {
  const response = await ApiClient.get(
    `${FORMS_URL}/response/${templateId}/${userId}`,
    {
      withCredentials: true,
    }
  );
  return response;
};

ApiClient.getFormById = async (formId) => {
  const response = await ApiClient.get(`${FORMS_URL}/templates/${formId}`, {
    withCredentials: true,
  });
  return response;
};

ApiClient.submitResponse = async (data) => {
  const response = await ApiClient.post(FORMS_URL, data, {
    withCredentials: true,
  });
  return response;
};
