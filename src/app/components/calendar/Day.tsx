import { useEffect, useState, useLayoutEffect } from "react";
import { Flex, IconButton } from "@radix-ui/themes";
import { ScheduleDTO } from "@/app/type";
import { CALENDAR_VIEW_MODE } from "../../const";
import { dateToYYYYMMDDF, compareDate } from "@/app/helper";

const Day = ({
    date,
    activeDate,
    day,
    weekNum,
    viewMode,
    isOut,
    isMonday,
    isSunday,
    isRightBottom,
    isRightTop,
    isLeftTop,
    isLeftBottom,
    schedules,
    dateBarHandler
}: {
    date: string;
    activeDate: string;
    day: number;
    weekNum: number;
    viewMode: CALENDAR_VIEW_MODE;
    isOut: boolean;
    isMonday: boolean;
    isSunday: boolean;
    isRightBottom: boolean;
    isRightTop: boolean;
    isLeftTop: boolean;
    isLeftBottom: boolean;
    schedules: ScheduleDTO[];
    dateBarHandler: (date: string) => void;
}) => {

    type iconColorType = "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky";
    const borderSpan = 4;
    const [iconBtnBorderColor, setIconBtnBorderColor] = useState<iconColorType>(null);
    const [height, setHeight] = useState<number>(borderSpan);
    const [isDefaultLeftBorder, setIsDefaultLeftBorder] = useState<boolean>(true);
    const [isDefaultRightBorder, setIsDefaultRightBorder] = useState<boolean>(true);
    const [isRevert, setIsRevert] = useState<boolean>(false);

    useLayoutEffect(() => {
        setIconBtnBorderColor(null);
        let rightBorder = true;
        let leftBorder = true;
        let tmpHeight = 0;
        schedules.map((v) => {
            tmpHeight += borderSpan;
            tmpHeight += v.width;
            if (v.startDate === date || v.endDate === date) {
                setIconBtnBorderColor(v.color as iconColorType);
            }

            if (v.startDate != date)
                leftBorder = false;
            if (v.endDate != date)
                rightBorder = false;
        });
        setHeight(tmpHeight);
        setIsDefaultLeftBorder(leftBorder);
        setIsDefaultRightBorder(rightBorder);
        if (viewMode == CALENDAR_VIEW_MODE.month2 && weekNum % 2 == 1)
            setIsRevert(true);
        else
            setIsRevert(false);
    }, [date, viewMode])

    return (
        <Flex align="center" justify="center" position={'relative'}>
            {
                viewMode == CALENDAR_VIEW_MODE.month1 ? (
                    <div className="absolute flex gap-[2px] flex-col w-[calc(50%-20px)] left-0">
                        {
                            isDefaultLeftBorder ? (
                                <div className="border-t-2 border-[#243c5a]"></div>
                            ) : (
                                schedules.map((v, i) => (
                                    compareDate(v.startDate, date) > 0 ? (
                                        < div key={i}
                                            style={{
                                                borderTopWidth: v.width,
                                                borderColor: v.color
                                            }}
                                        />
                                    ) : null
                                ))
                            )
                        }
                    </div>
                ) : null
            }
            {
                viewMode == CALENDAR_VIEW_MODE.month1 ? (
                    <div className="absolute flex flex-col gap-[2px] w-[calc(50%-20px)] right-0">
                        {
                            isDefaultRightBorder ? (
                                <div className="border-t-2 border-[#243c5a]"></div>
                            ) : (
                                schedules.map((v, i) => (
                                    compareDate(v.endDate, date) < 0 ? (
                                        <div key={i}
                                            style={{
                                                borderTopWidth: v.width,
                                                borderColor: v.color
                                            }}
                                        />
                                    ) : null

                                ))
                            )
                        }
                    </div>
                ) : null
            }
            {
                viewMode == CALENDAR_VIEW_MODE.month2 ? (
                    <>
                        <div className={"absolute flex flex-col w-[calc(50%-20px)] " + (isRevert ? "right-0" : "left-0")}>
                            {
                                !isDefaultLeftBorder ? (
                                    <>
                                        {
                                            schedules.map((v, i) => (
                                                compareDate(v.startDate, date) > 0 ? (
                                                    <div key={i}
                                                        style={{
                                                            borderColor: v.color,
                                                            height: (borderSpan + v.width),

                                                            borderTopWidth: (weekNum % 2 == 0 ? v.width : 0),
                                                            borderBottomWidth: (weekNum % 2 == 0 ? 0 : v.width),
                                                        }}
                                                    />
                                                ) : null
                                            ))
                                        }
                                    </>
                                ) : (
                                    <div className={"h-[4px] border-[#243c5a] " + (weekNum % 2 == 0 ? "border-t-[2px] " : "border-b-[2px] ")} />
                                )
                            }
                        </div>
                        {
                            isMonday ? (<div className={"absolute left-[-3px] w-[calc(50%-20px)] border-l-2 border-[#243c5a]  " + (weekNum % 2 == 0 ? "top-0 rounded-bl-lg" : "bottom-0 rounded-tl-lg")}
                                style={{
                                    height: `calc(50% + ${height / 2}px)`
                                }}
                            />) : null
                        }
                    </>

                ) : null
            }
            <IconButton
                className={("cursor-pointer border-[8px] !font-medium ") + (activeDate == date ? "bg-[#cd2200ea] text-white" : "")}
                color={iconBtnBorderColor ? iconBtnBorderColor : (isOut ? "gray" : (dateToYYYYMMDDF(new Date()) == date || activeDate == date ? "tomato" : "sky"))}
                size="3"
                radius="full"
                variant="outline"
                onClick={() => dateBarHandler(date)}
                style={iconBtnBorderColor ? {
                    boxShadow: `0 0 0 3px ${iconBtnBorderColor}`
                } : null}
            >
                {day}
            </IconButton>
            {
                viewMode == CALENDAR_VIEW_MODE.month2 ? (
                    <>
                        <div className={"absolute flex flex-col w-[calc(50%-20px)] " + (isRevert ? "left-0" : "right-0")}>
                            {
                                !isDefaultRightBorder ? (
                                    <>
                                        {
                                            schedules.map((v, i) => (
                                                compareDate(v.endDate, date) < 0 ? (
                                                    < div key={i}
                                                        style={{
                                                            borderColor: v.color,
                                                            height: (borderSpan + v.width),
                                                            borderTopWidth: (weekNum % 2 == 0 ? v.width : 0),
                                                            borderBottomWidth: (weekNum % 2 == 0 ? 0 : v.width),
                                                        }}
                                                    />
                                                ) : null
                                            ))
                                        }
                                    </>
                                ) : (
                                    <div className={"h-[4px] border-[#243c5a] " + (weekNum % 2 == 0 ? "border-t-[2px] " : "border-b-[2px] ")} />
                                )
                            }
                        </div>
                        {
                            isSunday ? (<div className={"absolute right-[-3px] w-[calc(50%-20px)] border-r-2 border-[#243c5a]  " + (weekNum % 2 == 0 ? "bottom-0 rounded-tr-lg" : "top-0 rounded-br-lg")}
                                style={{
                                    height: `calc(50% + ${height / 2}px)`
                                }}
                            />) : null
                        }
                    </>

                ) : null
            }
        </Flex >
    )
}

export default Day;