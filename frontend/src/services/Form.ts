import { axiosPrivate } from "../api/axios";
import { formUrl } from "./config";

const FORMS_URL = `${formUrl}`

export const getAllForms = (params: { limit: number; search: string | null; page: number | string }) => {
  return axios.get(FORMS_URL, { params, withCredentials: true });
};

export const deleteFormById = (formId: string) => {
  return axios.delete(`${FORMS_URL}/${formId}`, { withCredentials: true });
};

export const getResponseStatus = (templateId: number, userId: string) => {
  return axios.post(
    `${FORMS_URL}/status`,
    { templateId, userId },
    { withCredentials: true }
  );
};

export const getFormDetails = (formId: string) => {
  return axios.get(`/templates/${formId}`, { withCredentials: true });
};

export const submitResponse = (data: { 
  formId: string, 
  answers: { fieldId: string, response: string | string[] | null }[] 
}) => {
  return axios.post(FORMS_URL, data, { withCredentials: true });
};