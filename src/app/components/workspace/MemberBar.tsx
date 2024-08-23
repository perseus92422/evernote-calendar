import { Flex, Text, Strong } from "@radix-ui/themes";
import { TrashIcon } from "@radix-ui/react-icons";
import { UserDTO, WorkSpaceDTO } from "@/app/type";

const MemberBar = ({
    member,
    user,
    workspace,
    handlerRemoveClick
}: {
    member: UserDTO;
    user: UserDTO;
    workspace: WorkSpaceDTO;
    handlerRemoveClick: (arg: number) => void;
}) => {
    return (
        <Flex direction="column" className="w-full border-2 rounded-[5px]" py="2" px="2">
            {
                user?.id == workspace?.ownerId ? (
                    <Flex justify="end" px="2" py="1">
                        <TrashIcon
                            className="cursor-pointer"
                            height="20"
                            width="20"
                            onClick={() => handlerRemoveClick(member.id)}
                        />
                    </Flex>
                ) : null
            }
            <Flex direction="row" className="items-center" justify="between" pt="1">
                <Flex className="rounded-full bg-[#6c9fff] h-[50px] w-[50px] justify-center items-center">
                    <Text as="p" size="6" className="text-white">
                        <Strong>
                            {member.firstName.toUpperCase()[0] + member.lastName.toUpperCase()[0]}
                        </Strong>
                    </Text>
                </Flex>
                <Text as="p" size="6">{member.firstName + " " + member.lastName}</Text>
            </Flex>
        </Flex>
    )
}

export default MemberBar;