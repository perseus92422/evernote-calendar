'use client'
import React, { useEffect } from 'react'
import moment from 'moment';
import { Grid } from '@radix-ui/themes';
import { useAppSelector, useAppDispatch } from '@/app/redux/hook';
import { getCalender } from '@/app/redux/calenderSlice';
import OneDay from '../components/oneDay';
import { TPlan } from '../types';


const DatesOfMonth = (
  { startDate, endDate, date, kind, plan }
    :
    {
      startDate: moment.Moment,
      endDate: moment.Moment,
      date: moment.Moment,
      kind: string,
      plan: TPlan[] | undefined
    }) => {

  const { viewMode } = useAppSelector((state) => state.calendar);

  let datesCnt = endDate.diff(startDate, 'days') + 1;
  let day: JSX.Element[] = [];
  if (kind == "month_1") {
    for (let i = 0; i < datesCnt / 7; i++) {
      let inner_item: JSX.Element[] = [];
      for (let j = 0; j < 7; j++) {
        let k = j;
        if (i % 2)
          k = 6 - j
        inner_item.push(
          <OneDay
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
      day.push(
        <Grid
          key={i}
          columns="7"
          gap="0"
          width="auto"
        >
          {inner_item}
        </Grid>
      );
    }
  } else if (kind == "month_2") {
    for (let i = 0; i < datesCnt / 7; i++) {
      let inner_item: JSX.Element[] = [];
      for (let j = 0; j < 7; j++) {
        inner_item.push(
          <OneDay
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
      day.push(
        <Grid
          key={i}
          columns="7"
          gap="0"
          width="auto"
        >
          {inner_item}
        </Grid>
      );
    }
  } else if (kind == "week") {
    let inner_item: JSX.Element[] = [];
    for (let i = 0; i < 7; i++) {
      inner_item.push(
        <OneDay
          key={i}
          no={i}
          date={date.clone().add(i, "days").format("YYYY-MM-DD")}
          month={date.clone().month()}
          width={2}
          plan={plan}
        />
      );
    }
    day.push(
      <Grid
        columns="7"
        gap="0"
        width="auto"
      >
        {inner_item}
      </Grid>
    );
  }
  return <>{day}</>;
}
const Calender = () => {

  const dispatch = useAppDispatch();

  const calender_data = useAppSelector(getCalender);
  const kind = calender_data.kind;
  const date = moment(calender_data.date);

  const startDate = date.clone().startOf('month').startOf('week');
  const endDate = date.clone().endOf('month').endOf('week');

  // useEffect(() => {
  //   console.log("type of startdate", moment().startOf('M').startOf('W').weekday(0).format('YYYY-MM-DD'))
  //   // getSchedulesAPI({ startDate, endDate }).then((schedules: any) => {
  //   //   dispatch(setPlan(schedules.data))
  //   // })
  // }, [calender_data.date, kind])


  return (
    <>
      <Grid columns="1" gap="0" width="auto" className={"h-full min-h-[580px]"}>
        <Grid columns="1" gap="0" width="auto" className={kind == "week" ? "h-[80px]" : "h-[580px]"}>
          <DatesOfMonth
            startDate={startDate}
            endDate={endDate}
            date={date}
            kind={kind}
            plan={calender_data.plan}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default Calender