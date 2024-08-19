'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/hook";
import {
    Box,
    Flex,
    TextField,
    Text,
    Button,
    Link,
    Strong
} from "@radix-ui/themes";
import {
    EyeOpenIcon,
    EyeClosedIcon
} from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { AxiosError, AxiosResponse } from "axios";
import { useAppDispatch } from "@/app/redux/hook";
import { setUserProps } from "@/app/features/calendar.slice";
import Message from "@/app/components/common/message";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { signIn } from "@/app/api";
import { SignInDTO } from "@/app/type";


const SignIn = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const { intl } = useAppSelector(state => state.calendar);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [eyeShow, setEyeShow] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handlerEmailChange = (value: string) => {
        setEmail(value);
    }

    const handlerPasswordChange = (value: string) => {
        setPassword(value);
    }

    const handlerEyeShowChange = () => {
        setEyeShow(!eyeShow);
    }

    async function handlerSignInClick() {
        if (!email) {
            setError(ENCHINTL['error']['sign-up']['empty-email'][intl]);
            return;
        }
        if (!password) {
            setError(ENCHINTL['error']['sign-up']['empty-password'][intl]);
            return;
        }
        if (password.length < 6) {
            setError(ENCHINTL['error']['sign-up']['invalid-short-password'][intl]);
            return;
        }
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
            setError(ENCHINTL['error']['sign-up']['invalid-email'][intl]);
            return;
        }
        let payload: SignInDTO = {
            email,
            password
        }
        const res = await signIn(payload);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("user", JSON.stringify(result.data.user));
            dispatch(setUserProps(result.data.user));
            router.push('/');
        } else {
            const err = res as AxiosError;
            switch (err.response.status) {
                case 401:
                    toast.error(ENCHINTL['toast']['sign-in']['incorrect-credential'][intl]);
                    return;
                default:
                    return;
            }
        }
        initState();
    }

    const initState = () => {
        setError("");
        setEmail("");
        setPassword("");
    }

    return (
        <Flex justify="center" className="h-screen items-center" >
            <Flex className="border-2 rounded-sm w-1/3" px="5" py="5" direction="column"  >
                <Text as="p" size="5" className="py-3"><Strong>{ENCHINTL['sign-in']['title-p'][intl]}</Strong></Text>
                {error ? (<Message message={error} />) : null}
                <Box py="2">
                    <Text as="label">{ENCHINTL['sign-in']['email-label'][intl]} (*)</Text>
                    <Box className="w-full" pt="1">
                        <TextField.Root
                            type="email"
                            value={email}
                            size="2"
                            onChange={(e) => handlerEmailChange(e.target.value)}
                        />
                    </Box>
                </Box>
                <Box py="2">
                    <Text as="label">{ENCHINTL['sign-in']['password-label'][intl]} (*)</Text>
                    <Box className="w-full" pt="1">
                        <TextField.Root
                            type={eyeShow ? "text" : "password"}
                            value={password}
                            onChange={(e) => handlerPasswordChange(e.target.value)}
                        >
                            <TextField.Slot side="right">
                                {
                                    eyeShow ? (
                                        <EyeClosedIcon className="cursor-pointer " height="25" width="25" onClick={handlerEyeShowChange} />) : (
                                        <EyeOpenIcon className="cursor-pointer " height="25" width="25" onClick={handlerEyeShowChange} />)
                                }
                            </TextField.Slot>
                        </TextField.Root>
                    </Box>
                </Box>
                <Text as="p" align="center">{ENCHINTL['sign-in']['text1-p'][intl]}
                    <Link href="/auth/signup"><Strong className="px-2">{ENCHINTL['sign-in']['link']['sign-up'][intl]}</Strong></Link>
                </Text>
                <Flex gap="3" py="1" justify="end">
                    <Button radius="full" color="indigo" onClick={handlerSignInClick}>
                        {ENCHINTL['sign-in']['button']['sign-in'][intl]}
                    </Button>
                </Flex>
            </Flex>
        </Flex>

    )
}

export default SignIn;