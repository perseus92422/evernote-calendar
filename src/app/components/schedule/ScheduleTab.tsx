import { useEffect, useState } from "react";
import {
    Flex,
    Button,
    Text,
    Strong
} from "@radix-ui/themes";
import { toast } from "react-toastify";
import { AxiosResponse, AxiosError } from "axios";
import ScheduleModal from "./ScheduleModal";
import ScheduleBar from "./ScheduleBar";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { MODAL_TYPE, PUBLIC_TYPE } from "../../const";
import {
    findAllSchedule,
    findAllScheduleBy,
    removeSchedule
} from "../../api";
import {
    NewScheduleDTO,
    UpdateScheduleDTO,
    ScheduleDTO
} from "../../type";
import {
    createSchedule,
    updateSchedule
} from "../../api";


const ScheduleTab = (
    {
        intl,
        token,
        activeDate,
        signOutAction
    }:
        {
            intl: number;
            token: string;
            activeDate: string;
            signOutAction: () => void;
        }
) => {

    const [visible, setVisible] = useState<boolean>(false);
    const [modalType, setModalType] = useState<MODAL_TYPE>(null);
    const [privateScheduleList, setPrivateScheduleList] = useState<Array<ScheduleDTO>>([]);
    const [workspaceScheduleList, setWorkSpaceScheduleList] = useState<Array<ScheduleDTO>>([]);

    // const [scheduleList, setScheduleList] = useState<Array<ScheduleDTO>>([]);
    // const [activeDaySchedule, setActiveDaySchedule] = useState<Array<ScheduleDTO>>([]);
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
        const res = await findAllSchedule(token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setPrivateScheduleList([...result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    async function handlerFindAllWorkSpaceSchdeuld() {

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
            if (err.response.status == 401)
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    useEffect(() => {
        handlerFindAllPrivateSchedule();
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
                        handlerEditBtn={handlerScheduleEdit}
                        handlerRemoveBtn={handlerScheduleRemove}
                    />
                ))
            }
            <Text as='p' size="4" className="py-2"><Strong>{ENCHINTL['side-bar']['schedule']['workspace-schedule-p'][intl]}</Strong></Text>
        </div>
    )
}

export default ScheduleTab;