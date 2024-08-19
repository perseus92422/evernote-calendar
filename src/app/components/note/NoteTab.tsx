import { useEffect, useState } from "react";
import {
    Flex,
    Text,
    Button,
    Strong
} from "@radix-ui/themes";
import { toast } from "react-toastify";
import NoteModal from "./NoteModal";
import NoteBar from "./NoteBar";
import ENCHINTL from '@/app/lang/EN-CH.json';
import {
    findAllNote,
    findAllNoteByDay,
    removeNote
} from "../../api/note.api";
import { NoteDTO } from "../../type";
import { NOTE_MODAL_TYPE } from "@/app/const";


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

    const token = localStorage.getItem('token');
    const [visible, setVisible] = useState<boolean>(false);
    const [allNoteList, setAllNoteList] = useState<Array<NoteDTO>>([]);
    const [activeDayNoteList, setActiveDayNoteList] = useState<Array<NoteDTO>>([]);
    const [activeNote, setActiveNote] = useState<NoteDTO>();

    async function getAllNote() {
        const { data, status } = await findAllNote(token);
        if (status >= 400) {

        } else {
            setAllNoteList([...data]);
        }
    }

    async function getAllNoteByDay() {
        const { data, status } = await findAllNoteByDay(activeDate, token);
        if (status >= 400) {

        } else {
            setActiveDayNoteList([...data]);
        }
    }

    async function handlerRemoveBtnClick(id: number) {
        const { status, data } = await removeNote(id, token);
        setShowDateBar(false);
        if (status >= 400) {

        } else {
            toast.success(ENCHINTL['toast']['note']['remove-success'][intl]);
        }
    }

    const handlerEditBtnClick = (note: NoteDTO) => {
        setVisible(true);
        setActiveNote(note);
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