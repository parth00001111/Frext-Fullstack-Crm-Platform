import api from "./axios";
import { type IApiResponse, type INote } from "../types";

export const getAllNotesApi = () => api.get<IApiResponse<INote[]>>("/getAllNotes");

export const getNotesByEntityApi = (entityType: string, entityId: string) =>
  api.get<IApiResponse<INote[]>>(`/getNotesByEntity/${entityType}/${entityId}`);

export const createNoteApi = (payload: {
  content: string;
  entityType: string;
  entityId: string;
}) => api.post<IApiResponse<INote>>("/createNote", payload);

export const updateNoteApi = (id: string, payload: { content: string }) =>
  api.put<IApiResponse<INote>>(`/updateNote/${id}`, payload);

export const deleteNoteApi = (id: string) =>
  api.delete<IApiResponse>(`/deleteNote/${id}`);
