import { useState, useEffect } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Flex, Button } from "@radix-ui/themes";
import { toast } from "react-toastify";
import InviteModal from "./InviteModal";
import {
    WorkSpaceDTO,
    WorkSpaceMemberDTO,
    ExceptionDTO
} from "@/app/type";
import {
    findAllMembersOnWorkSpace,
    inviteToWorkSpace,
    removeInvite,
} from "@/app/api";
import ENCHINTL from '@/app/lang/EN-CH.json';

const WorkSpaceMemberTab = (
    {
        intl,
        token,
        workspace,
        signOutAction
    }: {
        intl: number;
        token: string;
        workspace: WorkSpaceDTO;
        signOutAction: () => void;
    }
) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [members, setMembers] = useState<Array<WorkSpaceMemberDTO>>([]);

    const handlerNewBtnClick = () => {
        setVisible(true);
    }

    async function handlerInvitePeople(email: string) {
        const res = await inviteToWorkSpace(workspace.id, email, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setMembers([result.data, ...members]);
            toast.success(ENCHINTL['toast']['invite']['invite-success'][intl]);
        } else {
            const err = res as AxiosError;
            const exception = err.response.data as ExceptionDTO;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
            if (err.response.status == 400) {
                toast.error(ENCHINTL['toast']['invite'][exception.message][intl]);
            }
        }
    }

    async function handlerRemoveInvite(id: number) {
        const res = await removeInvite(workspace.id, id, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setMembers(members.filter(
                a => a.id !== id
            ));
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerFindAllWorkSpaceMembers() {
        const res = await findAllMembersOnWorkSpace(workspace.id, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setMembers([...result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    useEffect(() => {
        handlerFindAllWorkSpaceMembers();
    }, [])

    return (
        <div>
            {
                visible ? (
                    <InviteModal
                        intl={intl}
                        workspace={workspace}
                        setShow={setVisible}
                        invitePeople={handlerInvitePeople}
                    />
                ) : null
            }
            <Flex justify="end" px="2" py="3">
                <Button color="cyan" variant="soft" onClick={handlerNewBtnClick}>{ENCHINTL['side-bar']['note']['new-btn'][intl]}</Button>
            </Flex>
        </div>
    )
}

export default WorkSpaceMemberTab;