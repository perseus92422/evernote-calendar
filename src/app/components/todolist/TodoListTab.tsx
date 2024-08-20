import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useAppDispatch } from "@/app/redux/hook";
import ENCHINTL from '@/app/lang/EN-CH.json';
import {
    findAllTask,
    findAllTaskByDay,
    removeTask,
} from "@/app/api";
import { TodoListDTO, TaskDTO } from "@/app/type";
import { TODOLIST_MODAL_TYPE } from "@/app/const";
import { setUserProps } from "@/app/features/calendar.slice";
import { eraseStorage } from "@/app/helper";

const TodoListTab = (
    {
        intl,
        activeDate,
        handleNewBtnClick,
        setShowDateBar
    }: {
        intl: number;
        activeDate: string;
        handleNewBtnClick: () => void;
        setShowDateBar: (arg: boolean) => void;
    }
) => {

    const token = localStorage.getItem('token');
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [visible, setVisible] = useState<boolean>(false);
    const [allTodoList, setAllTodoList] = useState<Array<TodoListDTO>>([]);
    const [activeDateTodoList, setActiveDateTodoList] = useState<Array<TaskDTO>>([]);
    const [activeTodoList, setActiveTodoList] = useState<TaskDTO>();

    async function getAllData() {
        const res = await findAllTask(token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setAllTodoList([...result.data]);
        } else {
            const err = res as AxiosError;
            console.log(err);
            if (err.response.status == 401)
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    async function getActiveDateTodoList() {
        const res = await findAllTaskByDay(activeDate, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setActiveDateTodoList([...result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    const handlerEditBtnClick = (task: TaskDTO) => {
        setVisible(true);
        setActiveTodoList(task);
    }

    async function handlerRemoveBtnClick(id: number) {
        const res = await removeTask(id, token);
        setShowDateBar(false);
        if (res.status && res.status < 400) {
            toast.success(ENCHINTL['toast']['todolist']['remove-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    const signOutAction = () => {
        eraseStorage();
        dispatch(setUserProps(null));
        router.push('/auth/signin');
    }


    useEffect(() => {
        // getAllData();
    }, [])

    useEffect(() => {
        getActiveDateTodoList();
    }, [activeDate])

    return (
        <div>
            {
                visible ? (
                    <TodoListModal
                        intl={intl}
                        type={TODOLIST_MODAL_TYPE.Update}
                        activeDate={activeDate}
                        isShow={visible}
                        setShowModal={setVisible}
                        setShowDateBar={setShowDateBar}
                        task={activeTodoList}
                    />
                ) : null
            }
            <Flex justify="end">
                <Button color="cyan" variant="soft" onClick={handleNewBtnClick}>{ENCHINTL['side-bar']['todolist']['new-btn'][intl]}</Button>
            </Flex>
            <Text as='p' size="4"><Strong>{activeDate}</Strong></Text>
            <Flex direction="column" px="2">
                {
                    activeDateTodoList.map((v, i) => (
                        <TodoListBar
                            key={i}
                            task={v}
                            handlerEditBtnClick={handlerEditBtnClick}
                            handlerRemoveBtnClick={handlerRemoveBtnClick}
                        />
                    ))
                }
            </Flex>
            <Text as='p' size="4"><Strong>{ENCHINTL['side-bar']['todolist']['all-p'][intl]}</Strong></Text>
            {
                allTodoList.map((v, i) => (
                    <Flex direction="column" key={i}>
                        <Text as="p"><Strong>{v.date}</Strong></Text>
                        <Flex direction="column" px="2">
                            {
                                v.todolist.map((t, j) => (
                                    <TodoListBar
                                        key={j}
                                        task={t}
                                        handlerEditBtnClick={handlerEditBtnClick}
                                        handlerRemoveBtnClick={handlerRemoveBtnClick}
                                    />
                                ))
                            }
                        </Flex>
                    </Flex>
                ))
            }
        </div>
    )
}

export default TodoListTab;