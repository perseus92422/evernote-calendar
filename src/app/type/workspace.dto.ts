export interface WorkSpaceDTO {
    id: number;
    title: string;
    description: string;
    ownerId: number;
    createAt: string;
    _count: {
        notes: number;
        schedules: number;
        todolists: number;
    }
}

export interface NewWorkSpaceDTO {
    title: string;
    description: string;
}