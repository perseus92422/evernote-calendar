export interface TaskDTO {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    startTime: string;
    endTime: string;
    complete: boolean;
}

export interface NewTaskDTO {
    title: string;
    description: string;
    dueDate: string;
    startTime: string;
    endTime: string;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    dueDate?: string;
    startTime?: string;
    endTime?: string;
    complete?: boolean;
}