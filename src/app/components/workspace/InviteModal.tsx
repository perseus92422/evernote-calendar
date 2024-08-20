import { useState } from "react";
import {
    Dialog,
    Flex,
    Button,
    Text,
    TextField
} from "@radix-ui/themes";
import Message from "../common/message";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { inviteToWorkSpace } from "@/app/api";
import { WorkSpaceDTO } from "@/app/type";


const InviteModal = ({
    intl,
    workspace,
    setShow,
    invitePeople
}: {
    intl: number;
    workspace: WorkSpaceDTO,
    setShow: (arg: boolean) => void;
    invitePeople: () => void;
}) => {

    const [visible, setVisible] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const handlerSubmitClick = () => {
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
            setError(ENCHINTL['error']['workspace']['invite']['invalid-email'][intl]);
            return;
        }
        invitePeople();
        setEmail("");
        setVisible(false);
        setShow(false);
    }

    const handlerVisibleChange = () => {
        setVisible(false);
        setShow(false);
    }

    const handlerEmailChange = (value: string) => {
        setEmail(value);
    }

    return (
        <Dialog.Root open={visible} onOpenChange={handlerVisibleChange}>
            <Dialog.Content>
                <Dialog.Title>
                    {ENCHINTL['modal']['inivte']['title-d'][intl]}
                </Dialog.Title>
                <Dialog.Description>
                </Dialog.Description>
                {error ? (<Message message={error} />) : null}
                <Flex direction="column" gap="1" py="2">
                    <Text as="label">Email</Text>
                    <TextField.Root
                        type="email"
                        value={email}
                        placeholder="example@gmail.com"
                        onChange={(e) => handlerEmailChange(e.target.value)}
                    />
                </Flex>
                <Flex justify="end" gap="2">
                    <Button radius="full" color="indigo" variant="soft" onClick={handlerSubmitClick}>
                        {ENCHINTL['modal']['inivte']['button']['submit'][intl]}
                    </Button>
                    <Dialog.Close>
                        <Button radius="full" color="gray" onClick={handlerVisibleChange}>
                            {ENCHINTL['modal']['inivte']['button']['close'][intl]}
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default InviteModal;