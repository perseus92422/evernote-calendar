import axios, { AxiosResponse, AxiosError } from "axios";
import { BASE_URL } from "../config";
import { NewScheduleDTO, UpdateScheduleDTO } from "../type";

export async function createSchedule(payload: NewScheduleDTO, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.post(BASE_URL + '/schedule', payload, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }

}

export async function updateSchedule(id: number, payload: UpdateScheduleDTO, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.put(BASE_URL + `/schedule/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllSchedule(token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(BASE_URL + `/schedule`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function removeSchedule(id: number, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.delete(BASE_URL + `/schedule/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllScheduleByDay(day: string, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(BASE_URL + `/schedule/day`, { params: { day }, headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllScheduleOnWorkspaces(token: string, dueDate: string): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.get(`${BASE_URL}/schedule/workspace`, {
            params: { dueDate },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

