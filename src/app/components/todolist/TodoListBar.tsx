import {
    Flex,
    Strong,
    Text,
    HoverCard
} from "@radix-ui/themes";
import {
    TrashIcon,
    Pencil1Icon,
    ClockIcon
} from "@radix-ui/react-icons";
import { TaskDTO } from "@/app/type";

const TodoListBar = (
    {
        task,
        editable,
        removable,
        handlerEditBtnClick,
        handlerRemoveBtnClick,
    }: {
        task: TaskDTO;
        editable: boolean;
        removable: boolean;
        handlerEditBtnClick: (arg: TaskDTO) => void;
        handlerRemoveBtnClick: (arg: number) => void;
    }
) => {
    return (
        <Flex direction="column" py="1" className="w-full rounded-[4px] border-2 px-2 py-2 border-[#00c7fe83] my-1">
            <Flex direction="row" justify="end" gap="2" py="1">
                {
                    editable ? (
                        <Pencil1Icon
                            className="cursor-pointer"
                            height="20"
                            width="20"
                            onClick={() => handlerEditBtnClick(task)}
                        />
                    ) : null
                }
                {
                    removable ? (
                        <TrashIcon
                            className="cursor-pointer"
                            height="20"
                            width="20"
                            onClick={() => handlerRemoveBtnClick(task.id)}
                        />
                    ) : null
                }
            </Flex>
            <HoverCard.Root>
                <HoverCard.Trigger>
                    <Flex>
                        <Flex className="w-1/2">
                            <Text as="p"><Strong>{task.title}</Strong></Text>
                        </Flex>
                        <Flex justify="end" className="w-1/2" gap="5">
                            <Flex gap="1">
                                <ClockIcon height="20" width="20" />
                                <Text as="p">{task.startTime}</Text>
                            </Flex>
                            ~
                            <Flex gap="1">
                                <ClockIcon height="20" width="20" />
                                <Text as="p">{task.endTime}</Text>
                            </Flex>
                        </Flex>
                    </Flex>

                </HoverCard.Trigger>
                <HoverCard.Content>
                    <Text>{task.description}</Text>
                </HoverCard.Content>
            </HoverCard.Root>

        </Flex>
    )
}

export default TodoListBar;