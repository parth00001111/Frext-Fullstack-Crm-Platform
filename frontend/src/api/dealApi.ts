import api from "./axios";
import { type IApiResponse, type IDeal } from "../types";

export const getAllDealsApi = () => api.get<IApiResponse<IDeal[]>>("/getAllDeals");

export const getDealByIdApi = (id: string) =>
  api.get<IApiResponse<IDeal>>(`/getDealById/${id}`);

export const createDealApi = (payload: Partial<IDeal>) =>
  api.post<IApiResponse<IDeal>>("/createDeals", payload);

export const updateDealApi = (id: string, payload: Partial<IDeal>) =>
  api.put<IApiResponse<IDeal>>(`/updateDeals/${id}`, payload);

export const deleteDealApi = (id: string) =>
  api.delete<IApiResponse>(`/deleteDeals/${id}`);
