'use client'
import React, { useEffect, useState } from 'react'
import { Popover, Flex, Link, IconButton, Badge, Text } from '@radix-ui/themes'
import { Pencil1Icon, Cross2Icon, TrashIcon, PlusIcon } from '@radix-ui/react-icons'
import moment from 'moment'
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '@/app/redux/hook';
import { getCalender, setIsShowDialog, setAction, setNewPlan, deletePlan } from '@/app/redux/calenderSlice';
import { deleteScheduleAPI } from '../api/schedule.api'
import Alert from './alert';
import { TPlan, TScheduleKind } from '../types';

function cutString(str: string) {
  if (str.length > 10) {
    return str.substring(0, 10) + " ...";
  }
  return str;
}

const TaskShow = () => {
  const dispatch = useAppDispatch();
  const { plan, scheduleKind } = useAppSelector(getCalender);
  const date = moment(useAppSelector(getCalender).date)
  const [data, setData] = useState<TPlan | undefined>(plan == undefined ? undefined : plan[0])
  const handleDataShow = (i: number) => {
    setData(plan == undefined ? undefined : plan[i]);
  }
  const handleEdit = (data: TPlan | undefined) => {
    dispatch(setAction("Edit"));
    dispatch(setNewPlan(data));
    dispatch(setIsShowDialog(true));
  }
  const handleCreate = (date: moment.Moment) => {
    dispatch(setNewPlan({
      id: "",
      color: 'indigo',
      width: 2,
      startDate: date.format("YYYY-MM-DD"),
      endDate: date.format("YYYY-MM-DD"),
      demo: "",
      kind: "",
      title: "",
      user: {
        id: "",
        name: "",
        email: "",
      }
    }))
    dispatch(setAction("Create"))
    dispatch(setIsShowDialog(true))
  }
  const handleDeleteCancel = () => {

  }
  const handleDeleteOk = (id: string) => {
    deleteScheduleAPI(id).then((schedule) => {
      dispatch(deletePlan(schedule.data.id))
      toast.info("Plan is deleted");
    }).catch(() => {

    })
  }
  useEffect(() => {
    if (plan !== undefined) {
      for (let i = 0; plan.length; i++) {
        if (plan[i] == undefined) {
          setData(undefined);
          break;
        }
        if (date.isBetween(plan[i].startDate, plan[i].endDate, "day", "[]")) {
          setData(plan[i]);
          break;
        }
      }
    }
  }, [plan])
  const temp = scheduleKind.find((v: TScheduleKind) => data?.kind == v._id);
  const kind = temp == undefined ? "-1" : temp.name

  return (
    <>
      <Popover.Content maxWidth="800px" className='max-lg:w-[480px] w-[600px]'>
        <Flex direction="row">
          <div className='flex-grow font-bold text-lg' style={{ textAlign: 'center' }}>
            {date.format("YYYY-MM-DD")}
          </div>
          <Flex className='justify-end gap-1 pb-1'>
            <IconButton size="2" radius='full' variant="soft" className='cursor-pointer' onClick={e => handleCreate(date)}><PlusIcon /></IconButton>
            {data &&
              <>
                <IconButton size="2" radius='full' variant="soft" className='cursor-pointer' onClick={e => handleEdit(data)}><Pencil1Icon /></IconButton>
                <Alert title="Information" text="Do you remove this task really?" handleCancel={handleDeleteCancel} handleOk={e => handleDeleteOk(data._id)}>
                  <IconButton size="2" radius='full' variant="soft" className='cursor-pointer'><TrashIcon /></IconButton>
                </Alert>
              </>
            }
            <Popover.Close>
              <IconButton size="2" radius='full' variant="soft" className='cursor-pointer'><Cross2Icon /></IconButton>
            </Popover.Close>
          </Flex>
        </Flex>

        <Flex gap="3">
          <Flex direction="column" className='rounded shadow p-2'>
            <Text className='font-bold'>Task List</Text>
            <hr />
            <Flex direction="column" >
              {
                plan?.map((v: TPlan, i: number) => {
                  if (date.isBetween(v.startDate, v.endDate, "day", "[]")) {
                    return <Link key={i} className='cursor-pointer' onClick={e => handleDataShow(i)}>{cutString(v.title)}</Link>
                  }
                })
              }
            </Flex>
          </Flex>
          <Flex flexGrow="1" direction={"column"} gap={"2"} className='rounded shadow p-2'>
            <Flex direction={"column"} className='text-base font-medium'>
              <div>
                {data == undefined && "There is no schedule to display"}
                {data?.title}&nbsp;&nbsp;&nbsp;{kind !== "-1" && <Badge variant="soft" radius="full" color="indigo">{kind}</Badge>}
              </div>
              <div style={{ backgroundColor: data?.color, height: data?.width, }} className='w-100'></div>
            </Flex>
            <Flex direction={"column"} style={{ minHeight: "180px" }}>{data?.demo}</Flex>
            <Flex direction={"column"} className='text-sm' style={{ color: 'gray ' }}>
              {
                data != undefined && (moment(data?.endDate).isSame(moment(data.startDate)) ?
                  `${moment(data?.startDate).format("YYYY-MM-DD")}` :
                  `${moment(data?.startDate).format("YYYY-MM-DD")} ~ ${moment(data?.endDate).format("YYYY-MM-DD")} (${moment(data?.endDate).diff(moment(data?.startDate), 'days') + 1} days)`)
              }
            </Flex>
          </Flex>
        </Flex>
      </Popover.Content >
    </>
  )
}

export default TaskShow