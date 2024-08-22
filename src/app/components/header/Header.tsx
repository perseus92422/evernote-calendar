import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Flex,
    Button,
    DropdownMenu,
    Text,
    Strong,
    Link
} from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { setIntlProps, setUserProps } from "@/app/features/calendar.slice";
import { UserDTO } from "@/app/type";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { eraseStorage } from "@/app/helper";

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
        router.push('/auth/signin');
        eraseStorage();
        setCurUser(null);
        dispatch(setUserProps(null));
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
    }, [user])

    return (
        <Flex justify="between" py="5" className="items-center">
            <Flex gap="6">
                {
                    curUser ? (<>
                        {/* <Text as="span" size="4"><Link href="/note"><Strong>{ENCHINTL['header']['nav-bar']['note'][intl]}</Strong></Link></Text>
                        <Text as="span" size="4"><Link href="/schedule"><Strong>{ENCHINTL['header']['nav-bar']['schedule'][intl]}</Strong></Link></Text>
                        <Text as="span" size="4"><Link href="/task"><Strong>{ENCHINTL['header']['nav-bar']['task'][intl]}</Strong></Link></Text> */}
                        {/* <Text as="span" size="4"><Link href="/workspace"><Strong>{ENCHINTL['header']['nav-bar']['workspace'][intl]}</Strong></Link></Text> */}
                    </>) : null
                }
            </Flex>
            <Flex gap="3" className="items-center">
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
                                    <DropdownMenu.Item onClick={() => router.push('/workspace')}>{ENCHINTL['header']['nav-bar']['workspace'][intl]}</DropdownMenu.Item>
                                    <DropdownMenu.Item onClick={handlerSignOutClick}>{ENCHINTL['header']['menu']['sign-out'][curIntl]}</DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </Flex>
                    ) : null
                }
            </Flex>
        </Flex>

    )
}

export default Header;