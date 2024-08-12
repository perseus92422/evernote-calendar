import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hook";
import {
    Dialog,
    Button,
    TextField,
    Flex
} from "@radix-ui/themes";
import Message from "./message";
import { NOTE_MODAL_TYPE } from "../const";
import ENCHIntl from '@/app/lang/EN-CH.json';

const NoteModal = (
    {
        type,
        isShow,
        setShow
    }: {
        type: NOTE_MODAL_TYPE,
        isShow: boolean,
        setShow: (arg: boolean) => void
    }) => {

    const { intl } = useAppSelector(state => state.calendar);
    const [visible, setVisible] = useState<boolean>(true);
    const [title, setTitle] = useState<string>("");

    const handleModalShow = () => {
        setVisible(!visible);
        setShow(!visible);
    }

    const handleTitleChange = (value: string) => {
        setTitle(value);
    }

    return (
        <Dialog.Root open={visible} onOpenChange={handleModalShow} >
            <Dialog.Content>
                <Dialog.Title>
                    {type == NOTE_MODAL_TYPE.Create ? ENCHIntl['note']['modal']['create-title'][intl] : null}
                    {type == NOTE_MODAL_TYPE.Update ? ENCHIntl['note']['modal']['update-title'][intl] : null}
                </Dialog.Title>
                <Dialog.Description>

                </Dialog.Description>
                <div>
                    <p>{ENCHIntl['note']['modal']['title'][intl]}</p>
                    <TextField.Root
                        autoFocus={true}
                        size="2"
                        placeholder={ENCHIntl['note']['modal']['title-holder'][intl]}
                        value={title}
                        onChange={e => handleTitleChange(e.target.value)}
                    />
                </div>
                <Dialog.Close>
                    <Button onClick={handleModalShow}>
                        Close
                    </Button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default NoteModal;