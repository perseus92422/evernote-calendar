import { useEffect, useState } from "react";
import {
    Flex,
    Button,
    Text,
    Strong
} from "@radix-ui/themes";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { toast } from "react-toastify";
import ScheduleBar from "./ScheduleBar";
import {
    findAllSchedule,
    findDaySchedule,
    removeSchedule
} from "../api";
import { ScheduleDTO } from "../type";
import ScheduleModal from "./ScheduleModal";
import { SCHEDULE_MODAL_TYPE } from "../const";

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

    const [visible, setVisible] = useState<boolean>(false);
    const [scheduleList, setScheduleList] = useState<Array<ScheduleDTO>>([]);
    const [activeDaySchedule, setActiveDaySchedule] = useState<Array<ScheduleDTO>>([]);
    const [activeSchedule, setActiveSchedule] = useState<ScheduleDTO>();

    async function getScheduleList() {
        const { data, status } = await findAllSchedule();
        setScheduleList([...data]);
    }

    async function getActiveDaySchedule() {
        const { data, status } = await findDaySchedule(activeDate);
        setActiveDaySchedule([...data])
    }

    const handleScheduleEdit = (schedule: ScheduleDTO) => {
        setActiveSchedule(schedule);
        setVisible(true);
        setShowDateBar(false);
    }

    async function handleScheduleRemove(id: number) {
        const { data, status } = await removeSchedule(id);
        setShowDateBar(false);
        if (status >= 400) {

        }
        else {
            toast.info(ENCHINTL['toast']['schedule']['remove-success'][intl]);
        }
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
            <Text as='p' size="4"><Strong>{ENCHINTL['side-bar']['note']['today-p'][intl]}</Strong></Text>
            {
                activeDaySchedule.map((v, i) => (
                    <ScheduleBar
                        key={i}
                        schedule={v}
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