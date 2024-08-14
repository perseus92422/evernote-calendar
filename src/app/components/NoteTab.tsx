import { useEffect } from "react";
import {
    Flex,
    Text,
    Button,
    Strong
} from "@radix-ui/themes";
import NoteBar from "./NoteBar";
import ENCHINTL from '@/app/lang/EN-CH.json';

const NoteTab = (
    {
        intl,
        handleNewBtnHandler
    }:
        {
            intl: number;
            handleNewBtnHandler: () => void;
        }
) => {

    useEffect(() => {
        console.log("note tabs");
    }, [])

    return (
        <div>
            <Flex direction="row-reverse">
                <Button onClick={handleNewBtnHandler}>{ENCHINTL['side-bar']['note']['new-btn'][intl]}</Button>
            </Flex>
            <Text as='p' size="4"><Strong>{ENCHINTL['side-bar']['note']['today-p'][intl]}</Strong></Text>
            <Text as='p' size="4"><Strong>{ENCHINTL['side-bar']['note']['all-p'][intl]}</Strong></Text>
            <NoteBar />
        </div>
    )
}

export default NoteTab;