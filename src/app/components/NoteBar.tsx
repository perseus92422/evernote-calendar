import { useEffect } from "react";
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
import { NoteDTO } from "../type";

const NoteBar = ({
    note,
    todayFlag,
    handlerEditBtnClick,
    handlerRemoveBtnClick
}: {
    note: NoteDTO;
    todayFlag: boolean;
    handlerEditBtnClick: () => void;
    handlerRemoveBtnClick: (id: number) => void;
}) => {

    return (
        <Flex direction="column" pt="1" pb="1" className="w-full rounded-[4px] border-2 px-2 py-2 border-[#00c7fe83] my-1">
            <Flex direction="row" justify="between" gap="2" py="1">
                {
                    !todayFlag ? (
                        <Text as="p"><Strong>{note.date}</Strong></Text>
                    ) : null
                }
                <Flex>
                    <Pencil1Icon
                        className="cursor-pointer"
                        width="20"
                        height="20"
                        onClick={handlerEditBtnClick}
                    />
                    <TrashIcon
                        className="cursor-pointer"
                        width="20"
                        height="20"
                        onClick={() => handlerRemoveBtnClick(note.id)}
                    />
                </Flex>
            </Flex>
            <HoverCard.Root>
                <HoverCard.Trigger>
                    <Text as="p" size="3" className="py-1"><Strong>Test of the Note</Strong> </Text>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <Flex direction="column">
                        <Text as="p" size="2" className="py-1"><Strong>Test of the </Strong></Text>
                    </Flex>
                </HoverCard.Content>
            </HoverCard.Root>
        </Flex>
    )
}

export default NoteBar;