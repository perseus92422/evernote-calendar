import { useEffect, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import {
    Flex,
    Button,
    Text,
    Strong
} from "@radix-ui/themes";
import { toast } from "react-toastify";
import TodoListBar from "./TodoListBar";
import TodoListModal from "./TodoListModal";
import ENCHINTL from '@/app/lang/EN-CH.json';
import {
    createTask,
    updateTask,
    findAllTaskByDay,
    removeTask,
} from "@/app/api";
import {
    NewTaskDTO,
    UpdateTaskDTO,
    TaskDTO
} from "@/app/type";
import { MODAL_TYPE, PUBLIC_TYPE } from "@/app/const";


const TodoListTab = (
    {
        intl,
        token,
        activeDate,
        signOutAction
    }: {
        intl: number;
        token: string;
        activeDate: string;
        signOutAction: () => void;
    }
) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<MODAL_TYPE>(null);
    const [privateTodoList, setPrivateTodoList] = useState<Array<TaskDTO>>([]);
    const [workspaceTodoList, setWorkSpaceTodoList] = useState<Array<TaskDTO>>([]);
    const [activeTask, setActiveTask] = useState<TaskDTO>();

    const handlerNewBtnClick = () => {
        setModalType(MODAL_TYPE.Create);
        setActiveTask(null);
        setVisible(true);
    }

    const handlerEditBtnClick = (task: TaskDTO) => {
        setModalType(MODAL_TYPE.Update);
        setActiveTask(task);
        setVisible(true);
    }

    async function handlerCreateTask(payload: NewTaskDTO) {
        const res = await createTask(payload, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setPrivateTodoList([result.data, ...privateTodoList]);
            toast.error(ENCHINTL['toast']['todolist']['create-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerUpdateTask(payload: UpdateTaskDTO) {
        const res = await updateTask(activeTask.id, payload, token);
        if (res.status && res.status < 400) {
            const tmpTodoList = [...privateTodoList];
            const update = tmpTodoList.find(
                a => a.id === activeTask.id
            );
            Object.keys(payload).map(v => {
                update[v] = payload[v];
            })
            setPrivateTodoList(tmpTodoList);
            toast.error(ENCHINTL['toast']['todolist']['update-success'][intl]);
        } else {
            const err = res as AxiosError;
            console.log(err);
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerFindAllPrivateTodoList() {
        const res = await findAllTaskByDay(activeDate, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setPrivateTodoList([...result.data]);
        } else {
            const err = res as AxiosError;
            console.log(err);
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerFindAllWorkSpaceTodoList() {

    }



    async function handlerRemoveBtnClick(id: number) {
        const res = await removeTask(id, token);
        if (res.status && res.status < 400) {
            setPrivateTodoList(privateTodoList.filter(
                a => a.id !== activeTask.id
            ));
            toast.success(ENCHINTL['toast']['todolist']['remove-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    useEffect(() => {
        handlerFindAllPrivateTodoList();
    }, [activeDate])

    return (
        <div>
            {
                visible ? (
                    <TodoListModal
                        intl={intl}
                        type={modalType}
                        publicMode={PUBLIC_TYPE.Private}
                        activeDate={activeDate}
                        setShowModal={setVisible}
                        createTask={handlerCreateTask}
                        updateTask={handlerUpdateTask}
                        task={activeTask}
                    />
                ) : null
            }
            <Flex justify="end">
                <Button color="cyan" variant="soft" onClick={handlerNewBtnClick}>{ENCHINTL['side-bar']['todolist']['new-btn'][intl]}</Button>
            </Flex>
            <Text as='p' size="5" className="py-2"><Strong>{ENCHINTL['side-bar']['todolist']['personal-todolist-p'][intl]}</Strong></Text>
            <Flex direction="column" px="2">
                {
                    privateTodoList.map((v, i) => (
                        <TodoListBar
                            key={i}
                            task={v}
                            handlerEditBtnClick={handlerEditBtnClick}
                            handlerRemoveBtnClick={handlerRemoveBtnClick}
                        />
                    ))
                }
            </Flex>
            <Text as='p' size="5" className="py-2"><Strong>{ENCHINTL['side-bar']['todolist']['workspace-todolist-p'][intl]}</Strong></Text>
        </div>
    )
}

export default TodoListTab;