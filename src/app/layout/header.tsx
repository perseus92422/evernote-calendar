'use client'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import 'moment/locale/en-ca';
import 'moment/locale/zh-cn';
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
  PlusIcon
} from '@radix-ui/react-icons'
import { useAppSelector, useAppDispatch } from '@/app/redux/hook';
import ScheduleModal from '../components/ScheduleModal';
import { setDate, setKind, getCalender } from '@/app/redux/calenderSlice';
import { SCHEDULE_MODAL_TYPE } from '../const';
import ENCHINTL from '@/app/lang/EN-CH.json';
import { setActiveDateProps, setIntlProps } from '../features/calendar.slice';
import { getYear, getFullDescriptionOfMonth } from '../helper/util';

const Header = () => {
  const dispatch = useAppDispatch();
  const { intl } = useAppSelector(state => state.calendar);
  const { date } = useAppSelector(getCalender)

  const BASE_YEAR_CALENDAR = new Date().getFullYear();

  const [visible, setVisible] = useState<boolean>(false);
  const [curIntl, setCurIntl] = useState<number>(intl);
  const [curActiveDate, setCurActiveDate] = useState<Date>(new Date());

  const handleClickMonth = (kind: moment.unitOfTime.DurationConstructor, value: number) => {
    dispatch(setDate(moment(date).add(value, kind).format("YYYY-MM-DD")))
  }

  const handleClickMonthD = (value: number) => {
    // dispatch(setDate(moment(date).month(value).format("YYYY-MM-DD")))
  }

  const handleClickYear = (year: number) => {
    console.log(BASE_YEAR_CALENDAR)
    // console.log(moment(curActiveDate.setFullYear(year).).format('YYYY-MM-DD'))
    // setCurActiveDate(new Date(curActiveDate.setFullYear(year)));

    // dispatch(setDate(moment(date).year(year).format("YYYY-MM-DD")))
  }

  const handleClickToday = () => {
    // dispatch(setDate(moment(new Date()).format("YYYY-MM-DD")))
  }

  const handleClickKind = (m_kind: string) => {
    dispatch(setKind(m_kind));
  }

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

  useEffect(() => {

  }, [])

  return (
    <div>
      {visible ? (
        <ScheduleModal
          type={SCHEDULE_MODAL_TYPE.Create}
          isShow={visible}
          setShow={setVisible}
        />
      ) : null}
      <Flex direction="row" justify="between" gap="4" py="2">
        <Flex pt="2">
          <Button
            className='cursor-pointer'
            variant='soft'
            color='cyan'
            radius='full'
            onClick={handleDialogOpen}>
            <PlusIcon />{ENCHINTL['header']['create-btn'][intl]}
          </Button>
        </Flex>
        <Flex gap="3" pt="2">
          <Flex gap="3" >
            <Button variant="soft" onClick={handleClickToday} className='cursor-pointer' >
              {ENCHINTL['header']['today-btn'][intl]}
            </Button>
          </Flex>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className='cursor-pointer'>
              <Button variant="soft" >
                {getYear(curActiveDate)}
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className='max-h-[300px]'>
              {
                Array(12).fill(0).map((v: number, i: number) => (
                  <DropdownMenu.Item key={i} onClick={() => handleClickYear(moment(date).year() + i - 6)}>
                    {BASE_YEAR_CALENDAR + i - 6}
                  </DropdownMenu.Item>
                ))
              }
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <IconButton className='cursor-pointer' radius="full" variant="soft" onClick={() => handleClickMonth("months", -1)}>
            <ChevronLeftIcon width="18" height="18" />
          </IconButton>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className='w-[130px] cursor-pointer'  >
              <Button variant="soft">
                {moment(curActiveDate).locale(intl == 0 ? "en-ca" : "zh-cn").format('MMMM')}
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className='max-h-[300px]'>
              {
                Array(12).fill(0).map((v: number, i: number) => (
                  <DropdownMenu.Item key={i} onClick={() => handleClickMonthD(i)}>
                    {moment().locale(intl == 0 ? "en-ca" : "zh-cn").month(i).format("MMMM")}
                  </DropdownMenu.Item>
                ))
              }
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <IconButton className='cursor-pointer' radius="full" variant="soft">
            <ChevronRightIcon width="18" height="18" onClick={() => handleClickMonth("months", 1)} />
          </IconButton>

        </Flex>
        <Flex gap="6" align="center">
          <Tabs.Root defaultValue="month_1">
            <Tabs.List>
              <Tabs.Trigger className='cursor-pointer' value="month_1" onClick={() => handleClickKind("month_1")}>{ENCHINTL['header']['view-mode']['month1'][intl]}</Tabs.Trigger>
              <Tabs.Trigger className='cursor-pointer' value="month_2" onClick={() => handleClickKind("month_2")}>{ENCHINTL['header']['view-mode']['month2'][intl]}</Tabs.Trigger>
              <Tabs.Trigger className='cursor-pointer' value="week" onClick={() => handleClickKind("week")}>{ENCHINTL['header']['view-mode']['week'][intl]}</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
          <Flex onClick={handleIntlChange}>
            <Button radius='none' variant={curIntl === 0 ? "classic" : "outline"}>EN</Button>
            <Button radius='none' variant={curIntl === 1 ? "classic" : "outline"} >中文</Button>
          </Flex>
          {/* <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Avatar
                size="2"
                className='cursor-pointer'
                radius='full'
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="A"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item>My Profile</DropdownMenu.Item>
              <DropdownMenu.Item>Sign Out</DropdownMenu.Item>
              <DropdownMenu.Item>Sign In</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root> */}

        </Flex>
      </Flex >
    </div >
  )
}

export default Header
