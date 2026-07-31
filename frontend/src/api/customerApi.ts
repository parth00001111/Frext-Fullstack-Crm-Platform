import api from "./axios";
import { type IApiResponse, type ICustomer } from "../types";

export const getAllCustomersApi = () =>
  api.get<IApiResponse<ICustomer[]>>("/getAllCustomer");

export const getCustomerByIdApi = (id: string) =>
  api.get<IApiResponse<ICustomer>>(`/getCustomerById/${id}`);

export const createCustomerApi = (payload: Partial<ICustomer>) =>
  api.post<IApiResponse<ICustomer>>("/createCustomer", payload);

export const updateCustomerApi = (id: string, payload: Partial<ICustomer>) =>
  api.put<IApiResponse<ICustomer>>(`/updateCustomers/${id}`, payload);

export const deleteCustomerApi = (id: string) =>
  api.delete<IApiResponse>(`/deleteCustomers/${id}`);
