'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import {
  Dialog,
  Button,
  Flex,
  TextArea,
  TextField,
  Select,
  RadioCards,
  Text
} from '@radix-ui/themes'
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../../redux/hook'
import ColorIcon from './colorIcon';
import LineThickness from './lineThickness';
import Message from "../common/message"
import {
  COLOR_PATTERN,
  LINE_WIDTH_PATTERN,
  SCHEDULE_MODAL_TYPE,
  SCHEDULE_TYPES,
  CALENDAR_LOCALES
} from '../../const';
import {
  ScheduleDTO,
  NewScheduleDTO,
  UpdateScheduleDTO,
  ScheduleTypesDTO
} from '../../type';
import {
  eraseStorage,
  dateToYYYYMMDDF,
  compareDate
} from '@/app/helper';
import ENCHINTL from '@/app/lang/EN-CH.json';
import {
  createSchedule,
  updateSchedule
} from '../../api';
import { setUserProps } from '@/app/features/calendar.slice';

const ScheduleModal = (
  {
    type,
    isShow,
    activeSchedule,
    setShowModal,
    setShowDateBar,
  }:
    {
      type: SCHEDULE_MODAL_TYPE;
      isShow?: boolean;
      activeSchedule?: ScheduleDTO;
      setShowModal: (arg: boolean) => void;
      setShowDateBar: (arg: boolean) => void;
    }
) => {

  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = localStorage.getItem('token');

  const { intl } = useAppSelector((state) => state.calendar);
  const [visible, setVisible] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(activeSchedule ? new Date(activeSchedule.startDate) : new Date());
  const [endDate, setEndDate] = useState<Date>(activeSchedule ? new Date(activeSchedule.endDate) : new Date());
  const [kind, setKind] = useState<string>(activeSchedule ? activeSchedule.type : SCHEDULE_TYPES[0]);
  const [title, setTitle] = useState<string>(activeSchedule ? activeSchedule.title : "");
  const [description, setDescription] = useState<string>(activeSchedule ? activeSchedule.description : "");
  const [color, setColor] = useState<string>(activeSchedule ? activeSchedule.color : COLOR_PATTERN[0]);
  const [width, setWidth] = useState<number>(activeSchedule ? activeSchedule.width : LINE_WIDTH_PATTERN[0]);
  const handleDialogShow = () => {
    setVisible(!visible);
    setShowModal(!visible);
  }

  async function handleSubmit() {
    if (!compareDate(startDate, endDate)) {
      setError(ENCHINTL['error']['schedule']['modal']['invalid-end-date'][intl]);
      return;
    }
    if (!title) {
      setError(ENCHINTL['error']['schedule']['modal']['empty-title'][intl]);
      return;
    }
    if (!description) {
      setError(ENCHINTL['error']['schedule']['modal']['empty-content'][intl]);
      return;
    }
    if (type == SCHEDULE_MODAL_TYPE.Create) {
      let payload: NewScheduleDTO = {
        title,
        description,
        color,
        width,
        type: kind,
        startDate: dateToYYYYMMDDF(startDate),
        endDate: dateToYYYYMMDDF(endDate)
      }
      let res = await createSchedule(payload, token);
      if (res.status && res.status < 400) {
        toast.success(ENCHINTL['toast']['schedule']['create-success'][intl]);
      } else {
        const err = res as AxiosError;
        if (err.response.status == 401)
          toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
        signOutAction();
      }
    }
    if (type == SCHEDULE_MODAL_TYPE.Update && activeSchedule) {
      let payload: UpdateScheduleDTO = {};
      if (activeSchedule?.title != title)
        payload.title = title;
      if (activeSchedule?.description != description)
        payload.description = description;
      if (activeSchedule?.startDate != dateToYYYYMMDDF(startDate))
        payload.startDate = dateToYYYYMMDDF(startDate);
      if (activeSchedule?.endDate != dateToYYYYMMDDF(endDate))
        payload.endDate = dateToYYYYMMDDF(endDate);
      if (activeSchedule?.color != color)
        payload.color = color;
      if (activeSchedule?.width != width)
        payload.width = width;
      if (activeSchedule?.type != kind)
        payload.type = kind;
      const res = await updateSchedule(activeSchedule.id, payload, token);
      if (res.status && res.status < 400) {
        toast.success(ENCHINTL['toast']['schedule']['update-success'][intl]);
      } else {
        const err = res as AxiosError;
        if (err.response.status == 401)
          toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
        signOutAction();
      }
    }
    setShowDateBar(false);
    initState();
  }

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  }

  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
  }

  const handleChangeKind = (value: string) => {
    setKind(value);
  }

  const handleColorChange = (value: string) => {
    setColor(value);
  }

  const handleWidthChange = (value: number) => {
    setWidth(width);
  }

  const initState = () => {
    setVisible(!visible);
    setShowModal(!visible);
    setKind(SCHEDULE_TYPES[0]);
    setError("");
    setStartDate(new Date());
    setEndDate(new Date());
    setTitle("");
    setDescription("");
    setColor(COLOR_PATTERN[0]);
    setWidth(LINE_WIDTH_PATTERN[0]);
  }

  const signOutAction = () => {
    eraseStorage();
    dispatch(setUserProps(null));
    router.push('/auth/signin');
  }

  return (
    <Dialog.Root open={visible} onOpenChange={handleDialogShow} >
      <Dialog.Content >
        <Dialog.Title>
          {
            type == SCHEDULE_MODAL_TYPE.Create ? ENCHINTL['modal']['schedule']['title-d']['create'][intl] : null
          }
          {
            type == SCHEDULE_MODAL_TYPE.Update ? ENCHINTL['modal']['schedule']['title-d']['update'][intl] : null
          }
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">

        </Dialog.Description>
        {
          error ? (<Message message={error} />) : null
        }
        <Flex direction="column" gap="3">
          <Flex direction="row" gap="3">
            <Flex direction="column">
              <Text as="p">{ENCHINTL['modal']['schedule']['start-date-p'][intl]}:</Text>
              <DatePicker
                locale={CALENDAR_LOCALES[intl]}
                selected={startDate}
                onChange={(date: Date) => handleStartDateChange(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
              />
            </Flex>
            <Flex direction="column">
              <Text as="p">{ENCHINTL['modal']['schedule']['end-date-p'][intl]}</Text>
              <DatePicker
                locale={CALENDAR_LOCALES[intl]}
                selected={endDate}
                onChange={(date: Date) => handleEndDateChange(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
              />
            </Flex>
            <Flex direction="column" className='w-full'>
              <Text as="p" >{ENCHINTL['modal']['schedule']['type-p'][intl]}:</Text>
              <Select.Root defaultValue={kind} value={kind} onValueChange={handleChangeKind}>
                <Select.Trigger />
                <Select.Content>
                  <Select.Group>
                    {
                      Object.keys(ENCHINTL.modal.schedule.types).map((v, i) => (
                        <Select.Item key={i} value={v}>{ENCHINTL.modal.schedule.types[v as keyof ScheduleTypesDTO][intl]}</Select.Item>
                      ))
                    }
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Flex>
          </Flex>
          <Flex direction="column" py="2" gap="1">
            <Text as='p'>{ENCHINTL['modal']['schedule']['title-p'][intl]}:</Text>
            <TextField.Root
              autoFocus={true}
              size="2"
              placeholder={ENCHINTL['modal']['schedule']['title-textfield-holder'][intl]}
              value={title}
              onChange={(e) => { setTitle(e.target.value) }} />
          </Flex>
          <Flex direction="column" py="2" gap="1">
            <Text as='p'>{ENCHINTL['modal']['schedule']['description-p'][intl]}</Text>
            <TextArea
              value={description}
              rows={5}
              placeholder={ENCHINTL['modal']['schedule']['description-textarea-holder'][intl]}
              onChange={(e) => { setDescription(e.target.value) }} />
          </Flex>
          <Flex direction="column" className='w-full'>
            <Text as="p">{ENCHINTL['modal']['schedule']['color-bar-p'][intl]}</Text>
            <Flex className='row gap-2 flex-wrap w-full'>
              {
                COLOR_PATTERN.map((v: string, i: number) => (
                  <ColorIcon key={i} value={v} selected={v === color} handleClick={handleColorChange} />
                ))}
            </Flex>
          </Flex>
          <Flex direction="column" className='w-full'>
            <Text as="p">{ENCHINTL['modal']['schedule']['width-bar-p'][intl]}</Text>
            <Flex className='row gap-2 flex-wrap w-full'>
              <RadioCards.Root className='w-100' defaultValue={width.toString()} columns={{ initial: '1', sm: '5' }}>
                {
                  LINE_WIDTH_PATTERN.map((v: number, i: number) => (
                    <LineThickness key={i} value={v} color={color} handleClick={handleWidthChange} />
                  ))
                }
              </RadioCards.Root>
            </Flex>
          </Flex>
        </Flex>
        <hr />
        <Flex gap="3" justify="end" className='pt-2'>
          <Button radius='full' color="indigo" onClick={handleSubmit}>
            {ENCHINTL['modal']['schedule']['button']['submit'][intl]}
          </Button>
          <Dialog.Close>
            <Button radius='full' color="gray" onClick={handleDialogShow}>
              {ENCHINTL['modal']['schedule']['button']['close'][intl]}
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default ScheduleModal