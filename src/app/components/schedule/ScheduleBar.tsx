import {
    Flex,
    HoverCard,
    Text,
    Strong
} from "@radix-ui/themes";
import {
    TrashIcon,
    Pencil1Icon
} from "@radix-ui/react-icons";
import { ScheduleDTO, ScheduleTypesDTO } from "../../type";
import ENCHINTL from '@/app/lang/EN-CH.json';

const ScheduleBar = (
    {
        schedule,
        intl,
        handlerEditBtn,
        handlerRemoveBtn
    }: {
        schedule: ScheduleDTO;
        intl: number;
        handlerEditBtn: (arg: ScheduleDTO) => void;
        handlerRemoveBtn: (arg: number) => void;
    }) => {

    return (
        <Flex direction="column" pt="1" pb="1" className='w-full rounded-[4px] border-2 px-2 py-2 border-[#00c7fe83] my-1'>
            <Flex direction="row" justify="between" gap="2" py="1">
                <Text as="p"><Strong>{ENCHINTL['modal']['schedule']['types'][schedule.type as keyof ScheduleTypesDTO][intl]}</Strong></Text>
                <Flex direction="row" gap="2">
                    <Pencil1Icon
                        className="cursor-pointer"
                        width="20"
                        height="20"
                        onClick={() => handlerEditBtn(schedule)}
                    />
                    <TrashIcon
                        className="cursor-pointer"
                        width="20"
                        height="20"
                        onClick={() => handlerRemoveBtn(schedule.id)}
                    />
                </Flex>
            </Flex>
            <HoverCard.Root>
                <HoverCard.Trigger>
                    <Flex direction="row">
                        <Flex className='w-1/3'>
                            <Text as="p" size="3"><Strong>{schedule.title}</Strong></Text>
                        </Flex>
                        <Flex className='w-2/3' justify="between">
                            <Text as="p" size="3">{schedule.startDate}</Text>
                            <div
                                className="w-1/3 m-auto h-0"
                                style={{
                                    borderTopWidth: schedule.width,
                                    borderColor: schedule.color
                                }}
                            />
                            <Text as="p" size="3">{schedule.endDate}</Text>
                        </Flex>
                    </Flex>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <Flex direction="column">
                        <Text as="p" size="3"><Strong>{schedule.title}</Strong></Text>
                        <Text as="p">{schedule.description}</Text>
                    </Flex>
                </HoverCard.Content>
            </HoverCard.Root>
        </Flex>
    )
}

export default ScheduleBar;