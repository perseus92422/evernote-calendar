import { useState, useEffect } from "react";
import { Flex, Button } from "@radix-ui/themes";
import { toast } from "react-toastify";
import { findAllNoteOnWorkSpace } from "@/app/api";
import { WorkSpaceDTO, NoteDTO } from "@/app/type";
import { AxiosResponse } from "axios";
import ENCHINTL from '@/app/lang/EN-CH.json';

const WorkSpaceNoteTab = (
    {
        intl,
        workspace,
    }:
        {
            intl: number;
            workspace: WorkSpaceDTO;
        }
) => {

    const token = localStorage.getItem('token');
    const [noteList, setNoteList] = useState<NoteDTO[]>([]);

    async function getNoteList() {
        const res = await findAllNoteOnWorkSpace(workspace.id, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setNoteList([...result.data]);
        }
    }

    useEffect(() => {
        getNoteList();
    }, [])

    return (
        <div>
            <Flex justify="end" px="2" py="2">
                <Button color="cyan" variant="soft" >{ENCHINTL['workspace']['side-bar']['note']['new-btn'][intl]}</Button>

            </Flex>
        </div>
    )
}

export default WorkSpaceNoteTab;