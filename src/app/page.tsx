'use client'
import { useEffect, useState } from 'react'
import { registerLocale } from 'react-datepicker';
import { zhCN, enUS } from 'date-fns/locale';
import 'moment/locale/en-ca';
import 'moment/locale/zh-cn';
import Calender from "./pages/calender";
import Header from "@/app/layout/header";
import { ToastContainer } from 'react-toastify';
import { getCalender, setDate } from "./redux/calenderSlice";
import { useAppSelector, useAppDispatch } from "./redux/hook";
import 'react-toastify/dist/ReactToastify.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


export default function Home() {
  const dispatch = useAppDispatch();

  registerLocale('en', enUS);
  registerLocale('cn', zhCN);

  const { date } = useAppSelector(getCalender)
  // const date = moment(useAppSelector(getCalender).date);
  // const kind = useAppSelector(getCalender).kind;
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

  // useEffect(() => {
  //   if (!isScrolling) {
  //     let kd: moment.unitOfTime.DurationConstructor = "days";
  //     if (kind == "week") kd = "days";
  //     else kd = "months";
  //     dispatch(setDate(moment(date).add(direction, kd).format("YYYY-MM-DD")));
  //   }
  // }, [isScrolling, direction])

  return (
    <div className="container mx-auto px-4" onWheel={handleWheel}>
      <Header />
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
    </div >
  );
}
