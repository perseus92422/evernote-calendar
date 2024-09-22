'use client'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { AxiosError, AxiosResponse } from 'axios';
import {
  Grid,
  Flex,
  Tabs,
  Box,
} from '@radix-ui/themes';
import {
  Cross1Icon
} from '@radix-ui/react-icons';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '@/app/redux/hook';
import Day from './components/calendar/Day';
import ScheduleTab from './components/schedule/ScheduleTab';
import TodoListTab from './components/todolist/TodoListTab';
import ToolTar from './components/calendar/ToolBar';
import ENCHINTL from '@/app/lang/EN-CH.json';
import {
  CALENDAR_VIEW_MODE,
} from './const';
import {
  DayDTO,
  ScheduleDTO
} from './type';
import { findAllScheduleByMonth } from './api';
import { eraseStorage, dateToYYYYMMDDF, getMonth, getYear, } from './helper';
import { setUserProps } from './features/calendar.slice';



const Calender = () => {

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { intl, user } = useAppSelector(state => state.calendar);
  const [monthOfDays, setMonthOfDays] = useState<Array<Array<DayDTO>>>([]);
  const [initFlag, setInitFlag] = useState<boolean>(true);
  const [weekOfDays, setWeekOfDays] = useState([]);
  const [datebarShow, setDateBarShow] = useState<boolean>(false);
  const [activeDate, setActiveDate] = useState<string>(dateToYYYYMMDDF(new Date()));
  const [viewMode, setViewMode] = useState<CALENDAR_VIEW_MODE>(CALENDAR_VIEW_MODE.month1);
  const [isReload, setIsReload] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>(null);

  const handleDateClick = (date: string) => {
    if (Math.abs(getMonth(date) - getMonth(activeDate)) > 0) {
      setInitFlag(true);
    }
    setActiveDate(date);
    setDateBarShow(true);
  }

  const handleDateBarShow = () => {
    setDateBarShow(false);
  }

  const handlerInitCalendarDayList = (schedules: Array<Array<ScheduleDTO>>) => {
    let tmpMonth: Array<Array<DayDTO>> = [];
    const start = moment(activeDate).startOf('M').startOf('W');
    const end = moment(activeDate).endOf('M').endOf('W');
    const currentMonth = moment(activeDate).month();
    const countOfDays = end.diff(start, 'days') + 1;
    const countOfWeeks = countOfDays / 7;
    for (let i = 0; i < countOfWeeks; i++) {
      let tmpWeek: Array<DayDTO> = [];
      for (let j = 0; j < 7; j++) {
        let tmpDay = moment(start).add(i * 7 + j, 'day');
        tmpWeek.push({
          day: tmpDay.date(),
          date: tmpDay.format('YYYY-MM-DD'),
          weekNum: i,
          isOut: tmpDay.month() == currentMonth ? false : true,
          isMonday: (tmpDay.weekday() == 0 && (i + j) != 0) ? true : false,
          isSunday: (tmpDay.weekday() == 6 && ((i + 1) * (j + 1)) != countOfDays) ? true : false,
          schedules: schedules[i * 7 + j]
        });
      }
      tmpMonth.push(tmpWeek);
    }
    setMonthOfDays(tmpMonth);
  }

  const signOutAction = () => {
    eraseStorage();
    dispatch(setUserProps(null));
    router.push('/auth/signin');
  }

  async function getCalendarSchedules(month: number, year: number) {
    const token = localStorage.getItem('token');
    const res = await findAllScheduleByMonth(token, month, year);
    if (res.status && res.status < 400) {
      const result = res as AxiosResponse;
      handlerInitCalendarDayList(result.data as Array<Array<ScheduleDTO>>);
    } else {
      const err = res as AxiosError;
      if (err.response.status == 401) {
        toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
        signOutAction();
      }
    }
  }

  useEffect(() => {
    if (initFlag) {
      getCalendarSchedules(getMonth(activeDate), getYear(activeDate));
    }
    setInitFlag(false);
  }, [activeDate]);

  useLayoutEffect(() => {
    const token = localStorage.getItem('token');
    if (!token)
      router.push('/auth/signin');
    else
      setAccessToken(token);
  }, [])

  return (
    <div>
      <ToolTar
        intl={intl}
        viewMode={viewMode}
        activeDate={activeDate}
        setViewMode={setViewMode}
        setActiveDate={setActiveDate}
        setInitFlag={setInitFlag}
      />
      <Flex gap="8" direction="row">
        <div className={datebarShow ? 'w-1/2' : 'w-full'}>
          <Grid justify="center" columns="7" rows="6" gap="0" width="auto" className={"h-full min-h-[580px]"} >
            {
              monthOfDays.map((week, i) => (
                i % 2 == 0 ? (
                  week.map((day, j) => (
                    <Day
                      key={j}
                      day={day.day}
                      date={day.date}
                      activeDate={activeDate}
                      weekNum={day.weekNum}
                      isOut={day.isOut}
                      isMonday={day.isMonday}
                      isSunday={day.isSunday}
                      viewMode={viewMode}
                      isLeftBottom={day.isMonday ? true : false}
                      isLeftTop={false}
                      isRightBottom={day.isSunday ? true : false}
                      isRightTop={false}
                      schedules={day.schedules}
                      dateBarHandler={handleDateClick}
                    />
                  ))
                ) : (
                  week.map((day, j) => (
                    <Day
                      key={j}
                      day={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].day : day.day}
                      date={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].date : day.date}
                      activeDate={activeDate}
                      weekNum={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].weekNum : day.weekNum}
                      isOut={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].isOut : day.isOut}
                      isMonday={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].isSunday : day.isSunday}
                      isSunday={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].isMonday : day.isMonday}
                      viewMode={viewMode}
                      isLeftBottom={false}
                      isLeftTop={week[6 - j].isSunday ? true : false}
                      isRightBottom={false}
                      isRightTop={week[6 - j].isMonday ? true : false}
                      schedules={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].schedules : day.schedules}
                      dateBarHandler={handleDateClick}
                    />
                  ))
                )
              ))
            }
          </Grid >
        </div>
        {
          datebarShow ? (
            <div className='w-1/2 max-h-[800px] overflow-auto'>
              <Flex direction="row-reverse">
                <Cross1Icon onClick={handleDateBarShow} />
              </Flex>
              <Tabs.Root defaultValue="schedule" >
                <Tabs.List>
                  <Tabs.Trigger value="schedule">{ENCHINTL['side-bar']['schedule']['tab'][intl]}</Tabs.Trigger>
                  <Tabs.Trigger value="todolist">{ENCHINTL['side-bar']['todolist']['tab'][intl]}</Tabs.Trigger>
                </Tabs.List>
                <Box pt="3">
                  <Tabs.Content value="schedule">
                    <ScheduleTab
                      intl={intl}
                      user={user}
                      token={accessToken}
                      activeDate={activeDate}
                      signOutAction={signOutAction}
                    />
                  </Tabs.Content>
                  <Tabs.Content value="todolist">
                    <TodoListTab
                      intl={intl}
                      user={user}
                      token={accessToken}
                      activeDate={activeDate}
                      signOutAction={signOutAction}
                    />
                  </Tabs.Content>
                </Box>
              </Tabs.Root>
            </div>
          ) : null
        }
      </Flex>
    </div>


  )
}

export default Calender