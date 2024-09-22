'use client'
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AxiosError, AxiosResponse } from "axios";
import {
    Flex,
    Tabs,
    Box,
    Text,
    Strong,
} from "@radix-ui/themes";
import { UploadIcon, DownloadIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { useAppSelector, useAppDispatch } from "../redux/hook";
import { findAllLibrary, uploadLibrary } from "../api/library.api";
import { LibraryDTO } from "../type";
import { setUserProps } from "../features/calendar.slice";
import { eraseStorage, getDateTime } from "../helper";
import { BASE_URL } from "../config";

const Library = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { intl } = useAppSelector(state => state.calendar);
    const fileRef = useRef<HTMLInputElement>(null);
    const [newFile, setNewFile] = useState<File>(null);
    const [library, setLibrary] = useState<Array<LibraryDTO>>([]);
    const [selectedFile, setSelectedFile] = useState<LibraryDTO>(null);
    const [accessToken, setAccessToken] = useState<string>(null);
    const enum libraryType {
        All = "all",
        Media = "media",
        Doc = "doc"
    }

    const getLibraryList = async () => {
        const token = localStorage.getItem('token');
        const res = await findAllLibrary(token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setLibrary(result.data);
            setSelectedFile(result.data[0]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    const handlerUploadBtnClick = async (file: File) => {
        setNewFile(file);
        const res = await uploadLibrary(file, accessToken);
        if (res.status && res.status < 400) {
            toast.success(ENCHINTL['toast']['library']['upload-succes'][intl]);
            const result = res as AxiosResponse;
            setLibrary([...library, result.data]);
        } else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    const handlerFileClick = (id: number) => {
        setSelectedFile(library.find(a => a.id === id));
    }

    const handlerDownloadClick = () => {
        if (!selectedFile)
            return;
        router.push(`${BASE_URL}/library/download?fileName=${selectedFile.fileName}`);
    }

    const handlerTabsChange = (type: libraryType) => {
        switch (type) {
            case libraryType.All:
                setSelectedFile(library.length > 0 ? library[0] : null);
                break;
            case libraryType.Media:
                setSelectedFile(library.find(a => a.type === 'MEDIA'));
                break;
            case libraryType.Doc:
                setSelectedFile(library.find(a => a.type === 'DOC'));
                break;
            default:
                break;
        }
    }

    const signOutAction = () => {
        eraseStorage();
        dispatch(setUserProps(null));
        router.push('/auth/signin');
    }

    useEffect(() => {
        getLibraryList();
    }, [])

    useLayoutEffect(() => {
        const token = localStorage.getItem('token');
        if (!token)
            router.push('/auth/signin');
        else
            setAccessToken(token);
    }, [])

    return (
        <Flex gap="3" className="h-screen">
            <Flex direction="column" className="w-2/5">
                <Flex justify="between" py="3" px="2">
                    <Text><Strong>{library.length} {ENCHINTL['library']['tabs-bar']['toolbar']['element'][intl]}</Strong></Text>
                    <div onClick={() => fileRef.current?.click()}>
                        <UploadIcon
                            height="25"
                            width="25"
                            className="cursor-pointer"
                        />
                        <input name="upload" accept="image/*, audio/* ,.pdf" type="file" ref={fileRef} hidden onChange={(e) => handlerUploadBtnClick(e.target.files[0])} />
                    </div>
                </Flex>
                <Tabs.Root defaultValue="all" className="max-h-[800px] overflow-auto" >
                    <Tabs.List>
                        <Tabs.Trigger onClick={() => handlerTabsChange(libraryType.All)} value="all">{ENCHINTL['library']['tabs-bar']['tabs']['all'][intl]}</Tabs.Trigger>
                        <Tabs.Trigger onClick={() => handlerTabsChange(libraryType.Media)} value="media">{ENCHINTL['library']['tabs-bar']['tabs']['media'][intl]}</Tabs.Trigger>
                        <Tabs.Trigger onClick={() => handlerTabsChange(libraryType.Doc)} value="doc">{ENCHINTL['library']['tabs-bar']['tabs']['doc'][intl]}</Tabs.Trigger>
                    </Tabs.List>
                    <Box pt="3">
                        <Tabs.Content value="all">
                            {
                                library.map((v, i) => (
                                    <div key={i} className="flex justify-between py-2 cursor-pointer" onClick={() => handlerFileClick(v.id)} >
                                        <div className="flex flex-row gap-2">
                                            {
                                                v.mimeType.startsWith('image') && (<Image src="/ImageIcon.png" width="20" height="20" alt="imageIcon" />)
                                            }
                                            {
                                                v.mimeType.startsWith('audio') && (<Image src="/AudioIcon.png" width="20" height="20" alt="audioIcon" />)
                                            }
                                            {
                                                v.mimeType.endsWith('pdf') && (<Image src="/pdfIcon.png" width="20" height="20" alt="pdfIcon" />)
                                            }
                                            <Text><Strong>{v.originName}</Strong></Text>
                                        </div>
                                        <Text>{getDateTime(v.createAt)}</Text>
                                    </div>
                                ))
                            }
                        </Tabs.Content>
                        <Tabs.Content value="media">
                            {
                                library.filter(a => a.type === 'MEDIA').map((v, i) => (
                                    <div className="flex justify-between py-2 cursor-pointer" onClick={() => handlerFileClick(v.id)}>
                                        <div key={i} className="flex flex-row gap-2">
                                            {
                                                v.mimeType.startsWith('image') && (<Image src="/ImageIcon.png" width="20" height="20" alt="imageIcon" />)
                                            }
                                            {
                                                v.mimeType.startsWith('audio') && (<Image src="/AudioIcon.png" width="20" height="20" alt="audioIcon" />)
                                            }
                                            <Text><Strong>{v.originName}</Strong></Text>
                                        </div>
                                        <Text>{getDateTime(v.createAt)}</Text>
                                    </div>
                                ))
                            }
                        </Tabs.Content>
                        <Tabs.Content value="doc">
                            {
                                library.filter(a => a.type === 'DOC').map((v, i) => (
                                    <div className="flex justify-between py-2 cursor-pointer" onClick={() => handlerFileClick(v.id)}>
                                        <div key={i} className="flex flex-row gap-2">
                                            {
                                                v.mimeType.endsWith('pdf') && (<Image src="/pdfIcon.png" width="20" height="20" alt="pdfIcon" />)
                                            }
                                            <Text><Strong>{v.originName}</Strong></Text>
                                        </div>
                                        <Text>{getDateTime(v.createAt)}</Text>
                                    </div>
                                ))
                            }
                        </Tabs.Content>
                    </Box>
                </Tabs.Root>
            </Flex>
            <Flex direction="column" className="w-3/5 border rounded-xl">
                <div className="flex justify-center relative  w-full px-3 py-3 border-2 rounded-xl ">
                    <DownloadIcon
                        height="25"
                        width="25"
                        color={selectedFile ? "black" : "grey"}
                        className={"absolute right-3 " + (selectedFile ? "cursor-pointer" : "")}
                        onClick={handlerDownloadClick}
                    />
                    <Text><Strong>{selectedFile?.originName}</Strong></Text>
                </div>
                {
                    selectedFile && selectedFile.mimeType.startsWith('image') ? (
                        <div className="flex justify-center items-center w-full px-3 py-3">
                            <img src={BASE_URL + '/library/' + selectedFile?.fileName} className="h-auto w-auto" />
                        </div>
                    ) : null
                }
                {
                    selectedFile && selectedFile.mimeType.endsWith('pdf') ? (
                        <div className="flex justify-center items-center w-full px-3 py-3">
                            <iframe src={BASE_URL + '/library/' + selectedFile?.fileName} style={{ width: '100%', height: '70vh' }} />
                        </div>
                    ) : null
                }
                {
                    selectedFile && selectedFile.mimeType.startsWith('audio') ? (
                        <div className="flex flex-col gap-2 h-screen items-center justify-center">
                            <iframe src={`${BASE_URL}/library/${selectedFile.fileName}`} style={{ width: '100%', height: '70vh' }} />
                        </div>
                    ) : null
                }
            </Flex>
        </Flex >
    )
}

export default Library;