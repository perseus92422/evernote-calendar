import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import {
    Flex,
    Text,
    Dialog,
    Button,
    TextField,
    TextArea,
} from "@radix-ui/themes";
import { toast } from "react-toastify";
import Message from "../common/message";
import { useAppDispatch } from "@/app/redux/hook";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { createTask, updateTask } from "@/app/api/todolist.api";
import { TODOLIST_MODAL_TYPE } from "@/app/const";
import {
    NewTaskDTO,
    UpdateTaskDTO,
    TaskDTO
} from "@/app/type";
import { eraseStorage } from "@/app/helper";
import { setUserProps } from "@/app/features/calendar.slice";

const TodoListModal = (
    {
        intl,
        type,
        isShow,
        activeDate,
        task,
        setShowModal,
        setShowDateBar,
    }:
        {
            intl: number;
            type: TODOLIST_MODAL_TYPE;
            isShow: boolean;
            activeDate: string;
            task?: TaskDTO;
            setShowModal: (arg: boolean) => void;
            setShowDateBar: (arg: boolean) => void;
        }
) => {

    const token = localStorage.getItem('token');
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [title, setTitle] = useState<string>(task ? task.title : "");
    const [description, setDescription] = useState<string>(task ? task.description : "");
    const [startTime, setStartTime] = useState<string>(task ? task.startTime : "");
    const [endTime, setEndTime] = useState<string>(task ? task.endTime : "");


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
        if (type == TODOLIST_MODAL_TYPE.Create) {
            let payload: NewTaskDTO = {
                title,
                description,
                dueDate: activeDate,
                startTime,
                endTime
            }
            const res = await createTask(payload, token);
            if (res.status && res.status < 400) {
                toast.success(ENCHINTL['toast']['todolist']['create-success'][intl]);
            } else {
                const err = res as AxiosError;
                if (err.response.status == 401)
                    toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
        if (type == TODOLIST_MODAL_TYPE.Update) {
            let payload: UpdateTaskDTO = {};
            if (task.title != title)
                payload.title = title;
            if (task.description != description)
                payload.description = description;
            if (task.startTime != startTime)
                payload.startTime = startTime;
            if (task.endTime != endTime)
                payload.endTime = endTime;
            const res = await updateTask(task.id, payload, token);
            if (res.status && res.status < 400) {
                toast.success(ENCHINTL['toast']['todolist']['update-success'][intl]);
            } else {
                const err = res as AxiosError;
                if (err.response.status == 401)
                    toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
        initState();
    }

    const initState = () => {
        setError("");
        setTitle("");
        setDescription("");
        setStartTime("");
        setEndTime("");
        setVisible(false);
        setShowModal(false);
        setShowDateBar(false);
    }

    const signOutAction = () => {
        eraseStorage();
        dispatch(setUserProps(null));
        router.push('/auth/signin');
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
                    <Flex gap="2">
                        <Text as="p">{ENCHINTL['modal']['todolist']['start-time-p'][intl]}</Text>
                        <input type="time" value={startTime} onChange={(e) => handlerStartTimeChange(e.target.value)} />
                    </Flex>
                    <Flex gap="2">
                        <Text as="p">{ENCHINTL['modal']['todolist']['end-time-p'][intl]}</Text>
                        <input type="time" value={endTime} onChange={(e) => handlerEndTimeChange(e.target.value)} />
                    </Flex>
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