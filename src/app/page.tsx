'use client'
import { useEffect, useState } from 'react'
import moment from 'moment';
import Calender from "./pages/calender";
import Header from "@/app/layout/header";
import { ToastContainer } from 'react-toastify';
import ScheduleModal from "./components/ScheduleModal";
import { getCalender, setDate } from "./redux/calenderSlice";
import { useAppSelector, useAppDispatch } from "./redux/hook";
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const dispatch = useAppDispatch();
  const { date } = useAppSelector(getCalender)
  // const date = moment(useAppSelector(getCalender).date);
  const kind = useAppSelector(getCalender).kind;
  const [isScrolling, setIsScrolling] = useState(false);
  const [direction, setDirection] = useState(0);
  const [play, setPlay] = useState(true);
  let scrollTimer: any;

  const handleWheel = (e: any) => {
    setIsScrolling(true);
    clearTimeout(scrollTimer);
    setDirection(e.deltaY / Math.abs(e.deltaY));
    setPlay(false);
    scrollTimer = setTimeout(() => {
      setIsScrolling(false);
      setPlay(true);
    }, 400);
  };
  useEffect(() => {
    if (!isScrolling) {
      let kd: moment.unitOfTime.DurationConstructor = "days";
      if (kind == "week") kd = "days";
      else kd = "months";
      dispatch(setDate(moment(date).add(direction, kd).format("YYYY-MM-DD")));
    }
  }, [isScrolling, direction])

  return (
    <div className="container mx-auto px-4" onWheel={handleWheel}>
      <Header />
      {/* <ScheduleModal /> */}
      <Calender />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* <MenuBar /> */}
    </div >
  );
}
