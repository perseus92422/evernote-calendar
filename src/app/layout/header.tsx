'use client'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import {
  Flex,
  Tabs,
  DropdownMenu,
  Button,
  IconButton,
  Avatar
} from '@radix-ui/themes';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@radix-ui/react-icons'
import { useAppSelector, useAppDispatch } from '@/app/redux/hook';
import ScheduleModal from '../components/ScheduleModal';
import {
  SCHEDULE_MODAL_TYPE,
  MOMENT_LOCALES,
  CALENDAR_VIEW_MODE
} from '../const';
import ENCHINTL from '@/app/lang/EN-CH.json';
import {
  setViewModeProps,
  setActiveDateProps,
  setIntlProps,
} from '../features/calendar.slice';

const Header = () => {
  const dispatch = useAppDispatch();

  const { intl, activeDate, viewMode } = useAppSelector(state => state.calendar);
  const BASE_YEAR_CALENDAR = new Date().getFullYear();

  const [visible, setVisible] = useState<boolean>(false);
  const [curIntl, setCurIntl] = useState<number>(intl);
  const [curActiveDate, setCurActiveDate] = useState<string>(activeDate);

  const handleDialogOpen = () => {
    setVisible(true);
  }

  const handleIntlChange = () => {
    if (curIntl == 0) {
      setCurIntl(1);
      dispatch(setIntlProps(1));
    } else {
      setCurIntl(0);
      dispatch(setIntlProps(0));
    }
  }

  const handlePrev2NextMonth = (value: number) => {
    const tmp = moment(curActiveDate).add('M', value).format('YYYY-MM-DD');
    setCurActiveDate(tmp);
    dispatch(setActiveDateProps(tmp));
  }

  const handleMonthChange = (month: number) => {
    const tmp = moment(curActiveDate).month(month).format('YYYY-MM-DD');
    setCurActiveDate(tmp);
    dispatch(setActiveDateProps(tmp));
  }

  const handleYearChange = (year: number) => {
    const tmp = moment(curActiveDate).year(year).format('YYYY-MM-DD');
    setCurActiveDate(tmp);
    dispatch(setActiveDateProps(tmp));
  }

  const handleTodayBtn = () => {
    const tmp = moment().format('YYYY-MM-DD');
    setCurActiveDate(tmp);
    dispatch(setActiveDateProps(tmp));
  }

  const handleCalendarViewModeChange = (mode: CALENDAR_VIEW_MODE) => {
    dispatch(setViewModeProps(mode));
  }

  return (
    <Flex direction="row" justify="between" gap="4" py="2" pt="3">
      {visible ? (
        <ScheduleModal
          type={SCHEDULE_MODAL_TYPE.Create}
          isShow={visible}
          setShow={setVisible}
        />
      ) : null}
      <Button
        className='cursor-pointer'
        variant='soft'
        color='cyan'
        radius='full'
        onClick={handleDialogOpen}>
        <PlusIcon />{ENCHINTL['header']['create-btn'][intl]}
      </Button>
      {/* <Flex gap="3" pt="2">
        <Flex gap="3" >
          <Button variant="soft" onClick={handleTodayBtn} className='cursor-pointer' >
            {ENCHINTL['header']['today-btn'][intl]}
          </Button>
        </Flex>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className='cursor-pointer'>
            <Button variant="soft" >
              {moment(curActiveDate).year()}
              <DropdownMenu.TriggerIcon />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className='max-h-[300px]'>
            {
              Array(12).fill(0).map((v: number, i: number) => (
                <DropdownMenu.Item key={i} onClick={() => handleYearChange(BASE_YEAR_CALENDAR + i - 6)}>
                  {BASE_YEAR_CALENDAR + i - 6}
                </DropdownMenu.Item>
              ))
            }
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <IconButton className='cursor-pointer' radius="full" variant="soft" onClick={() => handlePrev2NextMonth(-1)}>
          <ChevronLeftIcon width="18" height="18" />
        </IconButton>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className='w-[130px] cursor-pointer'  >
            <Button variant="soft">
              {moment(curActiveDate).locale(MOMENT_LOCALES[intl]).format('MMMM')}
              <DropdownMenu.TriggerIcon />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className='max-h-[300px]'>
            {
              Array(12).fill(0).map((v: number, i: number) => (
                <DropdownMenu.Item key={i} onClick={() => handleMonthChange(i)}>
                  {moment().locale(MOMENT_LOCALES[intl]).month(i).format("MMMM")}
                </DropdownMenu.Item>
              ))
            }
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <IconButton className='cursor-pointer' radius="full" variant="soft">
          <ChevronRightIcon width="18" height="18" onClick={() => handlePrev2NextMonth(1)} />
        </IconButton>
      </Flex> */}
      <Flex gap="6" align="center">
        <Tabs.Root defaultValue={viewMode}>
          <Tabs.List>
            <Tabs.Trigger className='cursor-pointer' value={CALENDAR_VIEW_MODE.month1} onClick={() => handleCalendarViewModeChange(CALENDAR_VIEW_MODE.month1)}>{ENCHINTL['header']['view-mode']['month1'][intl]}</Tabs.Trigger>
            <Tabs.Trigger className='cursor-pointer' value={CALENDAR_VIEW_MODE.month2} onClick={() => handleCalendarViewModeChange(CALENDAR_VIEW_MODE.month2)}>{ENCHINTL['header']['view-mode']['month2'][intl]}</Tabs.Trigger>
            <Tabs.Trigger className='cursor-pointer' value={CALENDAR_VIEW_MODE.week} onClick={() => handleCalendarViewModeChange(CALENDAR_VIEW_MODE.week)}>{ENCHINTL['header']['view-mode']['week'][intl]}</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </Flex>
      <Flex onClick={handleIntlChange}>
        <Button radius='none' variant={curIntl === 0 ? "classic" : "outline"}>EN</Button>
        <Button radius='none' variant={curIntl === 1 ? "classic" : "outline"} >中文</Button>
      </Flex>
    </Flex >
  )
}

export default Header
