'use client'
import React, { useState } from 'react'
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
import ColorIcon from './colorIcon';
import LineThickness from './lineThickness';
import Message from "../common/message"
import {
  COLOR_PATTERN,
  LINE_WIDTH_PATTERN,
  MODAL_TYPE,
  PUBLIC_TYPE,
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
  dateToYYYYMMDDF,
  compareDate
} from '@/app/helper';
import ENCHINTL from '@/app/lang/EN-CH.json';


const ScheduleModal = (
  {
    intl,
    type,
    publicMode,
    workspaceId,
    schedule,
    setShowModal,
    createSchedule,
    updateSchedule
  }:
    {
      intl: number;
      type: MODAL_TYPE;
      publicMode: PUBLIC_TYPE;
      workspaceId?: number;
      schedule?: ScheduleDTO;
      setShowModal: (arg: boolean) => void;
      createSchedule: (payload: NewScheduleDTO) => void;
      updateSchedule: (payload: UpdateScheduleDTO) => void;
    }
) => {

  const [visible, setVisible] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(schedule ? new Date(schedule.startDate) : new Date());
  const [endDate, setEndDate] = useState<Date>(schedule ? new Date(schedule.endDate) : new Date());
  const [kind, setKind] = useState<string>(schedule ? schedule.type : SCHEDULE_TYPES[0]);
  const [title, setTitle] = useState<string>(schedule ? schedule.title : "");
  const [description, setDescription] = useState<string>(schedule ? schedule.description : "");
  const [color, setColor] = useState<string>(schedule ? schedule.color : COLOR_PATTERN[0]);
  const [width, setWidth] = useState<number>(schedule ? schedule.width : LINE_WIDTH_PATTERN[0]);

  const handlerDialogShow = () => {
    setVisible(!visible);
    setShowModal(!visible);
  }

  const handlerSubmit = () => {
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
    if (type == MODAL_TYPE.Create) {
      let payload: NewScheduleDTO = {
        title,
        description,
        color,
        width,
        type: kind,
        startDate: dateToYYYYMMDDF(startDate),
        endDate: dateToYYYYMMDDF(endDate)
      }
      if (workspaceId && publicMode == PUBLIC_TYPE.WorkSpace)
        payload.workspaceId = workspaceId;
      createSchedule(payload);
    }
    if (type == MODAL_TYPE.Update) {
      let payload: UpdateScheduleDTO = {};
      if (schedule?.title != title)
        payload.title = title;
      if (schedule?.description != description)
        payload.description = description;
      if (schedule?.startDate != dateToYYYYMMDDF(startDate))
        payload.startDate = dateToYYYYMMDDF(startDate);
      if (schedule?.endDate != dateToYYYYMMDDF(endDate))
        payload.endDate = dateToYYYYMMDDF(endDate);
      if (schedule?.color != color)
        payload.color = color;
      if (schedule?.width != width)
        payload.width = width;
      if (schedule?.type != kind)
        payload.type = kind;
      updateSchedule(payload);
    }
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

  return (
    <Dialog.Root open={visible} onOpenChange={handlerDialogShow} >
      <Dialog.Content >
        <Dialog.Title>
          {
            type == MODAL_TYPE.Create ? ENCHINTL['modal']['schedule']['title-d']['create'][intl] : null
          }
          {
            type == MODAL_TYPE.Update ? ENCHINTL['modal']['schedule']['title-d']['update'][intl] : null
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
          <Button radius='full' color="indigo" onClick={handlerSubmit}>
            {ENCHINTL['modal']['schedule']['button']['submit'][intl]}
          </Button>
          <Dialog.Close>
            <Button radius='full' color="gray" onClick={handlerDialogShow}>
              {ENCHINTL['modal']['schedule']['button']['close'][intl]}
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default ScheduleModal