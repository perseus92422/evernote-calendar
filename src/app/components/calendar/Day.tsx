import { Flex, IconButton, Button } from "@radix-ui/themes";
import { dateToYYYYMMDDF } from "../../helper/util";
import { CALENDAR_VIEW_MODE } from "../../const";


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
    dateBarHandler: (date: string) => void;
}) => {

    return (
        <Flex align="center" justify="center" position={'relative'}>
            {
                viewMode == CALENDAR_VIEW_MODE.month1 ? (
                    <div className="absolute left-0 w-[calc(50%-20px)] border border-[#243c5a]" />
                ) : null
            }
            {
                viewMode == CALENDAR_VIEW_MODE.month2 ? (
                    <div className={"absolute left-0 w-[calc(50%-20px)] border-[#243c5a] " + (isMonday ? " h-1/2 border-l-2 " : " border ") + (weekNum % 2 == 1 ? "  border-t-2 " : " border-b-2 ") + (isLeftBottom ? " top-0 rounded-bl-lg " : "") + (isLeftTop ? " bottom-0 rounded-tl-lg" : "")} />
                ) : null
            }
            <IconButton
                className={("cursor-pointer border-2 !font-medium ") + (activeDate == date ? "bg-[#cd2200ea] text-white" : "")}
                color={isOut ? "gray" : (dateToYYYYMMDDF(new Date()) == date || activeDate == date ? "tomato" : "sky")}
                size="3"
                radius="full"
                variant="outline"
                onClick={() => dateBarHandler(date)}
            >
                {day}
            </IconButton>
            {
                viewMode == CALENDAR_VIEW_MODE.month1 ? (
                    <div className="absolute right-0 w-[calc(50%-20px)]  border border-[#243c5a] " />
                ) : null
            }
            {
                viewMode == CALENDAR_VIEW_MODE.month2 ? (
                    <div className={("absolute w-[calc(50%-20px)] border-[#243c5a] right-0  ") + (isSunday ? " h-1/2 border-r-2 " : " border ") + (weekNum % 2 == 0 ? "  border-t-2 " : " border-b-2 ") + (isRightBottom ? " bottom-0 rounded-tr-lg " : "") + (isRightTop ? " top-0 rounded-br-lg " : "")} />
                ) : null
            }
        </Flex >
    )
}

export default Day;