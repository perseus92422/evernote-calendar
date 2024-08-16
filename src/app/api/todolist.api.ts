import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "../config";
import { NewTaskDTO, UpdateTaskDTO } from "../type";

export async function createTask(payload: NewTaskDTO): Promise<AxiosResponse> {
    return await axios.post(`${BASE_URL}/task`, { ...payload });
}

export async function updateTask(id: number, payload: UpdateTaskDTO): Promise<AxiosResponse> {
    return await axios.put(`${BASE_URL}/task/${id}`, { ...payload });
}

export async function removeTask(id: number): Promise<AxiosResponse> {
    return await axios.delete(`${BASE_URL}/task/${id}`);
}

export async function findAllTask(): Promise<AxiosResponse> {
    return await axios.get(`${BASE_URL}/taks`);
}