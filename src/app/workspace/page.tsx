'use client'
import { useState, useEffect } from "react";
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
import InviteModal from "../components/workspace/InviteModal";
import NoteModal from "../components/note/NoteModal";
import WorkSpaceNoteTab from "../components/workspace/WorkSpaceNoteTab";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { findAllWorkSpace, removeWorkSpace } from "../api";
import { setUserProps } from "../features/calendar.slice";
import { eraseStorage, dateToYYYYMMDDF } from "../helper";
import { UserDTO, WorkSpaceDTO } from "../type";
import { WORKSPACE_MODAL_TYPE } from "../const";

const WorkSpace = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { intl, user } = useAppSelector(state => state.calendar);

    const [curUser, setCurUser] = useState<UserDTO>();
    const [workspaceList, setWorkSpaceList] = useState<Array<WorkSpaceDTO>>([]);
    const [visibleWorkSpaceModal, setVisibleWorkSpaceModal] = useState<boolean>(false);
    const [visibleInviteModal, setVisibleInviteModal] = useState<boolean>(false);
    const [visibleNoteModal, setVisibleNoteModal] = useState<boolean>(false);
    const [visibleScheduleModal, setVisibleScheduleModal] = useState<boolean>(false);
    const [visibleTodoListModal, setVisibleTodoListModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<WORKSPACE_MODAL_TYPE>(WORKSPACE_MODAL_TYPE.Create);
    const [activeWorkSpace, setActiveWorkSpace] = useState<WorkSpaceDTO>(null);
    const [visibleWorkSpaceBar, setVisibleWorkSpaceBar] = useState<boolean>(false);

    async function getAllWorkSpace() {
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

    const signOutAction = () => {
        dispatch(setUserProps(null));
        eraseStorage();
        router.push('/auth/signin');
    }

    const handlerNewBtnClick = () => {
        setActiveWorkSpace(null);
        setModalType(WORKSPACE_MODAL_TYPE.Create);
        setVisibleWorkSpaceModal(true);
    }

    async function handlerRemoveBtnClick(value: number) {
        const token = localStorage.getItem('token');
        const res = await removeWorkSpace(workspaceList[value].id, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setWorkSpaceList(workspaceList.filter(
                a => a.id !== workspaceList[value].id
            ));
            toast.error(ENCHINTL['toast']['workspace']['remove-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    const handlerInviteBtnClick = (value: number) => {
        setActiveWorkSpace(workspaceList[value]);
        setVisibleInviteModal(true);
    }

    const handlerEditBtnClick = (value: number) => {
        setActiveWorkSpace(workspaceList[value]);
        setModalType(WORKSPACE_MODAL_TYPE.Update);
        setVisibleWorkSpaceModal(true);
    }

    const handlerWorkSpaceClick = (value: number) => {
        setActiveWorkSpace(workspaceList[value]);
        setVisibleWorkSpaceBar(true);
    }

    const handlerWorkSpaceBarHide = () => {
        setVisibleWorkSpaceBar(false);
    }

    useEffect(() => {
        getAllWorkSpace();
    }, [])

    useEffect(() => {
        setCurUser(user);
    }, [user])

    return (
        <div >
            {
                visibleWorkSpaceModal ? (
                    <WorkSpaceModal
                        intl={intl}
                        type={modalType}
                        show={visibleWorkSpaceModal}
                        workSpaceList={workspaceList}
                        workspace={activeWorkSpace}
                        setWorkSpaceList={setWorkSpaceList}
                        setShow={setVisibleWorkSpaceModal}
                    />
                ) : null
            }
            {
                visibleInviteModal ? (
                    <InviteModal
                        intl={intl}
                        workspace={activeWorkSpace}
                        show={visibleWorkSpaceModal}
                        setShow={setVisibleInviteModal}
                    />
                ) : null
            }
            {/* {
                visibleNoteModal ? (
                    <NoteModal
                        
                    />
                ):null
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
                                        <Table.Cell className="cursor-pointer" onClick={() => handlerWorkSpaceClick(i)}>{curUser.id && curUser.id == v.ownerId ? ENCHINTL['workspace']['table']['type']['owner'][intl] : ENCHINTL['workspace']['table']['type']['invited'][intl]}</Table.Cell>
                                        <Table.Cell>
                                            <Flex gap="3">
                                                <Tooltip content={ENCHINTL['workspace']['table']['tooltip']['invite'][intl]}>
                                                    <PaperPlaneIcon
                                                        className="cursor-pointer"
                                                        height="20"
                                                        width="20"
                                                        onClick={() => handlerInviteBtnClick(i)}
                                                    />
                                                </Tooltip>
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
                                    {
                                        activeWorkSpace?.ownerId == curUser?.id ? (
                                            <Tabs.Trigger value="member">
                                                {ENCHINTL['workspace']['side-bar']['member']['tab'][intl]}
                                            </Tabs.Trigger>
                                        ) : null
                                    }
                                </Tabs.List>
                                <Tabs.Content value="note">
                                    <WorkSpaceNoteTab
                                        intl={intl}
                                        workspace={activeWorkSpace}
                                    />
                                </Tabs.Content>
                                <Tabs.Content value="schedule">

                                </Tabs.Content>
                                <Tabs.Content value="todolist">

                                </Tabs.Content>
                                {
                                    activeWorkSpace?.ownerId == curUser?.id ? (
                                        <Tabs.Content value="member">

                                        </Tabs.Content>
                                    ) : null
                                }
                            </Tabs.Root>
                        </Flex>
                    ) : null
                }
            </Flex>


        </div>
    )
}

export default WorkSpace;