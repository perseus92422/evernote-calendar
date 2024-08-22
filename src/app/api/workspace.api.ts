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

export async function inviteToWorkSpace(workspaceId: number, inviteEmail: string, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${BASE_URL}/workspace/invite/${workspaceId}`, { params: { email: inviteEmail }, headers: { Authorization: `Bearer ${token}` } })
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function removeInvite(workspaceId: number, userId: number, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${BASE_URL}/workspace/remove-invite/${workspaceId}`, { params: { user: userId }, headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllNoteOnWorkSpace(workspaceId: number, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${BASE_URL}/workspace/note/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } })
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllScheduleOnWorkSpace(workspaceId: number, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${BASE_URL}/workspace/schedule/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } })
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllTodoListOnWorkSpace(workspaceId: number, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${BASE_URL}/workspace/todolist/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } })
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

export async function findAllMembersOnWorkSpace(workspaceId: number, token: string): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.get(`${BASE_URL}/workspace/member/${workspaceId}`, { headers: { Authorization: `Bearer ${token}` } })
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}