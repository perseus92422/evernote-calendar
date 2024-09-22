import { useEffect, useState } from "react";
import { AxiosResponse, AxiosError } from "axios";
import moment from "moment";
import {
    Flex,
    Button,
    Text,
    Strong
} from "@radix-ui/themes";
import { toast } from "react-toastify";
import ScheduleModal from "./ScheduleModal";
import ScheduleBar from "./ScheduleBar";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { MODAL_TYPE, PUBLIC_TYPE } from "../../const";
import {
    findAllScheduleByDay,
    findAllScheduleOnWorkspaces,
    removeSchedule
} from "../../api";
import {
    NewScheduleDTO,
    UpdateScheduleDTO,
    ScheduleOnWorkSpaces,
    ScheduleDTO,
    UserDTO
} from "../../type";
import {
    createSchedule,
    updateSchedule
} from "../../api";


const ScheduleTab = (
    {
        intl,
        user,
        token,
        activeDate,
        signOutAction,
    }:
        {
            intl: number;
            user: UserDTO;
            token: string;
            activeDate: string;
            signOutAction: () => void;
        }
) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<MODAL_TYPE>(null);
    const [privateScheduleList, setPrivateScheduleList] = useState<Array<ScheduleDTO>>([]);
    const [workspaceScheduleList, setWorkSpaceScheduleList] = useState<Array<ScheduleOnWorkSpaces>>([]);
    const [activeSchedule, setActiveSchedule] = useState<ScheduleDTO>();

    const handlerNewBtnClick = () => {
        setModalType(MODAL_TYPE.Create);
        setActiveSchedule(null);
        setVisible(true);
    }

    const handlerScheduleEdit = (schedule: ScheduleDTO) => {
        setModalType(MODAL_TYPE.Update);
        setActiveSchedule(schedule);
        setVisible(true);
    }

    async function handlerCreateSchedule(payload: NewScheduleDTO) {
        const res = await createSchedule(payload, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setPrivateScheduleList([result.data, ...privateScheduleList]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerFindAllPrivateSchedule() {
        const res = await findAllScheduleByDay(activeDate, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setPrivateScheduleList([...result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerFindAllWorkSpaceSchedule() {
        const res = await findAllScheduleOnWorkspaces(token, activeDate);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setWorkSpaceScheduleList(result.data);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerUpdateSchedule(payload: UpdateScheduleDTO) {
        const res = await updateSchedule(activeSchedule.id, payload, token);
        if (res.status && res.status < 400) {
            const tmpSchedules = [...privateScheduleList];
            const update = tmpSchedules.find(
                a => a.id === activeSchedule.id
            );
            Object.keys(payload).map((v) => {
                update[v] = payload[v];
            });
            setPrivateScheduleList(tmpSchedules);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerScheduleRemove(id: number) {
        const res = await removeSchedule(id, token);
        if (res.status && res.status < 400) {
            setPrivateScheduleList(privateScheduleList.filter(
                a => a.id !== id
            ));
            toast.success(ENCHINTL['toast']['schedule']['remove-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    useEffect(() => {
        handlerFindAllPrivateSchedule();
        handlerFindAllWorkSpaceSchedule();
    }, [activeDate])

    return (
        <div>
            {
                visible ? (
                    <ScheduleModal
                        intl={intl}
                        type={modalType}
                        publicMode={PUBLIC_TYPE.Private}
                        setShowModal={setVisible}
                        schedule={activeSchedule}
                        createSchedule={handlerCreateSchedule}
                        updateSchedule={handlerUpdateSchedule}
                    />) : null
            }
            <Flex direction="row-reverse">
                <Button color="cyan" variant="soft" onClick={handlerNewBtnClick}>{ENCHINTL['side-bar']['note']['new-btn'][intl]}</Button>
            </Flex>
            <Text as='p' size="4" className="py-2"><Strong>{ENCHINTL['side-bar']['schedule']['personal-schedule-p'][intl]}</Strong></Text>
            {
                privateScheduleList.map((v, i) => (
                    <ScheduleBar
                        key={i}
                        schedule={v}
                        intl={intl}
                        editable={true}
                        removable={true}
                        handlerEditBtn={handlerScheduleEdit}
                        handlerRemoveBtn={handlerScheduleRemove}
                    />
                ))
            }
            <Text as='p' size="4" className="py-2"><Strong>{ENCHINTL['side-bar']['schedule']['workspace-schedule-p'][intl]}</Strong></Text>
            {
                workspaceScheduleList.map((v, i) => (
                    <Flex key={i} direction="column" >
                        <Text as="p" size="5"><Strong>{v.title}</Strong></Text>
                        <Flex direction="column" px="3" pt="2">
                            {
                                v.schedules.map((schedule, j) => (
                                    <ScheduleBar
                                        key={j}
                                        intl={intl}
                                        schedule={schedule}
                                        editable={false}
                                        removable={false}
                                        handlerEditBtn={handlerScheduleEdit}
                                        handlerRemoveBtn={handlerScheduleRemove}
                                    />
                                ))
                            }
                        </Flex>
                    </Flex>
                ))
            }
        </div>
    )
}

export default ScheduleTab;