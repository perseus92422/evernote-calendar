import {
    Flex,
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
    editable,
    removable,
    handlerEditBtnClick,
    handlerRemoveBtnClick
}: {
    note: NoteDTO;
    editable?: boolean;
    removable?: boolean;
    handlerEditBtnClick: (arg: NoteDTO) => void;
    handlerRemoveBtnClick: (id: number) => void;
}) => {

    return (
        <Flex maxHeight="250" direction="column" py="1" className="w-full rounded-[4px] border-2 px-2 py-2 border-[#00c7fe83] my-1 overflow-auto">
            <Flex direction="row" justify="end" gap="2" py="1">
                {
                    editable ? (
                        <Pencil1Icon
                            radius="full"
                            className="cursor-pointer"
                            width="20"
                            height="20"
                            onClick={() => handlerEditBtnClick(note)}
                        />
                    ) : null
                }
                {
                    removable ? (
                        <TrashIcon
                            className="cursor-pointer"
                            width="20"
                            height="20"
                            onClick={() => handlerRemoveBtnClick(note.id)}
                        />
                    ) : null
                }
            </Flex>
            <Text as="p" size="5" className="py-1"><Strong>{note.title}</Strong> </Text>
            <div dangerouslySetInnerHTML={{ __html: note.content }} />
        </Flex>
    )
}

export default NoteBar;