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

const ScheduleBar = (
    {
        title,
        description,
        startDate,
        endDate,
        color,
        width
    }: {
        title: string;
        description: string;
        startDate: string;
        endDate: string;
        color: string;
        width: number;
    }) => {
    return (
        <Flex direction="column" pt="3" pb="3">
            <Flex direction="column" className='w-full rounded-[2px] border-2 px-2 py-2 border-[#00c7fe83] my-1'>
                <Flex direction="row-reverse" gap="2" py="1">
                    <TrashIcon width="20" height="20" />
                    <Pencil1Icon width="20" height="20" />
                </Flex>
                <HoverCard.Root>
                    <HoverCard.Trigger>
                        <Flex direction="row">
                            <Flex className='w-1/3'>
                                <Text as="p" size="3"><Strong>{title}</Strong></Text>
                            </Flex>
                            <Flex className='w-2/3' justify="between">
                                <Text as="p" size="3">{startDate}</Text>
                                <div className={`w-1/3 border-t-[${width}px] border-[${color}] h-0`} style={{ margin: 'auto' }} />
                                <Text as="p" size="3">{endDate}</Text>
                            </Flex>
                        </Flex>
                    </HoverCard.Trigger>
                    <HoverCard.Content>
                        <Flex direction="column">
                            <Text as="p" size="3"><Strong>{title}</Strong></Text>
                            <Text as="p">{description}</Text>
                        </Flex>
                    </HoverCard.Content>
                </HoverCard.Root>

            </Flex>

        </Flex>
    )
}

export default ScheduleBar;