'use client'
import { useState } from "react";
import { useRouter } from 'next/navigation'
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
import Message from "@/app/components/common/message";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { signUp } from "@/app/api";
import { SignUpDTO } from "@/app/type";
import { AxiosError } from "axios";

const SignUp = () => {

    const router = useRouter();
    const { intl } = useAppSelector(state => state.calendar);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [eyeShow, setEyeShow] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handlerFirstNameChange = (value: string) => {
        setFirstName(value);
    }

    const handlerLastNameChange = (value: string) => {
        setLastName(value);
    }

    const handlerEmailChange = (value: string) => {
        setEmail(value);
    }

    const handlerPasswordChange = (value: string) => {
        setPassword(value);
    }

    const handlerEyeShowChange = () => {
        setEyeShow(!eyeShow);
    }

    async function handlerSignUpClick() {
        if (!firstName) {
            setError(ENCHINTL['error']['sign-up']['empty-firstname'][intl]);
            return;
        }
        if (!lastName) {
            setError(ENCHINTL['error']['sign-up']['empty-lastname'][intl]);
            return;
        }
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
        let payload: SignUpDTO = {
            firstName,
            lastName,
            email,
            password
        }
        const res = await signUp(payload);
        if (res.status && res.status < 400) {
            toast.success(ENCHINTL['toast']['sign-up']['sign-up-success'][intl]);
            router.push('/auth/signin');
        } else {
            const err = res as AxiosError;
            switch (err.response.status) {
                case 400:
                    toast.error(ENCHINTL['toast']['sign-up']['duplicate-email'][intl]);
                    break;
                default:
                    break;
            }
        }
        initState();
    }

    const initState = () => {
        setError("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setEyeShow(false);
    }

    return (
        <Flex justify="center" className="h-screen items-center" >
            <Flex className="border-2 rounded-sm w-1/3" px="5" py="5" direction="column"  >
                <Text as="p" size="5" className="py-3"><Strong>{ENCHINTL['sign-up']['title-p'][intl]}</Strong></Text>
                {error ? (<Message message={error} />) : null}
                <Flex className="w-full" direction="row" justify="between" py="2">
                    <Box className="w-1/2">
                        <Text as="label">{ENCHINTL['sign-up']['first-name-label'][intl]} (*)</Text>
                        <Box pt="1" className="w-full" pr="2">
                            <TextField.Root
                                autoFocus={true}
                                value={firstName}
                                onChange={(e) => handlerFirstNameChange(e.target.value)}
                            />
                        </Box>
                    </Box>
                    <Box className="w-1/2">
                        <Text as="label">{ENCHINTL['sign-up']['last-name-label'][intl]} (*)</Text>
                        <Box pt="1" className="w-full" pl="2" >
                            <TextField.Root
                                value={lastName}
                                onChange={(e) => handlerLastNameChange(e.target.value)}
                            />
                        </Box>
                    </Box>
                </Flex>
                <Box py="2">
                    <Text as="label">{ENCHINTL['sign-up']['email-label'][intl]} (*)</Text>
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
                    <Text as="label">{ENCHINTL['sign-up']['password-label'][intl]} (*)</Text>
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
                <Text as="p" align="center">{ENCHINTL['sign-up']['text1-p'][intl]}
                    <Link href="/auth/signin"><Strong className="px-2">{ENCHINTL['sign-up']['link']['sign-in'][intl]}</Strong></Link>
                </Text>
                <Flex gap="3" py="1" justify="end">
                    <Button radius="full" color="indigo" onClick={handlerSignUpClick}>
                        {ENCHINTL['sign-up']['button']['sign-up'][intl]}
                    </Button>
                </Flex>
            </Flex>
        </Flex>

    )
}

export default SignUp;