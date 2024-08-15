import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "../config";
import { NewNoteDTO, UpdateNoteDTO } from "../type";

export async function createNote(payload: NewNoteDTO): Promise<AxiosResponse> {
    return await axios.post(`${BASE_URL}/note`, { ...payload });
}

export async function updateNote(id: number, payload: UpdateNoteDTO): Promise<AxiosResponse> {
    return await axios.put(`${BASE_URL}/note/${id}`, { ...payload });
}

export async function removeNote(id: number): Promise<AxiosResponse> {
    return await axios.delete(`${BASE_URL}/note/${id}`);
}

export async function findAllNote(): Promise<AxiosResponse> {
    return await axios.get(`${BASE_URL}/note`);
}

export async function findAllNoteByDay(day: string): Promise<AxiosResponse> {
    return await axios.get(`${BASE_URL}/note/day`, { params: { day } });
}