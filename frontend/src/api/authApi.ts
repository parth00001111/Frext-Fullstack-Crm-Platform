import api from "./axios";
import { type IApiResponse, type IUser, type Role } from "../types";

export const signupApi = (payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) => api.post<IApiResponse>("/signup", payload);

export const signinApi = (payload: { email: string; password: string }) =>
  api.post<IApiResponse<{ user: IUser; token: string }>>("/signin", payload);

export const logoutApi = () => api.get<IApiResponse>("/logout");
