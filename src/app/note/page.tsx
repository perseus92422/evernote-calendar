'use client'
import { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { AxiosResponse, AxiosError } from "axios";
import {
    Flex,
    Text,
    Strong,
    Tabs,
    Box,
    Button,
    DropdownMenu
} from "@radix-ui/themes";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import {
    EditorState,
    ContentState,
    convertToRaw
} from "draft-js";
import dratfToHtml from 'draftjs-to-html';
import { useAppSelector, useAppDispatch } from "../redux/hook";
import htmlToDraft from "../components/note/htmlToDraft";
import Editor from "../components/note/Editor";
import ENCHINTL from '@/app/lang/EN-CH.json';
import { eraseStorage, dateToYYYYMMDDF } from "../helper";
import { setUserProps } from "../features/calendar.slice";
import {
    createNote,
    updateNote,
    findAllNote,
    findAllNoteOnWorkspaces,
    removeNote,
} from "../api";
import {
    NewNoteDTO,
    UpdateNoteDTO,
    NoteDTO,
    NotesOnWorkSpaces,
    UserDTO
} from "../type";
import { WYSIWYG_LOCALES } from "../const";

const NoteItem = ({
    id,
    title,
    content,
    createAt,
    selected,
    handlerOnClick
}: {
    id: number;
    title: string;
    content?: string;
    createAt: Date;
    selected: boolean;
    handlerOnClick: (arg: number) => void;
}) => {

    return (
        <div onClick={() => handlerOnClick(id)} className={"relative px-5 py-4 my-2 border rounded-lg h-[150px] cursor-pointer " + (selected ? " border-[#002bb7c5]" : "")}>
            <Text><Strong>{title}</Strong></Text><br />
            <div className="pt-3">
                <div dangerouslySetInnerHTML={{ __html: content.split('\n')[0] }} />
                <Text>...</Text>
            </div>
            <div className="absolute right-2 bottom-2">
                <Text as="label" size="2" color="gray">{dateToYYYYMMDDF(createAt)}</Text>
            </div>
        </div>
    )
}

const Note = () => {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { intl } = useAppSelector(state => state.calendar);
    const [privateNoteList, setPrivateNoteList] = useState<Array<NoteDTO>>([]);
    // const [workSpaceNoteList, setWorkSpaceNoteList] = useState<Array<NotesOnWorkSpaces>>([]);
    const [selectedNote, setSelectedNote] = useState<NoteDTO>(null);
    const [title, setTitle] = useState<string>("");
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [accessToken, setAccessToken] = useState<string>(null);

    const findAllPrivateNote = async () => {
        const token = localStorage.getItem('token');
        const res = await findAllNote(token);
        if (res.status && res.status < 400) {
            const result = res as AxiosResponse;
            setPrivateNoteList([...result.data]);
        }
        else {
            const err = res as AxiosError;
            if (err.response.status == 401) {
                toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                signOutAction();
            }
        }
    }

    // const findAllWorkSpaceNote = async () => {
    //     const token = localStorage.getItem('token');
    //     const res = await findAllNoteOnWorkspaces(token);
    //     if (res.status && res.status < 400) {
    //         const result = res as AxiosResponse;
    //         setWorkSpaceNoteList(result.data);
    //     } else {
    //         const err = res as AxiosError;
    //         if (err.response.status == 401) {
    //             toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
    //             signOutAction();
    //         }
    //     }
    // }

    const initState = () => {
        setTitle("");
        setEditorState(EditorState.createEmpty());
        setSelectedNote(null);
    }

    const handlerTitleChange = (value: string) => {
        setTitle(value)
    }

    const handlerContentChange = (value: EditorState) => {
        setEditorState(value);
    }

    const handlerNewBtnClick = () => {
        initState();
    }

    const handlerSaveBtnClick = async () => {
        let content = dratfToHtml(convertToRaw(editorState.getCurrentContent()));
        if (title == "") {
            toast.error(ENCHINTL['toast']['note']['empty-title'][intl]);
            return;
        }
        if (!editorState.getCurrentContent().hasText()) {
            toast.error(ENCHINTL['toast']['note']['empty-content'][intl]);
            return;
        }
        if (selectedNote) {
            let payload: UpdateNoteDTO = {
                title,
                content
            };
            const res = await updateNote(selectedNote.id, payload, accessToken);
            if (res.status && res.status < 400) {
                const tmpNotes = [...privateNoteList];
                const update = tmpNotes.find(
                    a => a.id === selectedNote.id
                )
                Object.keys(payload).map((v) => {
                    update[v] = payload[v];
                })
                setPrivateNoteList(tmpNotes);
                toast.success(ENCHINTL['toast']['note']['update-success'][intl]);
            } else {
                const err = res as AxiosError;
                if (err.response.status == 401) {
                    toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                    signOutAction();
                }
            }
        } else {
            let payload: NewNoteDTO = {
                title,
                content
            };
            const res = await createNote(payload, accessToken);
            if (res.status && res.status < 400) {
                const result = res as AxiosResponse;
                setPrivateNoteList([result.data, ...privateNoteList]);
                toast.success(ENCHINTL['toast']['note']['create-success'][intl]);
            } else {
                const err = res as AxiosError;
                if (err.response.status == 401) {
                    toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                    signOutAction();
                }
            }
        }
    }

    const handlerRemoveBtnClick = async () => {
        if (selectedNote) {
            const res = await removeNote(selectedNote.id, accessToken);
            if (res.status && res.status < 400) {
                setPrivateNoteList(privateNoteList.filter(
                    a => a.id !== selectedNote.id
                ));
                initState();
                toast.success(ENCHINTL['toast']['note']['remove-success'][intl]);
            } else {
                const err = res as AxiosError;
                if (err.response.status == 401) {
                    toast.error(ENCHINTL['toast']['common']['token-expired'][intl]);
                    signOutAction();
                }
            }
        }
    }

    const handlerNoteItemClick = (id: number) => {
        const note = privateNoteList.find(a => a.id === id);
        setSelectedNote(note);
        setTitle(note.title);
        setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(note.content).contentBlocks)))
    }

    const signOutAction = () => {
        eraseStorage();
        dispatch(setUserProps(null));
        router.push('/auth/signin');
    }

    useEffect(() => {
        findAllPrivateNote();
    }, [])

    useLayoutEffect(() => {
        const token = localStorage.getItem('token');
        if (!token)
            router.push('/auth/signin');
        else
            setAccessToken(token);
    }, [])

    return (
        <Flex direction="row" gap="2">
            <Flex className="w-1/2" px='3'>
                <Tabs.Root defaultValue="person" className="w-full">
                    <Tabs.List>
                        <Tabs.Trigger value="person">{ENCHINTL['note']['tabs-bar']['tabs']['person'][intl]}</Tabs.Trigger>
                        {/* <Tabs.Trigger value="workspace">{ENCHINTL['note']['tabs-bar']['tabs']['workspace'][intl]}</Tabs.Trigger> */}
                    </Tabs.List>
                    <Box pt="3">
                        <Tabs.Content value="person">
                            {
                                privateNoteList.map((v, i) => (
                                    <NoteItem
                                        key={i}
                                        id={v.id}
                                        title={v.title}
                                        content={v.content}
                                        createAt={v.createAt}
                                        selected={v.id == selectedNote?.id ? true : false}
                                        handlerOnClick={handlerNoteItemClick}
                                    />
                                ))
                            }
                        </Tabs.Content>
                    </Box>
                </Tabs.Root>
            </Flex>
            <Flex direction="column" className="w-1/2 border rounded-xl h-screen">
                <div className="flex flex-row-reverse items-center gap-2 w-full py-3 px-3 border rounded-lg">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <DotsVerticalIcon
                                height={20}
                                width={20}
                                className="cursor-pointer"
                            />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <Text as="p" className="cursor-pointer" onClick={handlerNewBtnClick}>{ENCHINTL['note']['edit-bar']['dropdown-list']['new'][intl]}</Text>
                            <Text as="p" className="cursor-pointer" onClick={handlerSaveBtnClick}>{ENCHINTL['note']['edit-bar']['dropdown-list']['save'][intl]}</Text>
                            <Text as="p" className={selectedNote ? "cursor-pointer" : "text-gray-300"} onClick={handlerRemoveBtnClick}>{ENCHINTL['note']['edit-bar']['dropdown-list']['remove'][intl]}</Text>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>

                    <Button className="cursor-pointer" onClick={handlerSaveBtnClick}>{ENCHINTL['note']['edit-bar']['btn']['save'][intl]}</Button>
                    <Button className="cursor-pointer" variant="outline" onClick={handlerNewBtnClick}>{ENCHINTL['note']['edit-bar']['btn']['new'][intl]}</Button>
                </div>
                <div className="px-3 py-3">
                    <input placeholder="Title" value={title} type="text" className="pt-4 text-5xl w-full focus:outline-0 " onChange={(e) => handlerTitleChange(e.target.value)} />
                    <Editor
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker'],
                            colorPicker: {
                                colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                                    'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                                    'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                                    'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                                    'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                                    'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
                            },
                        }}
                        locale={WYSIWYG_LOCALES[intl]}
                        editorState={editorState}
                        onEditorStateChange={handlerContentChange}
                        toolbarClassName="toolbar-class"
                        wrapperClassName="wrapper-class"
                    />
                </div>
            </Flex>
        </Flex>
    )
}

export default Note;