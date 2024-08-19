import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError, AxiosResponse } from "axios";
import { Flex, Dialog, Button, Text, TextField, TextArea } from "@radix-ui/themes";
import Message from "../common/message";
import { useAppDispatch } from "@/app/redux/hook";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { WORKSPACE_MODAL_TYPE } from "@/app/const";
import { eraseStorage } from "@/app/helper";
import { setUserProps } from "@/app/features/calendar.slice";
import { NewWorkSpaceDTO, UpdateWorkSpaceDTO, WorkSpaceDTO } from "@/app/type";
import { createWorkSpace, updateWorkSpace } from "@/app/api";
import { toast } from "react-toastify";

const WorkSpaceModal = (
    {
        intl,
        type,
        show,
        workspace,
        workSpaceList,
        setShow,
        setWorkSpaceList
    }: {
        intl: number;
        type: WORKSPACE_MODAL_TYPE;
        show: boolean;
        workspace?: WorkSpaceDTO;
        workSpaceList: WorkSpaceDTO[];
        setShow: (arg: boolean) => void;
        setWorkSpaceList: (arg: WorkSpaceDTO[]) => void;
    }
) => {

    const token = localStorage.getItem('token');
    const router = useRouter();
    const dispatch = useAppDispatch();
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
            let payload: NewWorkSpaceDTO = {
                title,
                description
            }
            const res = await createWorkSpace(payload, token);
            if (res.status && res.status < 400) {
                const result = res as AxiosResponse;
                setWorkSpaceList([result.data, ...workSpaceList])
                toast.success(ENCHINTL['toast']['workspace']['create-success'][intl]);
            } else {
                const err = res as AxiosError;
                if (err.response.status == 401) {
                    toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                    signOutAction();
                }
            }
        }
        if (type == WORKSPACE_MODAL_TYPE.Update) {
            let payload: UpdateWorkSpaceDTO = {};
            if (title != workspace.title)
                payload.title = title;
            if (description != workspace.description)
                payload.description = description;
            console.log("payload ", payload)
            const res = await updateWorkSpace(workspace.id, payload, token);
            if (res.status && res.status < 400) {
                const tmpWorkSpaceList = [...workSpaceList];
                const update = tmpWorkSpaceList.find(
                    a => a.id === workspace.id
                );
                update.title = title;
                update.description = description;
                setWorkSpaceList(tmpWorkSpaceList);
                toast.success(ENCHINTL['toast']['workspace']['update-success'][intl]);
            } else {
                const err = res as AxiosError;
                if (err.response.status == 401) {
                    toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                    signOutAction();
                }
            }
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

    const signOutAction = () => {
        eraseStorage();
        dispatch(setUserProps(null));
        router.push('/auth/signin');
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