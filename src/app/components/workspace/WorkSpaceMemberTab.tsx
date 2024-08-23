import { useState, useEffect } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { Flex, Button, Grid } from "@radix-ui/themes";
import { toast } from "react-toastify";
import InviteModal from "./InviteModal";
import MemberBar from "./MemberBar";
import {
    WorkSpaceDTO,
    WorkSpaceMemberDTO,
    ExceptionDTO,
    UserDTO
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
        user,
        signOutAction
    }: {
        intl: number;
        token: string;
        workspace: WorkSpaceDTO;
        user: UserDTO;
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
            setMembers(members.filter(
                a => a.id !== id
            ));
            toast.success(ENCHINTL['toast']['invite']['remove-invite-success'][intl]);
            toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
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
            {
                user?.id == workspace?.ownerId ? (
                    <Flex justify="end" px="2" py="3">
                        <Button color="cyan" variant="soft" onClick={handlerNewBtnClick}>{ENCHINTL['side-bar']['note']['new-btn'][intl]}</Button>
                    </Flex>
                ) : null
            }
            <Grid columns="3" gap="5" pt="2">
                {
                    members.map((v, i) => (
                        <MemberBar
                            key={i}
                            member={v}
                            user={user}
                            workspace={workspace}
                            handlerRemoveClick={handlerRemoveInvite}
                        />
                    ))
                }
            </Grid>
        </div>
    )
}

export default WorkSpaceMemberTab;