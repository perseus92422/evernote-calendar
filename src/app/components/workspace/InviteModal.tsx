import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    Flex,
    Button,
    Text,
    TextField
} from "@radix-ui/themes";
import { useAppDispatch } from "@/app/redux/hook";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { eraseStorage } from "@/app/helper";
import { inviteToWorkSpace } from "@/app/api";
import { WorkSpaceDTO } from "@/app/type";
import { toast } from "react-toastify";


const InviteModal = ({
    intl,
    show,
    workspace,
    setShow
}: {
    intl: number;
    show: boolean;
    workspace: WorkSpaceDTO,
    setShow: (arg: boolean) => void;
}) => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const [visible, setVisible] = useState<boolean>(true);
    const [email, setEmail] = useState<string>("");

    async function handlerSubmitClick() {
        const res = await inviteToWorkSpace(workspace.id, email, token);
        if (res.status && res.status < 400)
            toast.success(ENCHINTL['toast']['invite']['invite-success'][intl]);
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