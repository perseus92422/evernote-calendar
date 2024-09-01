import axios, { AxiosResponse, AxiosError } from "axios";
import { BASE_URL } from "../config";
import { NewTaskDTO, UpdateTaskDTO } from "../type";

export async function createTask(payload: NewTaskDTO, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.post(`${BASE_URL}/task`, payload, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }

}

export async function updateTask(id: number, payload: UpdateTaskDTO, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.put(`${BASE_URL}/task/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function removeTask(id: number, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.delete(`${BASE_URL}/task/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllTask(token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${BASE_URL}/task`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }

}

export async function findAllTaskByDay(day: string, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${BASE_URL}/task/day`, { params: { day }, headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }

}

export async function findAllTodoListOnWorkSpaces(token: string, dueDate: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${BASE_URL}/task/workspace`, { params: { dueDate }, headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}