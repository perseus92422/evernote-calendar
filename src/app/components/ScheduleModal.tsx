'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, Button, Flex, TextArea, TextField, Select, RadioCards } from '@radix-ui/themes'
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import moment from 'moment';
import { TPlan, TScheduleKind } from '../type';
import { useAppDispatch, useAppSelector } from '../redux/hook'
import { setIsShowDialog, getCalender, updatePlan, addPlan } from '../redux/calenderSlice'
import { updateScheduleAPI, addScheduleAPI } from '../api/schedule'
import ColorIcon from './colorIcon';
import LineThickness from './lineThickness';
import Message from "./message"
import { COLOR_PATTERN, LINE_WIDTH_PATTERN, SCHEDULE_MODAL_TYPE, CALENDAR_LOCALES } from '../const';
import { dateToYYYYMMDDF } from '../helper/util';
import ENCHINTL from '@/app/lang/EN-CH.json';

const ScheduleModal = (
  { type, isShow, setShow }:
    { type: SCHEDULE_MODAL_TYPE, isShow: boolean, setShow: (arg: boolean) => void }
) => {

  const dispatch = useAppDispatch();
  const { isShowDialog, scheduleKind, newPlan, intl } = useAppSelector(getCalender);
  const [visible, setVisible] = useState<boolean>(true);
  const [error, setErorr] = useState(null);
  const [startDate, setStartDate] = useState<String>("");
  const [endDate, setEndDate] = useState<String>("");
  const [kind, setKind] = useState<string>("0");

  const [data, setData] = useState<TPlan>(newPlan)
  // const [error, setError] = useState({
  //   message: "",
  //   open: false
  // });


  const handleColorClick = (e: string) => {
    setData({ ...data, color: e })
  }

  const handleLineThicknessClick = (e: number) => {
    setData({ ...data, width: e })
  }

  const handleDialogShow = () => {
    setVisible(!visible);
    setShow(!visible)
  }

  const handleSubmit = () => {
    // if (moment(data.endDate).isBefore(data.startDate)) {
    //   setError({
    //     message: "End date must be after start date",
    //     open: true
    //   })
    //   return
    // }
    // if (data.kind == "-1" || data.kind == "") {
    //   setError({
    //     message: "Kind must be selected",
    //     open: true
    //   })
    //   return
    // }
    // if (data.title == "") {
    //   setError({
    //     message: "Title must be required",
    //     open: true
    //   })
    //   return
    // }
    // if (data.demo == "") {
    //   setError({
    //     message: "Demo must be required",
    //     open: true
    //   })
    //   return
    // }
    // if (action == "Edit") {
    //   updateScheduleAPI(data).then((schedule) => {
    //     dispatch(updatePlan(schedule.data))
    //     dispatch(setIsShowDialog(!isShowDialog))
    //     toast.info("Plan is updated");
    //   }).catch(() => {
    //     setError({
    //       message: "Server Error.",
    //       open: true
    //     })
    //   })
    // } else if ("Create") {
    //   addScheduleAPI(data).then((schedule) => {
    //     dispatch(addPlan(schedule.data))
    //     dispatch(setIsShowDialog(!isShowDialog))
    //     toast.info("Plan is added newly");
    //   }).catch(() => {
    //     setError({
    //       message: "Server Error.",
    //       open: true
    //     })
    //   })
    // }
  }

  const handleStartDateChange = (date: Date) => {
    setStartDate(dateToYYYYMMDDF(date));
    // setData({ ...data, startDate: date.format("YYYY-MM-DD") })
  }

  const handleEndDateChange = (date: Date) => {
    setEndDate(dateToYYYYMMDDF(date))
    // setData({ ...data, endDate: date.format("YYYY-MM-DD") })
  }

  const handleKind = (value: string) => {
    setData({ ...data, kind: value })
  }

  const handleInputChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  // useEffect(() => {
  //   console.log("visisble value ", isShow);
  //   // if (data.kind == "-1") {
  //   //   setError({
  //   //     message: "Kind must be started",
  //   //     open: true
  //   //   })
  //   // } else {
  //   //   setError({ message: "", open: false })
  //   // }
  //   // if (moment(newPlan.endDate).isBefore(moment(newPlan.startDate))) {
  //   //   setError({
  //   //     message: "End date must be after start date",
  //   //     open: true
  //   //   })
  //   // } else {
  //   //   setError({ message: "", open: false })
  //   // }
  //   setData(newPlan);
  // }, [newPlan])

  return (
    <Dialog.Root open={visible} onOpenChange={handleDialogShow} >
      <Dialog.Content >
        <Dialog.Title>
          {
            type == SCHEDULE_MODAL_TYPE.Create ? ENCHINTL['create-schedule-title'][intl] : null
          }
          {
            type == SCHEDULE_MODAL_TYPE.Update ? ENCHINTL['update-schedule-title'][intl] : null
          }
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {
            error ? (<Message message={error} />) : null
          }
        </Dialog.Description>
        <Flex direction="column" gap="3">
          <Flex direction="row" gap="3">
            <Flex direction="column">
              <span>{ENCHINTL['start-date'][intl]}:</span>
              <div>
                <DatePicker
                  locale={CALENDAR_LOCALES[intl]}
                  selected={new Date(data.startDate)}
                  onChange={(date: Date) => handleStartDateChange(date)}
                  selectsStart
                  startDate={new Date(data.startDate)}
                  endDate={new Date(data.endDate)}
                />
              </div>
            </Flex>
            <Flex direction="column">
              <span>{ENCHINTL['end-date'][intl]}:</span>
              <div>
                <DatePicker
                  locale={CALENDAR_LOCALES[intl]}
                  selected={new Date(data.endDate)}
                  onChange={(date: Date) => handleEndDateChange(date)}
                  selectsEnd
                  startDate={new Date(data.startDate)}
                  endDate={new Date(data.endDate)}
                  minDate={new Date(data.startDate)}
                />
              </div>
            </Flex>
            <Flex direction="column" className='w-full'>
              <div >{ENCHINTL['schedule-type'][intl]}:</div>
              <div className='w-full'>
                <Select.Root defaultValue={kind} value={data.kind} onValueChange={handleKind}>
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Group>
                      {scheduleKind.map((v: TScheduleKind, i: number) => (
                        <Select.Item key={i} value={i.toString()}>{v.name}</Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
            </Flex>
          </Flex>
          <Flex direction="column">
            <p>{ENCHINTL['schedule-title'][intl]}:</p>
            <div>
              <TextField.Root
                autoFocus={true}
                size="2"
                placeholder={ENCHINTL['schedule-title-holder'][intl]}
                value={data.title}
                onChange={handleInputChange} />
            </div>
          </Flex>
          <Flex direction="column" className='w-full'>
            <p>{ENCHINTL['schedule-description'][intl]}:</p>
            <div className='w-full'>
              <TextArea
                className='w-full'
                value={data.demo}
                rows={5}
                placeholder={ENCHINTL['schedule-description-holder'][intl]}
                onChange={handleInputChange} />
            </div>
          </Flex>
          <Flex direction="column" className='w-full'>
            <p>{ENCHINTL['schedule-color-bar'][intl]}:</p>
            <Flex className='row gap-2 flex-wrap w-full'>
              {
                COLOR_PATTERN.map((v: string, i: number) => (
                  <ColorIcon key={i} value={v} selected={v === data.color} handleClick={handleColorClick} />
                ))}
            </Flex>
          </Flex>
          <Flex direction="column" className='w-full'>
            <p>{ENCHINTL['schedule-width-bar'][intl]}:</p>
            <Flex className='row gap-2 flex-wrap w-full'>
              <RadioCards.Root className='w-100' defaultValue={data.width.toString()} columns={{ initial: '1', sm: '5' }}>
                {
                  LINE_WIDTH_PATTERN.map((v: number, i: number) => (
                    <LineThickness key={i} value={v} color={data.color} handleClick={handleLineThicknessClick} />
                  ))
                }
              </RadioCards.Root>
            </Flex>
          </Flex>
        </Flex>
        <hr />
        <Flex gap="3" justify="end" className='pt-2'>
          <Button radius='full' color="indigo" onClick={handleSubmit}>
            {ENCHINTL['submit-btn'][intl]}
          </Button>
          <Dialog.Close>
            <Button radius='full' color="gray" onClick={handleDialogShow}>
              {ENCHINTL['close-btn'][intl]}
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default ScheduleModal