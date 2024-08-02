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
import { COLOR_PATTERN } from '../const';

const ScheduleModal = (
  { type, isShow, setShow }:
    { type?: number, isShow: boolean, setShow: (arg: boolean) => void }
) => {

  const dispatch = useAppDispatch();
  const { isShowDialog, scheduleKind, thickness, newPlan, action } = useAppSelector(getCalender);

  const [visible, setVisible] = useState(true);
  const [error, setErorr] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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

    setData({ ...data, startDate: date.format("YYYY-MM-DD") })
  }

  const handleEndDateChange = (date: moment.Moment) => {
    setData({ ...data, endDate: date.format("YYYY-MM-DD") })
  }

  const handleKind = (value: string) => {
    setData({ ...data, kind: value })
  }

  const handleInputChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    console.log("visisble value ", isShow);
    // if (data.kind == "-1") {
    //   setError({
    //     message: "Kind must be started",
    //     open: true
    //   })
    // } else {
    //   setError({ message: "", open: false })
    // }
    // if (moment(newPlan.endDate).isBefore(moment(newPlan.startDate))) {
    //   setError({
    //     message: "End date must be after start date",
    //     open: true
    //   })
    // } else {
    //   setError({ message: "", open: false })
    // }
    setData(newPlan);
  }, [newPlan])

  return (
    <Dialog.Root open={visible} onOpenChange={handleDialogShow} >
      <Dialog.Content >
        <Dialog.Title> Schedule</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {
            error ? (<Message message={error} />) : null
          }
        </Dialog.Description>
        <Flex direction="column" gap="3">
          <Flex direction="row" gap="3">
            <Flex direction="column">
              <span>Start Date:</span>
              <div>
                <DatePicker
                  selected={new Date(data.startDate)}
                  onChange={(startDate: Date) => handleStartDateChange(startDate)}
                  selectsStart
                  startDate={new Date(data.startDate)}
                  endDate={new Date(data.endDate)}
                />
              </div>
            </Flex>
            <Flex direction="column">
              End Date:
              <div>
                <DatePicker
                  selected={new Date(data.endDate)}
                  onChange={(endDate: Date) => handleEndDateChange(moment(endDate))}
                  selectsEnd
                  startDate={new Date(data.startDate)}
                  endDate={new Date(data.endDate)}
                  minDate={new Date(data.startDate)}
                />
              </div>
            </Flex>
            <Flex direction="column" className='w-full'>
              <div >Type:</div>
              <div className='w-full'>
                <Select.Root defaultValue={data.kind} value={data.kind} onValueChange={handleKind}>
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value={"-1"}>-SELECT-</Select.Item>
                    <Select.Group>
                      {scheduleKind.map((v: TScheduleKind, i: number) => (
                        <Select.Item key={i} value={v._id}>{v.name}</Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
            </Flex>
          </Flex>
          <Flex direction="column">
            <div>Title:</div>
            <div>
              <TextField.Root autoFocus={true} size="2" placeholder="Title" name="title" value={data.title} onChange={handleInputChange} />
            </div>
          </Flex>
          <Flex direction="column" className='w-full'>
            <div>Demo:</div>
            <div className='w-full'>
              <TextArea className='w-full'
                value={data.demo} rows={5} placeholder='Demo' name="demo" onChange={handleInputChange} ></TextArea>
            </div>
          </Flex>
          <Flex direction="column" className='w-full'>
            <div>Line Color:</div>
            <Flex className='row gap-2 flex-wrap w-full'>
              {
                COLOR_PATTERN.map((v: string, i: number) => (
                  <ColorIcon key={i} value={v} selected={v === data.color} handleClick={handleColorClick} />
                ))}
            </Flex>
          </Flex>
          <Flex direction="column" className='w-full'>
            <div>Line Thickness:</div>
            <Flex className='row gap-2 flex-wrap w-full'>
              <RadioCards.Root className='w-100' defaultValue={data.width.toString()} columns={{ initial: '1', sm: '5' }}>
                {thickness.map((v: number, i: number) => (
                  <LineThickness key={i} value={v} color={data.color} handleClick={handleLineThicknessClick} />
                ))}
              </RadioCards.Root>
            </Flex>
          </Flex>
        </Flex>
        <hr />
        <Flex gap="3" justify="end" className='pt-2'>
          <Button radius='full' color="indigo" onClick={handleSubmit}>
            Submit
          </Button>
          <Dialog.Close>
            <Button radius='full' color="gray" onClick={e => {
              dispatch(setIsShowDialog(!isShowDialog))
            }}>
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default ScheduleModal