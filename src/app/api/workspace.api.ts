import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_URL } from "../config";

export async function findAllWorkSpace(token: string): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.get(`${BASE_URL}/workspace`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}