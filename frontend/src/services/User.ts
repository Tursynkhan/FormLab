import ApiClient from "../api/axios";
import { User } from "./config";

ApiClient.loginUser = async (data) => {
  return ApiClient.post(User.login, data, {
    withCredentials: true,
  });
};

ApiClient.registerUser = async (data) => {
  return ApiClient.post(User.register, data, { withCredentials: true });
};

ApiClient.refreshUser = async (data) => {
  return ApiClient.post(User.refresh, data, { withCredentials: true });
};
ApiClient.logoutUser = async () => {
  return ApiClient.post(User.logout, {}, { withCredentials: true });
};

