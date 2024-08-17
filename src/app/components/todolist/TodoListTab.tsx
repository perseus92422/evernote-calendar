import { useEffect, useState } from "react";
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
    findAllTask,
    findAllTaskByDay,
    removeTask,
} from "@/app/api";
import { TodoListDTO, TaskDTO } from "@/app/type";
import { TODOLIST_MODAL_TYPE } from "@/app/const";

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

    const [visible, setVisible] = useState<boolean>(false);
    const [allTodoList, setAllTodoList] = useState<Array<TodoListDTO>>([]);
    const [activeDateTodoList, setActiveDateTodoList] = useState<Array<TaskDTO>>([]);
    const [activeTodoList, setActiveTodoList] = useState<TaskDTO>();

    async function getAllData() {
        const { data, status } = await findAllTask();
        setAllTodoList(data);
    }

    async function getActiveDateTodoList() {
        const { status, data } = await findAllTaskByDay(activeDate);
        setActiveDateTodoList(data);
    }

    const handlerEditBtnClick = (task: TaskDTO) => {
        setVisible(true);
        setActiveTodoList(task);
    }

    async function handlerRemoveBtnClick(id: number) {
        const { data, status } = await removeTask(id);
        setShowDateBar(false);
        if (status >= 400) {

        } else {
            toast.success(ENCHINTL['toast']['todolist']['remove-success'][intl]);
        }
    }

    useEffect(() => {
        getAllData();
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
                <Button onClick={handleNewBtnClick}>{ENCHINTL['side-bar']['todolist']['new-btn'][intl]}</Button>
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