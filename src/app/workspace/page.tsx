'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Table, Tooltip, Button } from "@radix-ui/themes";
import {
    TrashIcon,
    Pencil1Icon,
    PaperPlaneIcon
} from "@radix-ui/react-icons";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import WorkSpaceModal from "../components/workspace/WorkSpaceModal";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { findAllWorkSpace } from "../api";
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
    const [visible, setVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<WORKSPACE_MODAL_TYPE>(WORKSPACE_MODAL_TYPE.Create);

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
        setModalType(WORKSPACE_MODAL_TYPE.Create);
        setVisible(true);
    }

    const handlerRemoveBtnClick = () => {

    }

    const handlerEditBtnClick = () => {

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
                visible ? (
                    <WorkSpaceModal
                        intl={intl}
                        type={modalType}
                        show={visible}
                        setShow={setVisible}
                    />
                ) : null
            }
            <Flex justify="end" py="3">
                <Button
                    color="cyan"
                    variant="soft"
                    className="cursor-pointer"
                    onClick={handlerNewBtnClick}
                >{ENCHINTL['workspace']['new-btn'][intl]}
                </Button>
            </Flex>
            <Table.Root variant="surface" size="3" className="w-full">
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
                                <Table.Cell>{i + 1}</Table.Cell>
                                <Table.Cell>{v.title}</Table.Cell>
                                <Table.Cell>{v._count.notes}</Table.Cell>
                                <Table.Cell>{v._count.schedules}</Table.Cell>
                                <Table.Cell>{v._count.todolists}</Table.Cell>
                                <Table.Cell>{dateToYYYYMMDDF(new Date(v.createAt))}</Table.Cell>
                                <Table.Cell>{curUser.id && curUser.id == v.ownerId ? ENCHINTL['workspace']['table']['type']['owner'][intl] : ENCHINTL['workspace']['table']['type']['invited'][intl]}</Table.Cell>
                                <Table.Cell>
                                    <Flex gap="3">
                                        <Tooltip content={ENCHINTL['workspace']['table']['tooltip']['invite'][intl]}>
                                            <PaperPlaneIcon
                                                className="cursor-pointer"
                                                height="20"
                                                width="20"
                                            />
                                        </Tooltip>
                                        <Tooltip content={ENCHINTL['workspace']['table']['tooltip']['invite'][intl]}>
                                            <Pencil1Icon
                                                className="cursor-pointer"
                                                height="20"
                                                width="20"
                                            />
                                        </Tooltip>
                                        <Tooltip content={ENCHINTL['workspace']['table']['tooltip']['invite'][intl]}>
                                            <TrashIcon
                                                className="cursor-pointer"
                                                height="20"
                                                width="20"
                                            />
                                        </Tooltip>
                                    </Flex>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table.Root>
        </div>
    )
}

export default WorkSpace;