import { useEffect, useState } from "react";
import {
    Flex,
    Text,
    Button,
    Strong
} from "@radix-ui/themes";
import NoteBar from "./NoteBar";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { findAllByDay, findAll } from "../api/note.api";
import { NoteDTO } from "../type";

const NoteTab = (
    {
        intl,
        activeDate,
        handleNewBtnHandler
    }:
        {
            intl: number;
            activeDate: string;
            handleNewBtnHandler: () => void;
        }
) => {

    const [allnNoteList, setAllNoteList] = useState<Array<NoteDTO>>([]);
    const [todayNoteList, setTodayNoteList] = useState<Array<NoteDTO>>([]);

    async function getAllNote() {
        const { data, status } = await findAll();
        if (status >= 400) {

        } else {
            setAllNoteList([...data]);
        }

    }

    async function getAllNoteByDay() {
        const { data, status } = await findAllByDay(activeDate);
        if (status >= 400) {

        } else {
            setTodayNoteList([...data]);
        }
    }

    async function handlerRemoveBtnClick(id: number) {

    }

    const handlerEditBtnClick = () => {

    }

    useEffect(() => {
        getAllNote();
    }, [])

    useEffect(() => {
        getAllNoteByDay();
    }, [activeDate])

    return (
        <div>
            <Flex direction="row-reverse">
                <Button onClick={handleNewBtnHandler}>{ENCHINTL['side-bar']['note']['new-btn'][intl]}</Button>
            </Flex>
            <Text as='p' size="4"><Strong>{ENCHINTL['side-bar']['note']['today-p'][intl]}</Strong></Text>
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