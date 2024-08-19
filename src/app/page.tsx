'use client'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import {
  Grid,
  Flex,
  Tabs,
  Box,
} from '@radix-ui/themes';
import {
  Cross1Icon
} from '@radix-ui/react-icons';
import { useAppSelector, useAppDispatch } from '@/app/redux/hook';
import Day from './components/calendar/Day';
import ScheduleModal from './components/schedule/ScheduleModal';
import NoteModal from './components/note/NoteModal';
import TodoListModal from './components/todolist/TodoListModal';
import ScheduleTab from './components/schedule/ScheduleTab';
import NoteTab from './components/note/NoteTab';
import TodoListTab from './components/todolist/TodoListTab';
import ToolTar from './components/calendar/ToolBar';
import ENCHINTL from '@/app/lang/EN-CH.json';
import {
  SCHEDULE_MODAL_TYPE,
  NOTE_MODAL_TYPE,
  TODOLIST_MODAL_TYPE,
  CALENDAR_VIEW_MODE,
} from './const';
import { DayDTO } from './type';
import { dateToYYYYMMDDF } from './helper/util';



const Calender = () => {

  const { intl } = useAppSelector(state => state.calendar);
  const [monthOfDays, setMonthOfDays] = useState<Array<Array<DayDTO>>>([]);
  const [weekOfDays, setWeekOfDays] = useState([]);
  const [noteModal, setNoteModal] = useState<boolean>(false);
  const [scheduleModal, setScheduleModal] = useState<boolean>(false);
  const [todolistModal, setTodoListModal] = useState<boolean>(false);
  const [datebarShow, setDateBarShow] = useState<boolean>(false);
  const [activeDate, setActiveDate] = useState<string>(dateToYYYYMMDDF(new Date()));
  const [viewMode, setViewMode] = useState<CALENDAR_VIEW_MODE>(CALENDAR_VIEW_MODE.month1)

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


  const handlerInitCalendarDayList = () => {
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
        });
      }
      tmpMonth.push(tmpWeek);
    }
    setMonthOfDays(tmpMonth);
  }

  useEffect(() => {
    handlerInitCalendarDayList();
  }, [activeDate]);


  return (
    <div>
      <ToolTar
        intl={intl}
        viewMode={viewMode}
        activeDate={activeDate}
        setViewMode={setViewMode}
        setActiveDate={setActiveDate}
      />
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
                    setShowModal={setNoteModal}
                    setShowDateBar={setDateBarShow}
                    activeDate={activeDate}
                    type={NOTE_MODAL_TYPE.Create}
                  />
                ) : null
              }
              {
                todolistModal ? (
                  <TodoListModal
                    intl={intl}
                    isShow={todolistModal}
                    type={TODOLIST_MODAL_TYPE.Create}
                    activeDate={activeDate}
                    setShowModal={setTodoListModal}
                    setShowDateBar={setDateBarShow}
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
                    <NoteTab
                      intl={intl}
                      activeDate={activeDate}
                      setShowDateBar={setDateBarShow}
                      handleNewBtnClick={handleNewNoteBtnClick}
                    />
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
                    <TodoListTab
                      intl={intl}
                      activeDate={activeDate}
                      handleNewBtnClick={handleNewTodoListBtnClick}
                      setShowDateBar={setDateBarShow}
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