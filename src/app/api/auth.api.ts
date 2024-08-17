import axios, { AxiosResponse } from "axios";
import { BASE_URL } from "../config";
import { SignUpDTO, SignInDTO } from "../type";


export async function regsiter(payload: SignUpDTO): Promise<AxiosResponse> {
    return await axios.post(`${BASE_URL}/auth/signup`, { ...payload });
}

export async function login(payload: SignInDTO): Promise<AxiosResponse> {
    return await axios.post(`${BASE_URL}/auth/siginin`, { ...payload });
}

