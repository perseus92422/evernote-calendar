import axios, { AxiosResponse, AxiosError } from "axios";
import { BASE_URL } from "../config";
import { NewNoteDTO, UpdateNoteDTO } from "../type";

export async function createNote(payload: NewNoteDTO, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.post(`${BASE_URL}/note`, payload, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }

}

export async function updateNote(id: number, payload: UpdateNoteDTO, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.put(`${BASE_URL}/note/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function removeNote(id: number, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.delete(`${BASE_URL}/note/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllNote(token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${BASE_URL}/note`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllNoteByDay(day: string, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${BASE_URL}/note/day`, { params: { day }, headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllNoteOnWorkspaces(token: string): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.get(`${BASE_URL}/note/workspace`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}