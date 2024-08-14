export interface ScheduleDTO {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    color: string;
    width: number;
    type: string;
}

export interface NewScheduleDTO {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    color: string;
    width: number;
    type: string;
}

export interface UpdateScheduleDTO {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    color?: string;
    width?: number;
    type?: string;
}

export interface ScheduleTypesDTO {
    meeting: string[];
    birthday: string[];
    work: string[];
    holiday: string[];
    travel: string[];
    memory: string[];
    date: string[];
}