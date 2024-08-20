import { useEffect, useState } from "react";
import {
    Flex,
    Text,
    Button,
    Strong
} from "@radix-ui/themes";
import { toast } from "react-toastify";
import { AxiosResponse, AxiosError } from "axios";
import NoteModal from "./NoteModal";
import NoteBar from "./NoteBar";
import ENCHINTL from '@/app/lang/EN-CH.json';
import {
    createNote,
    updateNote,
    findAllNote,
    removeNote
} from "../../api/note.api";
import {
    NewNoteDTO,
    UpdateNoteDTO,
    NoteDTO
} from "../../type";
import { MODAL_TYPE, PUBLIC_TYPE } from "@/app/const";

const NoteTab = (
    {
        intl,
        token,
        signOutAction
    }:
        {
            intl: number;
            token: string;
            signOutAction: () => void;
        }
) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<MODAL_TYPE>();
    const [privateNoteList, setPrivateNoteList] = useState<Array<NoteDTO>>([]);
    const [workSpaceNoteList, setWorkSpaceNoteList] = useState<Array<NoteDTO>>([]);
    const [activeNote, setActiveNote] = useState<NoteDTO>(null);

    const handlerNewBtnClick = () => {
        setActiveNote(null);
        setModalType(MODAL_TYPE.Create);
        setVisible(true);
    }

    async function handlerCreateNote(payload: NewNoteDTO) {
        const res = await createNote(payload, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setPrivateNoteList([result.data, ...privateNoteList]);
            toast.success(ENCHINTL['toast']['note']['create-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerFindAllPrivateNote() {
        const res = await findAllNote(token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setPrivateNoteList([...result.data]);
        }
        else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerFindAllWorkSpaceNote() {

    }

    async function handlerUpdateNote(payload: UpdateNoteDTO) {
        const res = await updateNote(activeNote.id, payload, token);
        if (res.status && res.status < 400) {
            const tmpNotes = [...privateNoteList];
            const update = tmpNotes.find(
                a => a.id === activeNote.id
            )
            Object.keys(payload).map((v) => {
                update[v] = payload[v];
            })
            setPrivateNoteList(tmpNotes);
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
            setPrivateNoteList(privateNoteList.filter(
                a => a.id !== id
            ));
            toast.success(ENCHINTL['toast']['note']['remove-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    const handlerEditBtnClick = (note: NoteDTO) => {
        setModalType(MODAL_TYPE.Update);
        setActiveNote(note);
        setVisible(true);
    }

    useEffect(() => {
        handlerFindAllPrivateNote();
    }, [])

    return (
        <div>
            {
                visible ?
                    <NoteModal
                        intl={intl}
                        type={modalType}
                        publicMode={PUBLIC_TYPE.Private}
                        note={activeNote}
                        setShowModal={setVisible}
                        createNote={handlerCreateNote}
                        updateNote={handlerUpdateNote}
                    /> : null
            }
            <Flex direction="row-reverse">
                <Button color="cyan" variant="soft" onClick={handlerNewBtnClick} >{ENCHINTL['side-bar']['note']['new-btn'][intl]}</Button>
            </Flex>
            <Text as='p' size="4" className="py-3"><Strong>{ENCHINTL['side-bar']['note']['personal-note-p'][intl]}</Strong></Text>
            {
                privateNoteList.map((v, i) => (
                    <NoteBar
                        key={i}
                        note={v}
                        todayFlag={true}
                        handlerEditBtnClick={handlerEditBtnClick}
                        handlerRemoveBtnClick={handlerRemoveBtnClick}
                    />
                ))
            }
            <Text as='p' size="4" className="py-3"><Strong>{ENCHINTL['side-bar']['note']['workspace-note-p'][intl]}</Strong></Text>
        </div>
    )
}

export default NoteTab;