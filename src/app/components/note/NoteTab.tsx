import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useAppDispatch } from "@/app/redux/hook";
import ENCHINTL from '@/app/lang/EN-CH.json';
import {
    findAllNote,
    findAllNoteByDay,
    removeNote
} from "../../api/note.api";
import { NoteDTO } from "../../type";
import { NOTE_MODAL_TYPE } from "@/app/const";
import { setUserProps } from "@/app/features/calendar.slice";
import { eraseStorage } from "@/app/helper";

const NoteTab = (
    {
        intl,
        activeDate,
        setShowDateBar,
        handleNewBtnClick
    }:
        {
            intl: number;
            activeDate: string;
            setShowDateBar: (arg: boolean) => void;
            handleNewBtnClick: () => void;
        }
) => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const token = localStorage.getItem('token');
    const [visible, setVisible] = useState<boolean>(false);
    const [allNoteList, setAllNoteList] = useState<Array<NoteDTO>>([]);
    const [activeDayNoteList, setActiveDayNoteList] = useState<Array<NoteDTO>>([]);
    const [activeNote, setActiveNote] = useState<NoteDTO>();

    async function getAllNote() {
        const res = await findAllNote(token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setAllNoteList([...result.data]);
        }
        else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    async function getAllNoteByDay() {
        if (!activeDate)
            return;
        const res = await findAllNoteByDay(activeDate, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setActiveDayNoteList([...result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    async function handlerRemoveBtnClick(id: number) {
        const res = await removeNote(id, token);
        if (res.status && res.status < 400) {
            toast.success(ENCHINTL['toast']['note']['remove-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
        setShowDateBar(false);
    }

    const handlerEditBtnClick = (note: NoteDTO) => {
        setVisible(true);
        setActiveNote(note);
    }

    const signOutAction = () => {
        eraseStorage();
        dispatch(setUserProps(null));
        router.push('/auth/signin');
    }

    useEffect(() => {
        getAllNote();
    }, [])

    useEffect(() => {
        getAllNoteByDay();
    }, [activeDate])

    return (
        <div>
            {
                visible ?
                    <NoteModal
                        type={NOTE_MODAL_TYPE.Update}
                        isShow={visible}
                        note={activeNote}
                        setShowModal={setVisible}
                        setShowDateBar={setShowDateBar}
                    /> : null
            }
            <Flex direction="row-reverse">
                <Button onClick={handleNewBtnClick}>{ENCHINTL['side-bar']['note']['new-btn'][intl]}</Button>
            </Flex>
            <Text as='p' size="4"><Strong>{activeDate}</Strong></Text>
            {
                activeDayNoteList.map((v, i) => (
                    <NoteBar
                        key={i}
                        note={v}
                        todayFlag={true}
                        handlerEditBtnClick={handlerEditBtnClick}
                        handlerRemoveBtnClick={handlerRemoveBtnClick}
                    />
                ))
            }
            <Text as='p' size="4"><Strong>{ENCHINTL['side-bar']['note']['all-p'][intl]}</Strong></Text>
            {
                allNoteList.map((v, i) => (
                    <NoteBar
                        key={i}
                        note={v}
                        todayFlag={false}
                        handlerEditBtnClick={handlerEditBtnClick}
                        handlerRemoveBtnClick={handlerRemoveBtnClick}
                    />
                ))
            }
        </div>
    )
}

export default NoteTab;