'use client'
import { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Flex,
    Table,
    Tooltip,
    Button,
    Tabs,
    Text,
    Strong
} from "@radix-ui/themes";
import {
    TrashIcon,
    Pencil1Icon,
    PaperPlaneIcon,
    Cross1Icon
} from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { AxiosError, AxiosResponse } from "axios";
import WorkSpaceModal from "../components/workspace/WorkSpaceModal";
// import InviteModal from "../components/workspace/InviteModal";
import WorkSpaceNoteTab from "../components/workspace/WorkSpaceNoteTab";
import WorkSpaceScheduleTab from "../components/workspace/WorkSpaceScheduleTab";
import WorkSpaceTodoListTab from "../components/workspace/WorkSpaceTodoListTab";
import WorkSpaceMemberTab from "../components/workspace/WorkSpaceMemberTab";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import ENCHINTL from '@/app/lang/EN-CH.json';
import {
    createWorkSpace,
    updateWorkSpace,
    findAllWorkSpace,
    removeWorkSpace,
    inviteToWorkSpace,
} from "../api";
import { setUserProps } from "../features/calendar.slice";
import { eraseStorage, dateToYYYYMMDDF } from "../helper";
import {
    WorkSpaceDTO,
    NewWorkSpaceDTO,
    UpdateWorkSpaceDTO,
    ExceptionDTO,
} from "../type";
import { MODAL_TYPE } from "../const";

const WorkSpace = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { intl, user } = useAppSelector(state => state.calendar);

    const [accessToken, setAccessToken] = useState<string>("");
    const [visibleWorkSpaceModal, setVisibleWorkSpaceModal] = useState<boolean>(false);
    const [visibleWorkSpaceBar, setVisibleWorkSpaceBar] = useState<boolean>(false);
    const [modalType, setModalType] = useState<MODAL_TYPE>(null);
    const [workspaceList, setWorkSpaceList] = useState<Array<WorkSpaceDTO>>([]);
    const [activeWorkSpace, setActiveWorkSpace] = useState<WorkSpaceDTO>(null);

    const handlerNewBtnClick = () => {
        setActiveWorkSpace(null);
        setModalType(MODAL_TYPE.Create);
        setVisibleWorkSpaceModal(true);
    }

    const handlerEditBtnClick = (value: number) => {
        setActiveWorkSpace(workspaceList[value]);
        setModalType(MODAL_TYPE.Update);
        setVisibleWorkSpaceModal(true);
    }

    const handlerWorkSpaceClick = (value: number) => {
        setActiveWorkSpace(workspaceList[value]);
        setVisibleWorkSpaceBar(true);
    }

    const handlerWorkSpaceBarHide = () => {
        setVisibleWorkSpaceBar(false);
    }

    const signOutAction = () => {
        dispatch(setUserProps(null));
        eraseStorage();
        router.push('/auth/signin');
    }

    async function handlerCreateWorkSpace(payload: NewWorkSpaceDTO) {
        const res = await createWorkSpace(payload, accessToken);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setWorkSpaceList([result.data, ...workspaceList]);
            toast.success(ENCHINTL['toast']['workspace']['create-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerFindAllWorkSpace() {
        const token = localStorage.getItem('token');
        const res = await findAllWorkSpace(token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setWorkSpaceList([...result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    async function handlerUpdateWorkSpace(payload: UpdateWorkSpaceDTO) {
        const res = await updateWorkSpace(activeWorkSpace.id, payload, accessToken);
        if (res.status && res.status < 400) {
            const tmpWorkSpaces = [...workspaceList];
            const update = tmpWorkSpaces.find(
                a => a.id === activeWorkSpace.id
            );
            Object.keys(payload).map(v => {
                update[v] = payload[v];
            });
            setWorkSpaceList(tmpWorkSpaces);
            toast.success(ENCHINTL['toast']['workspace']['create-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerRemoveBtnClick(value: number) {
        const res = await removeWorkSpace(workspaceList[value].id, accessToken);
        if (res.status && res.status < 400) {
            setWorkSpaceList(workspaceList.filter(
                a => a.id !== workspaceList[value].id
            ));
            toast.success(ENCHINTL['toast']['workspace']['remove-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerInvitePeople(email: string) {
        const res = await inviteToWorkSpace(activeWorkSpace.id, email, accessToken);
        if (res.status && res.status < 400) {
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



    useEffect(() => {
        handlerFindAllWorkSpace();
    }, [])

    useLayoutEffect(() => {
        const token = localStorage.getItem('token');
        if (!token)
            router.push('/auth/signin');
        else
            setAccessToken(token);
    }, [])

    return (
        <div >
            {
                visibleWorkSpaceModal ? (
                    <WorkSpaceModal
                        intl={intl}
                        type={modalType}
                        workspace={activeWorkSpace}
                        setShow={setVisibleWorkSpaceModal}
                        createWorkSpace={handlerCreateWorkSpace}
                        updateWorkSpace={handlerUpdateWorkSpace}
                    />
                ) : null
            }
            {/* {
                visibleInviteModal ? (
                    <InviteModal
                        intl={intl}
                        workspace={activeWorkSpace}
                        setShow={setVisibleInviteModal}
                        invitePeople={handlerInvitePeople}
                    />
                ) : null
            } */}
            <Flex justify="end" py="3">
                <Button
                    color="cyan"
                    variant="soft"
                    className="cursor-pointer"
                    onClick={handlerNewBtnClick}
                >{ENCHINTL['workspace']['new-btn'][intl]}
                </Button>
            </Flex>
            <Flex direction="row" gap="4">
                <Flex className={visibleWorkSpaceBar ? "w-1/2" : "w-full"}>
                    <Table.Root variant="surface" size="3" className="w-full" >
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>{ENCHINTL['workspace']['table']['header']['no'][intl]}</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>{ENCHINTL['workspace']['table']['header']['title'][intl]}</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>{ENCHINTL['workspace']['table']['header']['note'][intl]}</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>{ENCHINTL['workspace']['table']['header']['schedule'][intl]}</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>{ENCHINTL['workspace']['table']['header']['todolist'][intl]}</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>{ENCHINTL['workspace']['table']['header']['create-at'][intl]}</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>{ENCHINTL['workspace']['table']['header']['type'][intl]}</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>{ENCHINTL['workspace']['table']['header']['action'][intl]}</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                workspaceList.map((v, i) => (
                                    <Table.Row key={i}>
                                        <Table.Cell className="cursor-pointer" onClick={() => handlerWorkSpaceClick(i)}>{i + 1}</Table.Cell>
                                        <Table.Cell className="cursor-pointer" onClick={() => handlerWorkSpaceClick(i)}>{v.title}</Table.Cell>
                                        <Table.Cell className="cursor-pointer" onClick={() => handlerWorkSpaceClick(i)}>{v._count?.notes ? v._count?.notes : 0}</Table.Cell>
                                        <Table.Cell className="cursor-pointer" onClick={() => handlerWorkSpaceClick(i)}>{v._count?.schedules ? v._count?.schedules : 0}</Table.Cell>
                                        <Table.Cell className="cursor-pointer" onClick={() => handlerWorkSpaceClick(i)}>{v._count?.todolists ? v._count?.schedules : 0}</Table.Cell>
                                        <Table.Cell className="cursor-pointer" onClick={() => handlerWorkSpaceClick(i)}>{dateToYYYYMMDDF(new Date(v.createAt))}</Table.Cell>
                                        <Table.Cell className="cursor-pointer" onClick={() => handlerWorkSpaceClick(i)}>{user?.id && user?.id == v.ownerId ? ENCHINTL['workspace']['table']['type']['owner'][intl] : ENCHINTL['workspace']['table']['type']['invited'][intl]}</Table.Cell>
                                        <Table.Cell>
                                            <Flex gap="3">
                                                {/* <Tooltip content={ENCHINTL['workspace']['table']['tooltip']['invite'][intl]}>
                                                    <PaperPlaneIcon
                                                        className="cursor-pointer"
                                                        height="20"
                                                        width="20"
                                                        onClick={handlerInviteBtnClick}
                                                    />
                                                </Tooltip> */}
                                                {
                                                    user.id == v.ownerId ? (
                                                        <>
                                                            <Tooltip content={ENCHINTL['workspace']['table']['tooltip']['invite'][intl]}>
                                                                <Pencil1Icon
                                                                    className="cursor-pointer"
                                                                    height="20"
                                                                    width="20"
                                                                    onClick={() => handlerEditBtnClick(i)}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip content={ENCHINTL['workspace']['table']['tooltip']['invite'][intl]}>
                                                                <TrashIcon
                                                                    className="cursor-pointer"
                                                                    height="20"
                                                                    width="20"
                                                                    onClick={() => handlerRemoveBtnClick(i)}
                                                                />
                                                            </Tooltip>
                                                        </>
                                                    ) : null
                                                }
                                            </Flex>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table.Root>
                </Flex>
                {
                    visibleWorkSpaceBar ? (
                        <Flex direction="column" className="w-1/2">
                            <Flex justify="end" py="2" px="2">
                                <Cross1Icon className="cursor-pointer" height="20" width="20" onClick={handlerWorkSpaceBarHide} />
                            </Flex>
                            <Text align="center" as="p" size="7"><Strong>{activeWorkSpace.title}</Strong></Text>
                            <Tabs.Root defaultValue="note">
                                <Tabs.List>
                                    <Tabs.Trigger value="note">
                                        {ENCHINTL['workspace']['side-bar']['note']['tab'][intl]}
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="schedule">
                                        {ENCHINTL['workspace']['side-bar']['schedule']['tab'][intl]}
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="todolist">
                                        {ENCHINTL['workspace']['side-bar']['todolist']['tab'][intl]}
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="member">
                                        {ENCHINTL['workspace']['side-bar']['member']['tab'][intl]}
                                    </Tabs.Trigger>
                                </Tabs.List>
                                <Tabs.Content value="note">
                                    <WorkSpaceNoteTab
                                        intl={intl}
                                        token={accessToken}
                                        workspace={activeWorkSpace}
                                        signOutAction={signOutAction}
                                    />
                                </Tabs.Content>
                                <Tabs.Content value="schedule">
                                    <WorkSpaceScheduleTab
                                        intl={intl}
                                        token={accessToken}
                                        workspace={activeWorkSpace}
                                        signOutAction={signOutAction}
                                    />
                                </Tabs.Content>
                                <Tabs.Content value="todolist">
                                    <WorkSpaceTodoListTab
                                        intl={intl}
                                        token={accessToken}
                                        workspace={activeWorkSpace}
                                        signOutAction={signOutAction}
                                    />
                                </Tabs.Content>
                                <Tabs.Content value="member">
                                    <WorkSpaceMemberTab
                                        intl={intl}
                                        token={accessToken}
                                        workspace={activeWorkSpace}
                                        signOutAction={signOutAction}
                                        user={user}
                                    />
                                </Tabs.Content>
                            </Tabs.Root>
                        </Flex>
                    ) : null
                }
            </Flex>
        </div>
    )
}

export default WorkSpace;