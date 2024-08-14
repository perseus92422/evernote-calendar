'use client'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import {
  Grid,
  Flex,
  Tabs,
  Box,
  Text,
  Button,
  Strong,
  HoverCard
} from '@radix-ui/themes';
import {
  Cross1Icon,
  TrashIcon,
  Pencil1Icon
} from '@radix-ui/react-icons';
import { useAppSelector, useAppDispatch } from '@/app/redux/hook';
import { CALENDAR_VIEW_MODE } from '../const';
import { DayDTO, ScheduleDTO } from '../type';
import Day from '../components/Day';
import ENCHINTL from '@/app/lang/EN-CH.json';
import ScheduleModal from '../components/ScheduleModal';
import ScheduleBar from '../components/ScheduleBar';
import NoteModal from '../components/NoteModal';
import { SCHEDULE_MODAL_TYPE } from '../const';
import { NOTE_MODAL_TYPE } from '../const';
import { dateToYYYYMMDDF } from '../helper/util';
import NoteTab from '../components/NoteTab';
import ScheduleTab from '../components/ScheduleTab';

const Calender = () => {

  const dispatch = useAppDispatch();
  const { viewMode, intl } = useAppSelector(state => state.calendar);
  const [monthOfDays, setMonthOfDays] = useState<Array<Array<DayDTO>>>([]);
  const [weekOfDays, setWeekOfDays] = useState([]);
  const [noteModal, setNoteModal] = useState<boolean>(false);
  const [scheduleModal, setScheduleModal] = useState<boolean>(false);
  const [todolistModal, setTodoListModal] = useState<boolean>(false);
  const [datebarShow, setDateBarShow] = useState<boolean>(false);
  const [activeDate, setActiveDate] = useState<string>(dateToYYYYMMDDF(new Date()));
  const [scheduleList, setScheduleList] = useState<Array<ScheduleDTO>>([]);
  const [noteList, setNotList] = useState();
  const [todolist, setTodoList] = useState();

  const handleDateClick = (date: string) => {
    setActiveDate(date);
    setDateBarShow(true);
  }

  const handleNewScheduleBtnClick = () => {
    setScheduleModal(true);
  }

  const handleNewNoteBtnClick = () => {
    setNoteModal(true);
  }

  const handleNewTodoListBtnClick = () => {
    setTodoListModal(true);
  }

  const handleDateBarShow = () => {
    setDateBarShow(false);
  }

  const handleScheduleBarEdit = () => {

  }

  const handleScheduleBarRemove = () => {

  }

  useEffect(() => {
    let tmpMonth: Array<Array<DayDTO>> = [];
    const start = moment().startOf('M').startOf('W');
    const end = moment().endOf('M').endOf('W');
    const currentMonth = moment().month();
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
        });
      }
      tmpMonth.push(tmpWeek);
    }
    setMonthOfDays(tmpMonth);
  }, []);


  return (
    <Flex gap="8" direction="row">
      <div className={datebarShow ? 'w-1/2' : 'w-full'}>
        <Grid justify="center" columns="7" rows="5" gap="0" width="auto" className={"h-full min-h-[580px]"} >
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
            {
              scheduleModal ? (
                <ScheduleModal
                  isShow={scheduleModal}
                  setShowModal={setScheduleModal}
                  setShowDateBar={setDateBarShow}
                  type={SCHEDULE_MODAL_TYPE.Create}
                />) : null
            }
            {
              noteModal ? (
                <NoteModal
                  isShow={noteModal}
                  setShow={setNoteModal}
                  activeDate={activeDate}
                  type={NOTE_MODAL_TYPE.Create}
                />
              ) : null
            }
            <Flex direction="row-reverse">
              <Cross1Icon onClick={handleDateBarShow} />
            </Flex>
            <Tabs.Root defaultValue="note" >
              <Tabs.List>
                <Tabs.Trigger value="note">{ENCHINTL['side-bar']['note']['tab'][intl]}</Tabs.Trigger>
                <Tabs.Trigger value="schedule">{ENCHINTL['side-bar']['schedule']['tab'][intl]}</Tabs.Trigger>
                <Tabs.Trigger value="todolist">{ENCHINTL['side-bar']['todolist']['tab'][intl]}</Tabs.Trigger>
              </Tabs.List>
              <Box pt="3">
                <Tabs.Content value="note">
                  <NoteTab intl={intl} handleNewBtnHandler={handleNewNoteBtnClick} />


                </Tabs.Content>
                <Tabs.Content value="schedule">
                  <ScheduleTab
                    intl={intl}
                    activeDate={activeDate}
                    setShowDateBar={setDateBarShow}
                    handleNewClickBtn={handleNewScheduleBtnClick}
                  />
                </Tabs.Content>
                <Tabs.Content value="todolist">
                  <Flex direction="row-reverse">
                    <Button onClick={handleNewTodoListBtnClick}>{ENCHINTL['side-bar']['note']['new-btn'][intl]}</Button>
                  </Flex>
                  <Text as='p' size="4"><Strong>{ENCHINTL['side-bar']['todolist']['today-p'][intl]}</Strong></Text>
                  <Text as='p' size="4"><Strong>{ENCHINTL['side-bar']['todolist']['all-p'][intl]}</Strong></Text>
                </Tabs.Content>
              </Box>
            </Tabs.Root>
          </div>
        ) : null
      }

    </Flex>

  )
}

export default Calender