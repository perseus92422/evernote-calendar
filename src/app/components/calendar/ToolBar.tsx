import { useState } from "react";
import {
    Flex,
    Tabs,
    DropdownMenu,
    Button,
    IconButton
} from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import moment from "moment";
import { CALENDAR_VIEW_MODE, MOMENT_LOCALES } from "@/app/const";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { dateToYYYYMMDDF } from "@/app/helper/util";


const ToolTar = (
    {
        intl,
        viewMode,
        activeDate,
        setViewMode,
        setActiveDate,
        setInitFlag
    }: {
        intl: number;
        viewMode: CALENDAR_VIEW_MODE;
        activeDate: string;
        setViewMode: (arg: CALENDAR_VIEW_MODE) => void;
        setActiveDate: (arg: string) => void;
        setInitFlag: (arg: boolean) => void;
    }) => {

    const BASE_YEAR_CALENDAR = new Date().getFullYear();


    const handlerViewModeChange = (value: CALENDAR_VIEW_MODE) => {
        setViewMode(value);
    }

    const handleYearChange = (value: number) => {
        setActiveDate(moment(activeDate).year(value).format('YYYY-MM-DD'));
        setInitFlag(true);
    }

    const handlerPrevOrNextMonthClick = (value: number) => {
        setActiveDate(moment(activeDate).add('M', value).format('YYYY-MM-DD'));
        setInitFlag(true);
    }

    const handlerMonthChange = (value: number) => {
        setActiveDate(moment(activeDate).month(value).format('YYYY-MM-DD'));
        setInitFlag(true);
    }

    const handlerTodayBtnClick = () => {
        setActiveDate(dateToYYYYMMDDF(new Date()));
        setInitFlag(true);
    }

    return (
        <Flex justify="between" py="3">
            <Flex gap="2">
                <Button variant="soft" onClick={handlerTodayBtnClick} className='cursor-pointer' >
                    {ENCHINTL['calendar']['toolbar']['button']['today'][intl]}
                </Button>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger className='cursor-pointer'>
                        <Button variant="soft" >
                            {moment(activeDate).year()}
                            <DropdownMenu.TriggerIcon />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        {
                            Array(12).fill(0).map((v: number, i: number) => (
                                <DropdownMenu.Item key={i} onClick={() => handleYearChange(BASE_YEAR_CALENDAR + i - 6)}>
                                    {BASE_YEAR_CALENDAR + i - 6}
                                </DropdownMenu.Item>
                            ))
                        }
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <Flex gap="3">
                    <IconButton className='cursor-pointer' radius="full" variant="soft" onClick={() => handlerPrevOrNextMonthClick(-1)}>
                        <ChevronLeftIcon width="18" height="18" />
                    </IconButton>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger className='w-[130px] cursor-pointer'>
                            <Button variant="soft">
                                {moment(activeDate).locale(MOMENT_LOCALES[intl]).format('MMMM')}
                                <DropdownMenu.TriggerIcon />
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content className='max-h-[300px]'>
                            {
                                Array(12).fill(0).map((v: number, i: number) => (
                                    <DropdownMenu.Item key={i} onClick={() => handlerMonthChange(i)}>
                                        {moment(activeDate).locale(MOMENT_LOCALES[intl]).month(i).format("MMMM")}
                                    </DropdownMenu.Item>
                                ))
                            }
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                    <IconButton className='cursor-pointer' radius="full" variant="soft">
                        <ChevronRightIcon width="18" height="18" onClick={() => handlerPrevOrNextMonthClick(1)} />
                    </IconButton>
                </Flex>
            </Flex>
            <Tabs.Root defaultValue={viewMode}>
                <Tabs.List>
                    <Tabs.Trigger
                        className='cursor-pointer'
                        value={CALENDAR_VIEW_MODE.month1}
                        onClick={() => handlerViewModeChange(CALENDAR_VIEW_MODE.month1)}
                    >
                        {ENCHINTL['calendar']['toolbar']['view-mode']['month1'][intl]}
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        className='cursor-pointer'
                        value={CALENDAR_VIEW_MODE.month2}
                        onClick={() => handlerViewModeChange(CALENDAR_VIEW_MODE.month2)}
                    >
                        {ENCHINTL['calendar']['toolbar']['view-mode']['month2'][intl]}
                    </Tabs.Trigger>
                    {/* <Tabs.Trigger
                        className='cursor-pointer'
                        value={CALENDAR_VIEW_MODE.week}
                        onClick={() => handlerViewModeChange(CALENDAR_VIEW_MODE.week)}
                    >
                        {ENCHINTL['calendar']['toolbar']['view-mode']['week'][intl]}
                    </Tabs.Trigger> */}
                </Tabs.List>
            </Tabs.Root>
        </Flex >
    )
}

export default ToolTar;