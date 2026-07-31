import api from "./axios";
import { type IApiResponse, type IDashboardStats, type IActivity } from "../types";

export const getDashboardApi = () =>
  api.get<IApiResponse<IDashboardStats>>("/dashboard");

export const getAllActivitiesApi = () =>
  api.get<IApiResponse<IActivity[]>>("/getAllActivities");
