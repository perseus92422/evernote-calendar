import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_URL } from "../config";
import { NewWorkSpaceDTO, UpdateWorkSpaceDTO } from "../type";

export async function findAllWorkSpace(token: string): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.get(`${BASE_URL}/workspace`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function createWorkSpace(payload: NewWorkSpaceDTO, token: string): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.post(`${BASE_URL}/workspace`, payload, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function updateWorkSpace(id: number, payload: UpdateWorkSpaceDTO, token: string): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.put(`${BASE_URL}/workspace/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function removeWorkSpace(id: number, token: string): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.delete(`${BASE_URL}/workspace/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}