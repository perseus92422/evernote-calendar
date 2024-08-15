import { useEffect, useState } from "react";
import {
    Flex,
    Text,
    Button,
    Strong
} from "@radix-ui/themes";
import NoteBar from "./NoteBar";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { findAllNote, findAllNoteByDay, removeNote } from "../../api/note.api";
// import { findAllByDay, findAll, remove } from "../../api/note.api";
import { NoteDTO } from "../../type";
import NoteModal from "./NoteModal";
import { NOTE_MODAL_TYPE } from "@/app/const";
import { toast } from "react-toastify";

const NoteTab = (
    {
        intl,
        activeDate,
        setShowDateBar,
        handleNewBtnHandler
    }:
        {
            intl: number;
            activeDate: string;
            setShowDateBar: (arg: boolean) => void;
            handleNewBtnHandler: () => void;
        }
) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [allnNoteList, setAllNoteList] = useState<Array<NoteDTO>>([]);
    const [todayNoteList, setTodayNoteList] = useState<Array<NoteDTO>>([]);
    const [activeNote, setActiveNote] = useState<NoteDTO>();

    async function getAllNote() {
        const { data, status } = await findAllNote();
        if (status >= 400) {

        } else {
            setAllNoteList([...data]);
        }

    }

    async function getAllNoteByDay() {
        const { data, status } = await findAllNoteByDay(activeDate);
        if (status >= 400) {

        } else {
            setTodayNoteList([...data]);
        }
    }

    async function handlerRemoveBtnClick(id: number) {
        const { status, data } = await removeNote(id);
        setShowDateBar(false);
        if (status >= 400) {

        } else {
            toast.info(ENCHINTL['toast']['note']['remove-success'][intl]);
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
                <Button onClick={handleNewBtnHandler}>{ENCHINTL['side-bar']['note']['new-btn'][intl]}</Button>
            </Flex>
            <Text as='p' size="4"><Strong>{activeDate}</Strong></Text>
            {
                todayNoteList.map((v, i) => (
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
                allnNoteList.map((v, i) => (
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