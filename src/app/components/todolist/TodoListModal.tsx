import { useState } from "react";
import {
    Flex,
    Text,
    Dialog,
    Button,
    TextField,
    TextArea,
} from "@radix-ui/themes";
import DatePicker from "react-datepicker";
import Message from "../common/message";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { MODAL_TYPE, PUBLIC_TYPE, CALENDAR_LOCALES } from "@/app/const";
import { TaskDTO, NewTaskDTO, UpdateTaskDTO } from "@/app/type";
import { dateToYYYYMMDDF } from "@/app/helper";

const TodoListModal = (
    {
        intl,
        type,
        publicMode,
        activeDate,
        task,
        workspaceId,
        setShowModal,
        createTask,
        updateTask
    }:
        {
            intl: number;
            type: MODAL_TYPE;
            publicMode: PUBLIC_TYPE
            activeDate?: string;
            task?: TaskDTO;
            workspaceId?: number;
            setShowModal: (arg: boolean) => void;
            createTask: (payload: NewTaskDTO) => void;
            updateTask: (payload: UpdateTaskDTO) => void;
        }
) => {

    const [visible, setVisible] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [title, setTitle] = useState<string>(task ? task.title : "");
    const [description, setDescription] = useState<string>(task ? task.description : "");
    const [startTime, setStartTime] = useState<string>(task ? task.startTime : "");
    const [endTime, setEndTime] = useState<string>(task ? task.endTime : "");
    const [dueDate, setDueDate] = useState<Date>(task ? new Date(task.dueDate) : new Date());

    const handlerModalShow = () => {
        setVisible(false);
        setShowModal(false);
    }

    const handlerTitleChange = (value: string) => {
        setTitle(value);
    }

    const handlerDescriptionChange = (value: string) => {
        setDescription(value);
    }

    const handlerDueDateChange = (date: Date) => {
        setDueDate(date);
    }

    const handlerStartTimeChange = (value: string) => {
        setStartTime(value);
    }

    const handlerEndTimeChange = (value: string) => {
        setEndTime(value);
    }

    const handlerSubmitClick = () => {
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
        if (type == MODAL_TYPE.Create) {
            let payload: NewTaskDTO = {
                title,
                description,
                dueDate: dateToYYYYMMDDF(dueDate),
                startTime,
                endTime
            }
            if (workspaceId && publicMode == PUBLIC_TYPE.WorkSpace)
                payload.workspaceId = workspaceId;
            createTask(payload);
        }
        if (type == MODAL_TYPE.Update) {
            let payload: UpdateTaskDTO = {};
            if (task.title != title)
                payload.title = title;
            if (task.description != description)
                payload.description = description;
            if (task.startTime != startTime)
                payload.startTime = startTime;
            if (task.endTime != endTime)
                payload.endTime = endTime;
            updateTask(payload);
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
    }

    return (
        <Dialog.Root open={visible} onOpenChange={handlerModalShow}>
            <Dialog.Content>
                <Dialog.Title>
                    {type == MODAL_TYPE.Create ? ENCHINTL['modal']['todolist']['title-d']['create'][intl] : null}
                    {type == MODAL_TYPE.Update ? ENCHINTL['modal']['todolist']['title-d']['update'][intl] : null}
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
                        onChange={e => handlerTitleChange(e.target.value)}
                    />
                </Flex>
                <Flex direction="column" py="2" gap="1">
                    <Text as="p">{ENCHINTL['modal']['todolist']['description-p'][intl]}</Text>
                    <TextArea
                        value={description}
                        rows={5}
                        placeholder={ENCHINTL['modal']['todolist']['description-textarea-holder'][intl]}
                        onChange={(e) => handlerDescriptionChange(e.target.value)}
                    />
                </Flex>
                <Flex direction="row" justify="between" py="2">
                    <Text as="p">{ENCHINTL['modal']['todolist']['due-date-p'][intl]}</Text>
                    <DatePicker
                        locale={CALENDAR_LOCALES[intl]}
                        selected={dueDate}
                        onChange={(date: Date) => handlerDueDateChange(date)}
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
                            onClick={handlerModalShow}
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