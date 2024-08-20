import { useState } from "react";
import {
    Flex,
    Dialog,
    Button,
    Text,
    TextField,
    TextArea
} from "@radix-ui/themes";
import Message from "../common/message";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { MODAL_TYPE } from "@/app/const";
import {
    NewWorkSpaceDTO,
    UpdateWorkSpaceDTO,
    WorkSpaceDTO
} from "@/app/type";


const WorkSpaceModal = (
    {
        intl,
        type,
        workspace,
        setShow,
        createWorkSpace,
        updateWorkSpace
    }: {
        intl: number;
        type: MODAL_TYPE;
        workspace?: WorkSpaceDTO;
        setShow: (arg: boolean) => void;
        createWorkSpace: (payload: NewWorkSpaceDTO) => void;
        updateWorkSpace: (payload: UpdateWorkSpaceDTO) => void;
    }
) => {

    const [visible, setVisible] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [title, setTitle] = useState<string>(workspace ? workspace.title : "");
    const [description, setDescription] = useState<string>(workspace ? workspace.description : "");

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

    const handlerSubmitClick = () => {
        if (!title) {
            setError(ENCHINTL['error']['workspace']['empty-title'][intl]);
            return;
        }
        if (!description) {
            setError(ENCHINTL['error']['workspace']['empty-description'][intl]);
            return;
        }
        if (type === MODAL_TYPE.Create) {
            let payload: NewWorkSpaceDTO = {
                title,
                description
            }
            createWorkSpace(payload);
        }
        if (type == MODAL_TYPE.Update) {
            let payload: UpdateWorkSpaceDTO = {};
            if (title != workspace.title)
                payload.title = title;
            if (description != workspace.description)
                payload.description = description;
            updateWorkSpace(payload);
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
                    {type == MODAL_TYPE.Create ? ENCHINTL['modal']['workspace']['title-d']['create'][intl] : null}
                    {type == MODAL_TYPE.Update ? ENCHINTL['modal']['workspace']['title-d']['update'][intl] : null}
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