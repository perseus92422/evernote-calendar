'use client'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Grid, Flex, Box, IconButton } from '@radix-ui/themes';
import { useAppSelector, useAppDispatch } from '@/app/redux/hook';
import { getCalender } from '@/app/redux/calenderSlice';
import { TPlan } from '../types';
import { CALENDAR_VIEW_MODE } from '../const';
import { DayDTO } from '../type/calendar';
import Day from '../components/Day';

const DatesOfMonth = (
  { startDate, endDate, date, plan }
    :
    {
      startDate: moment.Moment,
      endDate: moment.Moment,
      date: moment.Moment,
      plan: TPlan[] | undefined
    }) => {

  const { viewMode } = useAppSelector((state) => state.calendar);

  let datesCnt = endDate.diff(startDate, 'days') + 1;
  let tmpCalendar: JSX.Element[] = [];
  switch (viewMode) {
    case CALENDAR_VIEW_MODE.month1:
      for (let i = 0; i < datesCnt / 7; i++) {
        let TmpWeek: JSX.Element[] = [];
        for (let j = 0; j < 7; j++) {
          let k = j;
          if (i % 2)
            k = 6 - j
          TmpWeek.push(
            <Day
              key={i * 7 + k}
              no={i * 7 + k}
              date={startDate.clone().add(i * 7 + k, "days").format("YYYY-MM-DD")}
              month={date.clone().month()}
              datesCnt={datesCnt}
              width={2}
              plan={plan}
            />
          );
        }
        tmpCalendar.push(
          <Grid
            key={i}
            columns="7"
            gap="0"
            width="auto"
          >
            {TmpWeek}
          </Grid>
        );
      }
      break;
    case CALENDAR_VIEW_MODE.month2:
      for (let i = 0; i < datesCnt / 7; i++) {
        let tmpWeek: JSX.Element[] = [];
        for (let j = 0; j < 7; j++) {
          tmpWeek.push(
            <Day
              key={i * 7 + j}
              no={i * 7 + j}
              date={startDate.clone().add(i * 7 + j, "days").format("YYYY-MM-DD")}
              month={date.clone().month()}
              datesCnt={datesCnt}
              width={2}
              plan={plan}
            />
          );
        }
        tmpCalendar.push(
          <Grid
            key={i}
            columns="7"
            gap="0"
            width="auto"
          >
            {tmpWeek}
          </Grid>
        );
      }
      break;
    case CALENDAR_VIEW_MODE.week:
      let tmpWeek: JSX.Element[] = [];
      for (let i = 0; i < 7; i++) {
        tmpWeek.push(
          <Day
            key={i}
            no={i}
            date={date.clone().add(i, "days").format("YYYY-MM-DD")}
            month={date.clone().month()}
            width={2}
            plan={plan}
          />
        );
      }
      tmpCalendar.push(
        <Grid
          columns="7"
          gap="0"
          width="auto"
        >
          {tmpWeek}
        </Grid>
      );
      break;
    default:
      break;
  }
  return <>{tmpCalendar}</>;
}
const Calender = () => {

  const dispatch = useAppDispatch();
  const { viewMode } = useAppSelector(state => state.calendar);

  const calender_data = useAppSelector(getCalender);
  const kind = calender_data.kind;
  const date = moment(calender_data.date);

  const startDate = date.clone().startOf('month').startOf('week');
  const endDate = date.clone().endOf('month').endOf('week');
  const [monthOfDays, setMonthOfDays] = useState<Array<Array<DayDTO>>>([]);
  const [weekOfDays, setWeekOfDays] = useState([]);
  const [dayList, setDayList] = useState<Array<Array<number>>>([]);

  // useEffect(() => {
  //   console.log("type of startdate", moment().startOf('M').startOf('W').weekday(0).format('YYYY-MM-DD'))
  //   // getSchedulesAPI({ startDate, endDate }).then((schedules: any) => {
  //   //   dispatch(setPlan(schedules.data))
  //   // })
  // }, [calender_data.date, kind])

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
    console.log(tmpMonth);
    setMonthOfDays(tmpMonth);
  }, [])


  return (
    <>
      <Grid columns="1" gap="0" width="auto" className={"h-full min-h-[580px]"}>
        <Grid style={{ flexDirection: "row-reverse" }} columns="1" gap="0" width="auto" className={kind == "week" ? "h-[80px]" : "h-[580px]"}>
          {
            monthOfDays.map((week, i) => (
              <Grid
                key={i}
                columns="7"
                gap='auto'
                width="auto"
              >
                {
                  i % 2 == 0 ? (
                    week.map((day, j) => (
                      <Day
                        key={j}
                        day={day.day}
                        date={day.date}
                        weekNum={day.weekNum}
                        isOut={day.isOut}
                        isMonday={day.isMonday}
                        isSunday={day.isSunday}
                        viewMode={viewMode}
                        isLeftBottom={day.isMonday ? true : false}
                        isLeftTop={false}
                        isRightBottom={day.isSunday ? true : false}
                        isRightTop={false}
                      />
                    ))
                  ) : (
                    week.map((day, j) => (
                      <Day
                        key={j}
                        day={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].day : day.day}
                        date={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].date : day.date}
                        weekNum={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].weekNum : day.weekNum}
                        isOut={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].isOut : day.isOut}
                        isMonday={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].isSunday : day.isSunday}
                        isSunday={viewMode == CALENDAR_VIEW_MODE.month2 ? week[6 - j].isMonday : day.isMonday}
                        viewMode={viewMode}
                        isLeftBottom={false}
                        isLeftTop={week[6 - j].isSunday ? true : false}
                        isRightBottom={false}
                        isRightTop={week[6 - j].isMonday ? true : false}
                      />
                    ))
                  )
                }
              </Grid>
            ))
          }
        </Grid>
      </Grid >
    </>
  )
}

export default Calender