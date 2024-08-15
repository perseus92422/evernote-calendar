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
import { NoteDTO } from "../../type";

const NoteBar = ({
    note,
    todayFlag,
    handlerEditBtnClick,
    handlerRemoveBtnClick
}: {
    note: NoteDTO;
    todayFlag: boolean;
    handlerEditBtnClick: (arg: NoteDTO) => void;
    handlerRemoveBtnClick: (id: number) => void;
}) => {

    return (
        <Flex maxHeight="250" direction="column" pt="1" pb="1" className="w-full rounded-[4px] border-2 px-2 py-2 border-[#00c7fe83] my-1 overflow-auto">
            <Flex direction="row" justify="between" gap="2" py="1">
                <Text as="p"><Strong>{!todayFlag ? note.date : ""}</Strong></Text>
                <Flex direction="row" gap="2">
                    <Pencil1Icon
                        radius="full"
                        className="cursor-pointer"
                        width="20"
                        height="20"
                        onClick={() => handlerEditBtnClick(note)}
                    />
                    <TrashIcon
                        className="cursor-pointer"
                        width="20"
                        height="20"
                        onClick={() => handlerRemoveBtnClick(note.id)}
                    />
                </Flex>
            </Flex>
            <Text as="p" size="3" className="py-1"><Strong>{note.title}</Strong> </Text>
            <div dangerouslySetInnerHTML={{ __html: note.content }} />
        </Flex>
    )
}

export default NoteBar;