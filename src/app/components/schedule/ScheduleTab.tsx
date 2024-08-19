import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useAppDispatch } from "@/app/redux/hook";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { SCHEDULE_MODAL_TYPE } from "../../const";
import {
    findAllSchedule,
    findAllScheduleBy,
    removeSchedule
} from "../../api";
import { ScheduleDTO } from "../../type";
import { eraseStorage } from "@/app/helper";
import { setUserProps } from "@/app/features/calendar.slice";


const ScheduleTab = (
    {
        intl,
        activeDate,
        setShowDateBar,
        handleNewClickBtn
    }:
        {
            intl: number;
            activeDate: string;
            setShowDateBar: (arg: boolean) => void;
            handleNewClickBtn: () => void;
        }
) => {

    const token = localStorage.getItem('token');
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [visible, setVisible] = useState<boolean>(false);
    const [scheduleList, setScheduleList] = useState<Array<ScheduleDTO>>([]);
    const [activeDaySchedule, setActiveDaySchedule] = useState<Array<ScheduleDTO>>([]);
    const [activeSchedule, setActiveSchedule] = useState<ScheduleDTO>();

    async function getScheduleList() {
        const res = await findAllSchedule(token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setScheduleList([...result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }

    }

    async function getActiveDaySchedule() {
        const res = await findAllScheduleBy(activeDate, token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setActiveDaySchedule([...result.data])
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    const handleScheduleEdit = (schedule: ScheduleDTO) => {
        setActiveSchedule(schedule);
        setVisible(true);
        setShowDateBar(false);
    }

    async function handleScheduleRemove(id: number) {
        const res = await removeSchedule(id, token);
        setShowDateBar(false);
        if (res.status && res.status < 400) {
            toast.success(ENCHINTL['toast']['schedule']['remove-success'][intl]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401)
                toast.success(ENCHINTL['toast']['common']['token-expired'][intl]);
            signOutAction();
        }
    }

    const signOutAction = () => {
        eraseStorage();
        dispatch(setUserProps(null));
        router.push('/auth/signin');
    }

    useEffect(() => {
        getScheduleList();
    }, [])

    useEffect(() => {
        getActiveDaySchedule();
    }, [activeDate])

    return (
        <div>
            {
                visible ? (
                    <ScheduleModal
                        type={SCHEDULE_MODAL_TYPE.Update}
                        isShow={visible}
                        setShowModal={setVisible}
                        setShowDateBar={setShowDateBar}
                        activeSchedule={activeSchedule}
                    />) : null
            }
            <Flex direction="row-reverse">
                <Button onClick={handleNewClickBtn}>{ENCHINTL['side-bar']['note']['new-btn'][intl]}</Button>
            </Flex>
            <Text as='p' size="4"><Strong>{activeDate}</Strong></Text>
            {
                activeDaySchedule.map((v, i) => (
                    <ScheduleBar
                        key={i}
                        schedule={v}
                        intl={intl}
                        handlerEditBtn={handleScheduleEdit}
                        handlerRemoveBtn={handleScheduleRemove}
                    />
                ))
            }
            <Text as='p' size="4"><Strong>{ENCHINTL['side-bar']['note']['all-p'][intl]}</Strong></Text>
            <Flex direction="column" pt="3" pb="3">
                {
                    scheduleList.map((v, i) => (
                        <ScheduleBar
                            key={i}
                            schedule={v}
                            intl={intl}
                            handlerEditBtn={handleScheduleEdit}
                            handlerRemoveBtn={handleScheduleRemove}
                        />
                    ))
                }
            </Flex>
        </div>
    )
}

export default ScheduleTab;