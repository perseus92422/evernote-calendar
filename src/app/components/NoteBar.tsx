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

const NoteBar = () => {

    const html = `<p style="color:'red';">test</p>`

    return (
        <Flex direction="column" pt="1" pb="1" className="w-full rounded-[4px] border-2 px-2 py-2 border-[#00c7fe83] my-1">
            <Flex direction="row" justify="end" gap="2" py="1">
                <Pencil1Icon className="cursor-pointer" width="20" height="20" />
                <TrashIcon className="cursor-pointer" width="20" height="20" />
            </Flex>
            <HoverCard.Root>
                <HoverCard.Trigger>
                    <Text as="p" size="3" className="py-1"><Strong>Test of the Note</Strong> </Text>

                </HoverCard.Trigger>
                <HoverCard.Content>
                    <Flex direction="column">
                        <Text as="p" size="2" className="py-1"><Strong>Test of the </Strong></Text>
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    </Flex>

                </HoverCard.Content>
            </HoverCard.Root>
        </Flex>
    )
}

export default NoteBar;