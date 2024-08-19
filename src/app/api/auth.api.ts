import axios, { AxiosError, AxiosResponse } from "axios";
import { BASE_URL } from "../config";
import { SignUpDTO, SignInDTO } from "../type";


export async function signUp(payload: SignUpDTO): Promise<AxiosError | AxiosResponse> {
    try {
        return await axios.post(`${BASE_URL}/auth/signup`, { ...payload });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }

}

export async function signIn(payload: SignInDTO): Promise<AxiosResponse | AxiosError> {
    try {
        return await axios.post(`${BASE_URL}/auth/signin`, { ...payload });
    } catch (e) {
        const err = e as AxiosError;
        return err;
    }
}

