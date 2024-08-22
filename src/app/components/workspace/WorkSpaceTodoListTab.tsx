import { useState, useEffect } from "react";
import { AxiosResponse, AxiosError } from 'axios';
import { Flex, Button } from "@radix-ui/themes";
import { toast } from "react-toastify";
import { MODAL_TYPE, PUBLIC_TYPE } from "@/app/const";
import { NewTaskDTO, UpdateTaskDTO, TaskDTO, WorkSpaceDTO } from "@/app/type";
import {
    createTask,
    updateTask,
    removeTask,
    findAllTodoListOnWorkSpace
} from "@/app/api";
import ENCHINTL from '@/app/lang/EN-CH.json';
import TodoListModal from "../todolist/TodoListModal";
import TodoListBar from "../todolist/TodoListBar";

const WorkSpaceTodoListTab = (
    {
        intl,
        token,
        workspace,
        signOutAction
    }: {
        intl: number;
        token: string;
        workspace: WorkSpaceDTO;
        signOutAction: () => void;
    }
) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<MODAL_TYPE>(null);
    const [todoList, setTodoList] = useState<Array<TaskDTO>>([]);
    const [activeTask, setActiveTask] = useState<TaskDTO>(null);

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

    async function handlerCreateTaskOnWorkSpace(payload: NewTaskDTO) {
        const res = await createTask(payload, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setTodoList([result.data, ...todoList]);
            toast.success(ENCHINTL['toast']['todolist']['create-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]); signOutAction();
            }
        }
    }

    async function handlerUpdateTask(payload: UpdateTaskDTO) {
        const res = await updateTask(activeTask.id, payload, token);
        if (res.status && res.status < 400) {
            const tmpTodoList = [...todoList];
            const update = tmpTodoList.find(
                a => a.id === activeTask.id
            );
            Object.keys(payload).map(v => update[v] = payload[v]);
            setTodoList(tmpTodoList);
            toast.success(ENCHINTL['toast']['todolist']['update-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]); signOutAction();
            }
        }
    }

    async function handlerFindAllTodoListonWorkSpace() {
        const res = await findAllTodoListOnWorkSpace(workspace.id, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setTodoList([...result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]); signOutAction();
            }
        }
    }

    async function handlerRemoveBtnClick(id: number) {
        const res = await removeTask(id, token);
        if (res.status && res.status < 400) {
            setTodoList(todoList.filter(
                a => a.id !== id
            ));
            toast.success(ENCHINTL['toast']['todolist']['remove-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]); signOutAction();
            }
        }
    }

    useEffect(() => {
        handlerFindAllTodoListonWorkSpace();
    }, [])

    return (
        <div>
            {
                visible ? (
                    <TodoListModal
                        intl={intl}
                        type={modalType}
                        publicMode={PUBLIC_TYPE.WorkSpace}
                        workspaceId={workspace.id}
                        task={activeTask}
                        createTask={handlerCreateTaskOnWorkSpace}
                        updateTask={handlerUpdateTask}
                        setShowModal={setVisible}
                    />
                ) : null
            }
            <Flex justify="end" px="2" py="3" >
                <Button color="cyan" variant="soft" onClick={handlerNewBtnClick}>{ENCHINTL['workspace']['side-bar']['todolist']['new-btn'][intl]}</Button>
            </Flex>
            <Flex direction="column" px="2" >
                {
                    todoList.map((v, i) => (
                        <TodoListBar
                            key={i}
                            task={v}
                            handlerEditBtnClick={handlerEditBtnClick}
                            handlerRemoveBtnClick={handlerRemoveBtnClick}
                        />
                    ))
                }
            </Flex>
        </div>
    )
}

export default WorkSpaceTodoListTab;