import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "../config";
import { NewScheduleDTO, UpdateScheduleDTO } from "../type";

export async function createSchedule(payload: NewScheduleDTO): Promise<AxiosResponse> {
    return await axios.post(BASE_URL + '/schedule', { ...payload });
}

export async function updateSchedule(id: number, payload: UpdateScheduleDTO): Promise<AxiosResponse> {
    return await axios.put(BASE_URL + `/schedule/${id}`, { ...payload });
}

export async function findAllSchedule(): Promise<AxiosResponse> {
    return await axios.get(BASE_URL + `/schedule`);
}

export async function removeSchedule(id: number): Promise<AxiosResponse> {
    return await axios.delete(BASE_URL + `/schedule/${id}`);
}

export async function findDaySchedule(day: string): Promise<AxiosResponse> {
    return await axios.get(BASE_URL + `/schedule/day`, { params: { day } });
}