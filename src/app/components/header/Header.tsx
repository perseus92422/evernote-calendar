import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Flex,
    Button,
    DropdownMenu,
    Text,
    Strong
} from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { setIntlProps, setUserProps } from "@/app/features/calendar.slice";
import { UserDTO } from "@/app/type";
import ENCHINTL from '@/app/lang/EN-CH.json';

const Header = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { intl, user } = useAppSelector(state => state.calendar);
    const [curIntl, setCurIntl] = useState<number>(intl);
    const [curUser, setCurUser] = useState<UserDTO>(null);

    const handlerIntlChange = () => {
        if (curIntl == 0) {
            setCurIntl(1);
            dispatch(setIntlProps(1));
        } else {
            setCurIntl(0);
            dispatch(setIntlProps(0));
        }
    }

    const handlerSignOutClick = () => {
        localStorage.setItem('user', null);
        localStorage.setItem('token', null);
        setCurUser(null);
        dispatch(setUserProps(null));
        router.push('/auth/signin');
    }

    useEffect(() => {
        let storage = localStorage.getItem('user');
        if (storage) {
            if (user)
                setCurUser(user);
            else {
                dispatch(setUserProps(JSON.parse(storage)))
                setCurUser(JSON.parse(storage));
            }
        } else {
            if (user)
                setCurUser(user);
        }
    }, [])

    return (
        <Flex justify="between" pt="3">
            <Flex onClick={handlerIntlChange} >
                <Button radius='none' variant={curIntl === 0 ? "classic" : "outline"}>EN</Button>
                <Button radius='none' variant={curIntl === 1 ? "classic" : "outline"} >中文</Button>
            </Flex>
            {
                curUser ? (
                    <Flex>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Flex className="items-center cursor-pointer" gap="3">
                                    <Flex className="border-2 rounded-full h-[50px] w-[50px] bg-[#6c9fff] justify-center items-center">
                                        <Text size="5" className="text-white">
                                            <Strong>
                                                {curUser.firstName.toLocaleUpperCase().trim()[0] + curUser.lastName.toLocaleUpperCase().trim()[0]}
                                            </Strong>
                                        </Text>
                                    </Flex>
                                    <Text size="5"><Strong>{curUser.firstName + " " + curUser.lastName}</Strong></Text>
                                </Flex>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Item onClick={handlerSignOutClick}>{ENCHINTL['header']['menu']['sign-out'][curIntl]}</DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Flex>
                ) : null
            }
        </Flex>

    )
}

export default Header;