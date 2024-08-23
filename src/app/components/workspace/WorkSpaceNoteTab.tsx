import { useState, useEffect } from "react";
import { AxiosResponse, AxiosError } from "axios";
import { Flex, Button } from "@radix-ui/themes";
import { toast } from "react-toastify";
import NoteModal from "../note/NoteModal";
import NoteBar from "../note/NoteBar";
import ENCHINTL from '@/app/lang/EN-CH.json';
import {
    createNote,
    updateNote,
    removeNote,
    findAllNoteOnWorkSpace,
} from "@/app/api";
import {
    WorkSpaceDTO,
    NoteDTO,
    NewNoteDTO,
    UpdateNoteDTO,
    UserDTO
} from "@/app/type";
import { MODAL_TYPE, PUBLIC_TYPE } from "@/app/const";


const WorkSpaceNoteTab = (
    {
        intl,
        user,
        token,
        workspace,
        signOutAction
    }:
        {
            intl: number;
            user: UserDTO;
            token: string;
            workspace: WorkSpaceDTO;
            signOutAction: () => void;
        }
) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<MODAL_TYPE>(null);
    const [noteList, setNoteList] = useState<Array<NoteDTO>>([]);
    const [activeNote, setActiveNote] = useState<NoteDTO>(null);

    const handlerNewBtnClick = () => {
        setModalType(MODAL_TYPE.Create);
        setActiveNote(null);
        setVisible(true);
    }

    const handlerEditBtnClick = (note: NoteDTO) => {
        setModalType(MODAL_TYPE.Update);
        setActiveNote(note);
        setVisible(true);
    }

    async function handlerCreateWorkSpaceNote(payload: NewNoteDTO) {
        const res = await createNote(payload, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setNoteList([result.data, ...noteList]);
            toast.success(ENCHINTL['toast']['note']['create-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerUpdateWorkSpaceNote(payload: UpdateNoteDTO) {
        const res = await updateNote(activeNote.id, payload, token);
        if (res.status && res.status < 400) {
            const tmpNotes = [...noteList];
            const update = tmpNotes.find(
                a => a.id === activeNote.id
            );
            Object.keys(payload).map(v => update[v] = payload[v]);
            setNoteList(tmpNotes);
            toast.success(ENCHINTL['toast']['note']['update-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerRemoveBtnClick(id: number) {
        const res = await removeNote(id, token);
        if (res.status && res.status < 400) {
            setNoteList(noteList.filter(
                a => a.id !== id
            ));
            toast.success(ENCHINTL['toast']['note']['remove-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerFindAllWorkSpaceNote() {
        const res = await findAllNoteOnWorkSpace(workspace.id, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setNoteList([...result.data]);
        }
    }

    useEffect(() => {
        handlerFindAllWorkSpaceNote();
    }, [])

    return (
        <div>
            {
                visible ? (
                    <NoteModal
                        intl={intl}
                        type={modalType}
                        publicMode={PUBLIC_TYPE.WorkSpace}
                        note={activeNote}
                        workspaceId={workspace.id}
                        setShowModal={setVisible}
                        createNote={handlerCreateWorkSpaceNote}
                        updateNote={handlerUpdateWorkSpaceNote}
                    />
                ) : null
            }
            <Flex justify="end" px="2" py="3">
                <Button color="cyan" variant="soft" onClick={handlerNewBtnClick}>{ENCHINTL['workspace']['side-bar']['note']['new-btn'][intl]}</Button>
            </Flex>
            {
                noteList.map((v, i) => (
                    <NoteBar
                        key={i}
                        note={v}
                        editable={user.id === v.ownerId ? true : false}
                        removable={user.id === v.ownerId ? true : false}
                        handlerEditBtnClick={handlerEditBtnClick}
                        handlerRemoveBtnClick={handlerRemoveBtnClick}
                    />
                ))
            }
        </div>
    )
}

export default WorkSpaceNoteTab;