import axios, { AxiosResponse } from "axios";
import moment from "moment";
// import { TPlan } from "../type";
import { BASE_URL } from "../config";
import { NewScheduleDTO, UpdateScheduleDTO } from "../type";

export async function createSchedule(payload: NewScheduleDTO): Promise<AxiosResponse> {
    return await axios.post(BASE_URL + '/schedule', { ...payload });
}

export async function updateSchedule(id: number, payload: UpdateScheduleDTO): Promise<AxiosResponse> {
    return await axios.put(BASE_URL + `/schedule/${id}`, { ...payload });
}

export async function findAllScheduleByMonth(): Promise<AxiosResponse> {
    return await axios.get(BASE_URL + `/schedule`);
}

export async function removeSchedule(id: number): Promise<AxiosResponse> {
    return await axios.delete(BASE_URL + `/schedule/${id}`);
}

// export const addScheduleAPI = (data: TPlan) => {
//     return axios.post(BASE_URL + '/schedule', {
//         title: data.title,
//         demo: data.demo,
//         startDate: data.startDate,
//         endDate: data.endDate,
//         width: data.width,
//         color: data.color,
//         kind: data.kind,
//         user: data.user.username
//     })
// }
export const getSchedulesAPI = ({ startDate, endDate }: { startDate: moment.Moment, endDate: moment.Moment }) => {
    const cfg = {
        // headers: {
        //     "Authorization": "Bearer " + access_token
        // }
    }
    return axios.post(BASE_URL + '/schedule/read',
        {
            startDate: startDate.format("YYYY-MM-DD"),
            endDate: endDate.format("YYYY-MM-DD"),
        })
};
// export const updateScheduleAPI = (plan: TPlan) => {
//     const cfg = {
//         // headers: {
//         //     "Authorization": "Bearer " + access_token
//         // }
//     }
//     return axios.put(BASE_URL + '/schedule/' + plan._id, plan)
// };
export const deleteScheduleAPI = (id: string) => {
    const cfg = {
        // headers: {
        //     "Authorization": "Bearer " + access_token
        // }
    }
    return axios.delete(BASE_URL + '/schedule/' + id)
};

export const getScheduleKindAPI = () => {
    return axios.get(BASE_URL + '/schedule_kind',)
};