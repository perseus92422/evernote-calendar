import { useState, useEffect } from "react";
import { AxiosResponse, AxiosError } from 'axios';
import { Flex, Button, Text, Strong } from "@radix-ui/themes";
import { toast } from "react-toastify";
import TodoListModal from "../todolist/TodoListModal";
import TodoListBar from "../todolist/TodoListBar";
import { MODAL_TYPE, PUBLIC_TYPE } from "@/app/const";
import {
    NewTaskDTO,
    UpdateTaskDTO,
    TaskDTO,
    WorkSpaceDTO,
    WorkSpaceTodoListDTO,
    UserDTO
} from "@/app/type";
import {
    createTask,
    updateTask,
    removeTask,
    findAllTodoListOnWorkSpace
} from "@/app/api";
import ENCHINTL from '@/app/lang/EN-CH.json';

const WorkSpaceTodoListTab = (
    {
        intl,
        user,
        token,
        workspace,
        signOutAction
    }: {
        intl: number;
        user: UserDTO;
        token: string;
        workspace: WorkSpaceDTO;
        signOutAction: () => void;
    }
) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<MODAL_TYPE>(null);
    const [todoListByDay, setTodoListByDay] = useState<Array<WorkSpaceTodoListDTO>>([]);
    const [activeTask, setActiveTask] = useState<TaskDTO>(null);
    const [todoList, setTodoList] = useState<Array<TaskDTO>>([]);

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
            const todoListUpdate = tmpTodoList.find(
                a => a.id === activeTask.id
            );
            Object.keys(payload).map(v => todoListUpdate[v] = payload[v]);
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
    }, []);

    useEffect(() => {
        const result: Array<WorkSpaceTodoListDTO> = [];
        let tmpTodoList: Array<TaskDTO> = [];
        if (todoList.length > 0) {
            let dueDate = todoList[0].dueDate;
            todoList.map((task) => {
                if (task.dueDate == dueDate) {
                    tmpTodoList.push(task);
                } else {
                    result.push({
                        dueDate,
                        todolist: tmpTodoList
                    });
                    dueDate = task.dueDate;
                    tmpTodoList = [];
                    tmpTodoList.push(task);
                }
            });
            result.push({
                dueDate,
                todolist: tmpTodoList
            });
            setTodoListByDay(result);
        }
    }, [todoList])

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
                    todoListByDay.map((v, i) => (
                        <div key={i}>
                            <Text as="p" size="5"> <Strong>{v.dueDate}</Strong></Text>
                            <Flex direction="column">
                                {v.todolist.map((task, j) => (
                                    <TodoListBar
                                        key={j}
                                        editable={user?.id == task.ownerId ? true : false}
                                        removable={user?.id == task.ownerId ? true : false}
                                        task={task}
                                        handlerEditBtnClick={handlerEditBtnClick}
                                        handlerRemoveBtnClick={handlerRemoveBtnClick}
                                    />
                                ))}
                            </Flex>
                        </div>
                    ))
                }
            </Flex>
        </div>
    )
}

export default WorkSpaceTodoListTab;