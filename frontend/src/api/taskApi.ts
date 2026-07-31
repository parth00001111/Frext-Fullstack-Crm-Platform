import api from "./axios";
import { type IApiResponse, type ITask } from "../types";

export const getAllTasksApi = () => api.get<IApiResponse<ITask[]>>("/getAllTasks");

export const getTaskByIdApi = (id: string) =>
  api.get<IApiResponse<ITask>>(`/getTasksById/${id}`);

export const createTaskApi = (payload: Partial<ITask>) =>
  api.post<IApiResponse<ITask>>("/createTasks", payload);

export const updateTaskApi = (id: string, payload: Partial<ITask>) =>
  api.put<IApiResponse<ITask>>(`/updateTasks/${id}`, payload);

export const deleteTaskApi = (id: string) =>
  api.delete<IApiResponse>(`/deleteTasks/${id}`);
