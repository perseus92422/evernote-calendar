import { useEffect, useState } from "react";
import { AxiosResponse, AxiosError } from "axios";
import { Flex, Button } from "@radix-ui/themes";
import { toast } from "react-toastify";
import ScheduleModal from "../schedule/ScheduleModal";
import ScheduleBar from "../schedule/ScheduleBar";
import { MODAL_TYPE, PUBLIC_TYPE } from "@/app/const";
import {
    createSchedule,
    updateSchedule,
    removeSchedule,
    findAllScheduleOnWorkSpace
} from "@/app/api";
import {
    NewScheduleDTO,
    UpdateScheduleDTO,
    ScheduleDTO,
    WorkSpaceDTO
} from "@/app/type";
import ENCHINTL from '@/app/lang/EN-CH.json';

const WorkSpaceScheduleTab = (
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
    const [modalType, setModalType] = useState<MODAL_TYPE>(null);
    const [activeSchedule, setActiveSchedule] = useState<ScheduleDTO>(null);
    const [scheduleList, setScheduleList] = useState<Array<ScheduleDTO>>([]);

    const handlerNewBtnClick = () => {
        setActiveSchedule(null);
        setModalType(MODAL_TYPE.Create);
        setVisible(true);
    }

    const handlerEditBtnClick = (schedule: ScheduleDTO) => {
        setActiveSchedule(schedule);
        setModalType(MODAL_TYPE.Update);
        setVisible(true);
    }

    async function handlerCreateScheduleOnWorkSpace(payload: NewScheduleDTO) {
        const res = await createSchedule(payload, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setScheduleList([result.data, ...scheduleList]);
            toast.success(ENCHINTL['toast']['schedule']['create-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerUpdateSchedule(payload: UpdateScheduleDTO) {
        const res = await updateSchedule(activeSchedule.id, payload, token);
        if (res.status && res.status < 400) {
            const tmpSchedules = [...scheduleList];
            const update = tmpSchedules.find(
                a => a.id === activeSchedule.id
            );
            Object.keys(payload).map(v => update[v] = payload[v]);
            setScheduleList(tmpSchedules);
            toast.success(ENCHINTL['toast']['schedule']['update-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerFindAllScheduleOnWorkSpace() {
        const res = await findAllScheduleOnWorkSpace(workspace.id, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setScheduleList([...result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    async function handlerRemoveBtnClick(id: number) {
        const res = await removeSchedule(id, token);
        if (res.status && res.status < 400) {
            setScheduleList(scheduleList.filter(
                a => a.id !== activeSchedule.id
            ));
            toast.success(ENCHINTL['toast']['schedule']['remove-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    useEffect(() => {
        handlerFindAllScheduleOnWorkSpace();
    }, [])

    return (
        <div>
            {
                visible ? (
                    <ScheduleModal
                        intl={intl}
                        type={modalType}
                        publicMode={PUBLIC_TYPE.WorkSpace}
                        schedule={activeSchedule}
                        workspaceId={workspace.id}
                        setShowModal={setVisible}
                        createSchedule={handlerCreateScheduleOnWorkSpace}
                        updateSchedule={handlerUpdateSchedule}
                    />
                ) : null
            }
            <Flex justify="end" px="2" py="3">
                <Button color="cyan" variant="soft" onClick={handlerNewBtnClick}>{ENCHINTL['workspace']['side-bar']['note']['new-btn'][intl]}</Button>
            </Flex>
            {
                scheduleList.map((v, i) => (
                    <ScheduleBar
                        key={i}
                        intl={intl}
                        schedule={v}
                        handlerEditBtn={handlerEditBtnClick}
                        handlerRemoveBtn={handlerRemoveBtnClick}
                    />
                ))
            }
        </div>
    )
}

export default WorkSpaceScheduleTab;