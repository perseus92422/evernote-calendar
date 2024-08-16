import { useEffect, useState } from "react";
import {
    Flex,
    Button,
    Text,
    Strong
} from "@radix-ui/themes";
import { toast } from "react-toastify";
import ENCHINTL from '@/app/lang/EN-CH.json';

const TodoListTab = (
    {
        intl,
        activeDate,
        handleNewBtnClick
    }: {
        intl: number;
        activeDate: string;
        handleNewBtnClick: () => void;
    }
) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [allTodoList, setAllTodoList] = useState([]);
    const [todayTodoList, setTodayTodoList] = useState([]);
    const [activeTodoList, setActiveTodoList] = useState([]);

    return (
        <div>
            <Flex justify="end">
                <Button onClick={handleNewBtnClick}>{ENCHINTL['side-bar']['todolist']['new-btn'][intl]}</Button>
            </Flex>
            <Text as='p' size="4"><Strong>{activeDate}</Strong></Text>
            <Text as='p' size="4"><Strong>{ENCHINTL['side-bar']['todolist']['all-p'][intl]}</Strong></Text>
        </div>
    )
}

export default TodoListTab;