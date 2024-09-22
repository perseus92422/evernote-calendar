import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_URL } from "../config";

export async function findAllLibrary(token: string): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.get(`${BASE_URL}/library`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function uploadLibrary(file: File, token: string): Promise<AxiosError | AxiosResponse> {
    try {
        let formData = new FormData();
        formData.append('file', file);
        return await axios.post(`${BASE_URL}/library`, formData, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}
