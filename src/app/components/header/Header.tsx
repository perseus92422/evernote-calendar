import { useState } from "react";
import { Flex, Button } from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { setIntlProps } from "@/app/features/calendar.slice";

const Header = () => {

    const dispatch = useAppDispatch();
    const { intl } = useAppSelector(state => state.calendar);

    const [curIntl, setCurIntl] = useState<number>(intl);

    const handlerIntlChange = () => {
        if (curIntl == 0) {
            setCurIntl(1);
            dispatch(setIntlProps(1));
        } else {
            setCurIntl(0);
            dispatch(setIntlProps(0));
        }
    }

    return (
        <Flex onClick={handlerIntlChange} justify="end" pt="3">
            <Button radius='none' variant={curIntl === 0 ? "classic" : "outline"}>EN</Button>
            <Button radius='none' variant={curIntl === 1 ? "classic" : "outline"} >中文</Button>
        </Flex>
    )
}

export default Header;