import { useState } from "react";
import { Flex, Dialog, Button, Text, Strong, TextField, TextArea } from "@radix-ui/themes";
import Message from "../common/message";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { WORKSPACE_MODAL_TYPE } from "@/app/const";

const WorkSpaceModal = (
    {
        intl,
        type,
        show,
        setShow
    }: {
        intl: number;
        type: WORKSPACE_MODAL_TYPE;
        show: boolean;
        setShow: (arg: boolean) => void;
    }
) => {

    const [visible, setVisible] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handlerVisibleChange = () => {
        setVisible(false);
        setShow(false);
    }

    const handlerTitleChange = (value: string) => {
        setTitle(value);
    }

    const handlerDescriptionChange = (value: string) => {
        setDescription(value);
    }

    async function handlerSubmitClick() {
        if (!title) {
            setError(ENCHINTL['error']['workspace']['empty-title'][intl]);
            return;
        }
        if (!description) {
            setError(ENCHINTL['error']['workspace']['empty-description'][intl]);
            return;
        }
        if (type === WORKSPACE_MODAL_TYPE.Create) {

        }
        initState();
    }

    const initState = () => {
        setTitle("");
        setDescription("")
        setError("");
        setShow(false);
        setVisible(false);
    }

    return (
        <Dialog.Root open={visible} onOpenChange={handlerVisibleChange}>
            <Dialog.Content>
                <Dialog.Title>
                    {type == WORKSPACE_MODAL_TYPE.Create ? ENCHINTL['modal']['workspace']['title-d']['create'][intl] : null}
                    {type == WORKSPACE_MODAL_TYPE.Update ? ENCHINTL['modal']['workspace']['title-d']['update'][intl] : null}
                </Dialog.Title>
                <Dialog.Description>

                </Dialog.Description>
                {error ? (<Message message={error} />) : null}
                <Flex direction="column" gap="1" py="2">
                    <Text as="label">{ENCHINTL['modal']['workspace']['title-label'][intl]}</Text>
                    <TextField.Root
                        value={title}
                        onChange={e => handlerTitleChange(e.target.value)}
                        placeholder={ENCHINTL['modal']['workspace']['title-textfield-holder'][intl]}
                    />
                </Flex>
                <Flex direction="column" gap="1" py="2">
                    <Text as="label">{ENCHINTL['modal']['workspace']['description-label'][intl]}</Text>
                    <TextArea
                        value={description}
                        rows={5}
                        onChange={e => handlerDescriptionChange(e.target.value)}
                        placeholder={ENCHINTL['modal']['workspace']['description-textarea-holder'][intl]}
                    />
                </Flex>
                <Flex justify="end" gap="2">
                    <Button radius='full' color="indigo" onClick={handlerSubmitClick}>
                        {ENCHINTL['modal']['workspace']['button']['submit'][intl]}
                    </Button>
                    <Dialog.Close>
                        <Button radius='full' color="gray" onClick={handlerVisibleChange}>
                            {ENCHINTL['modal']['workspace']['button']['close'][intl]}
                        </Button>
                    </Dialog.Close>
                </Flex>

            </Dialog.Content>
        </Dialog.Root>
    )
}

export default WorkSpaceModal