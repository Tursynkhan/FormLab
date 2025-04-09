import type { AxiosInstance } from "axios";
import type { AxiosResponse } from "axios";

export interface AxiosServerResponseData<T> {
  status: string;
  data: T;
}

export default interface ApiClientInterface extends AxiosInstance {
  loginUser: (data: {
    email: string;
    password: string;
  }) => Promise<
    AxiosResponse<
      AxiosServerResponseData<{ accessToken: string; username: string }>
    >
  >;

  registerUser: (data: {
    username: string;
    email: string;
    password: string;
  }) => Promise<AxiosResponse<AxiosResponse<AxiosResponse, void>>>;

  refreshUser: (data: {
    refreshToken: string;
  }) => Promise<
    AxiosResponse<AxiosServerResponseData<{ accessToken: string }>>
  >;

  logoutUser: () => Promise<AxiosResponse<AxiosResponse, void>>;
}
