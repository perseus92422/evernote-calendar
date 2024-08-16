import { useEffect, useState } from "react";
import {
    Flex,
    Text,
    Dialog,
    Button,
    TextField,
    TextArea,
} from "@radix-ui/themes";
import Message from "../common/message";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { TODOLIST_MODAL_TYPE } from "@/app/const";

const TodoListModal = (
    {
        intl,
        type,
        isShow,
        setShowModal
    }:
        {
            intl: number;
            type: TODOLIST_MODAL_TYPE;
            isShow: boolean;
            setShowModal: (arg: boolean) => void;
        }
) => {

    const [visible, setVisible] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");


    const handleModalShow = () => {
        setVisible(false);
        setShowModal(false);
    }

    const handleTitleChange = (value: string) => {
        setTitle(value);
    }

    const handlerDescriptoinChange = (value: string) => {
        setDescription(value);
    }

    const handlerStartTimeChange = (value: string) => {
        setStartTime(value);
    }

    const handlerEndTimeChange = (value: string) => {
        setEndTime(value);
    }

    async function handlerSubmitClick() {
        if (!title) {
            setError(ENCHINTL['error']['todolist']['modal']['empty-title'][intl])
            return;
        }
        if (!description) {
            setError(ENCHINTL['error']['todolist']['modal']['empty-description'][intl])
            return;
        }
        if (!startTime) {
            setError(ENCHINTL['error']['todolist']['modal']['empty-starttime'][intl])
            return;
        }
        if (!endTime) {
            setError(ENCHINTL['error']['todolist']['modal']['empty-endtime'][intl])
            return;
        }
        if (startTime.localeCompare(endTime) > 0) {
            setError(ENCHINTL['error']['todolist']['modal']['invalid-endtime'][intl])
            return;
        }
    }



    return (
        <Dialog.Root open={visible} onOpenChange={handleModalShow}>
            <Dialog.Content>
                <Dialog.Title>
                    {type == TODOLIST_MODAL_TYPE.Create ? ENCHINTL['modal']['todolist']['title-d']['create'][intl] : null}
                    {type == TODOLIST_MODAL_TYPE.Update ? ENCHINTL['modal']['todolist']['title-d']['update'][intl] : null}
                </Dialog.Title>
                <Dialog.Description>

                </Dialog.Description>
                {
                    error ? (<Message message={error} />) : null
                }
                <Flex direction="column" py="2" gap="1">
                    <Text as="p">{ENCHINTL['modal']['todolist']['title-p'][intl]}</Text>
                    <TextField.Root
                        autoFocus={true}
                        size="2"
                        placeholder={ENCHINTL['modal']['todolist']['title-textfield-holder'][intl]}
                        value={title}
                        onChange={e => handleTitleChange(e.target.value)}
                    />
                </Flex>
                <Flex direction="column" py="2" gap="1">
                    <Text as="p">{ENCHINTL['modal']['todolist']['description-p'][intl]}</Text>
                    <TextArea
                        value={description}
                        rows={5}
                        placeholder={ENCHINTL['modal']['todolist']['description-textarea-holder'][intl]}
                        onChange={(e) => handlerDescriptoinChange(e.target.value)}
                    />
                </Flex>
                <Flex direction="row" justify="between" py="2">
                    <input type="time" value={startTime} onChange={(e) => handlerStartTimeChange(e.target.value)} />
                    <input type="time" value={endTime} onChange={(e) => handlerEndTimeChange(e.target.value)} />
                </Flex>
                <Flex justify="end" gap="2">
                    <Button
                        radius="full"
                        color="indigo"
                        onClick={handlerSubmitClick}
                    >
                        {ENCHINTL['modal']['todolist']['button']['submit'][intl]}
                    </Button>
                    <Dialog.Close>
                        <Button
                            radius="full"
                            color="gray"
                            onClick={handleModalShow}
                        >
                            {ENCHINTL['modal']['todolist']['button']['close'][intl]}
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default TodoListModal;