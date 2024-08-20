export interface NoteDTO {
    id: number;
    title: string;
    content: string;
    date: string;
    ownerId?: number;
    workspaceId?: number;
}

export interface NewNoteDTO {
    title: string;
    content: string;
    date: string;
    workspace?: {
        id: number;
    };
}

export interface UpdateNoteDTO {
    title?: string;
    content?: string;
    date?: string;
}