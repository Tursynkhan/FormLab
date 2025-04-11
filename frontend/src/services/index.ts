// import type { AxiosInstance } from "axios";
// import type { AxiosResponse } from "axios";
// import { FormDetail, PageMeta } from "../types/Form";
// import { FormData, FormResponse } from "../types/Form";
// export interface AxiosServerResponseData<T> {
//   status: string;
//   data: T;
// }

// export default interface ApiClientInterface extends AxiosInstance {
//   loginUser: (data: {
//     email: string;
//     password: string;
//   }) => Promise<
//     AxiosResponse<
//       AxiosServerResponseData<{ accessToken: string; username: string }>
//     >
//   >;

//   registerUser: (data: {
//     username: string;
//     email: string;
//     password: string;
//   }) => Promise<AxiosResponse<AxiosResponse<AxiosResponse, void>>>;

//   refreshUser: (data: {
//     refreshToken: string;
//   }) => Promise<
//     AxiosResponse<AxiosServerResponseData<{ accessToken: string }>>
//   >;

//   logoutUser: () => Promise<AxiosResponse<AxiosResponse, void>>;

//   getAllForms: (data: {
//     limit: number;
//     search: string | null;
//     page: number | string;
//   }) => Promise<
//     AxiosResponse<
//       AxiosServerResponseData<{ list: FormData[]; pageMeta: PageMeta }>
//     >
//   >;

//   deleteFormById: (
//     formId: string
//   ) => Promise<
//     AxiosResponse<AxiosServerResponseData<{ message: string; formId: string }>>
//   >;

//   getResponseStatus: (
//     templateId: number,
//     userId: string
//   ) => Promise<AxiosResponse<{ status: boolean }>>;

//   getFormById: (
//     formId: string
//   ) => Promise<AxiosResponse<AxiosServerResponseData<FormDetail>>>;
//   submitResponse: (
//     data: FormResponse
//   ) => Promise<AxiosResponse<AxiosResponse, void>>;
// }
