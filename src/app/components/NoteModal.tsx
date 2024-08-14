import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hook";
import {
    Dialog,
    Button,
    TextField,
    Text,
    Flex
} from "@radix-ui/themes";
import { EditorState, convertToRaw } from 'draft-js';
import dratfToHtml from 'draftjs-to-html';
import Editor from "./Editor";
import Message from "./message";
import { NOTE_MODAL_TYPE, WYSIWYG_LOCALES } from "../const";
import ENCHIntl from '@/app/lang/EN-CH.json';
import { NewNoteDTO } from "../type/note.dto";


const NoteModal = (
    {
        type,
        isShow,
        activeDate,
        setShow
    }: {
        type: NOTE_MODAL_TYPE;
        isShow: boolean;
        activeDate?: string;
        setShow: (arg: boolean) => void;
    }) => {

    const { intl } = useAppSelector(state => state.calendar);
    const [visible, setVisible] = useState<boolean>(true);
    const [title, setTitle] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

    const handleModalShow = () => {
        setVisible(!visible);
        setShow(!visible);
    }

    const handleTitleChange = (value: string) => {
        setTitle(value);
    }

    const handleSubmitBtnClick = () => {
        let content = dratfToHtml(convertToRaw(editorState.getCurrentContent()));
        if (title == "") {
            setError(ENCHIntl['error']['note']['modal']['empty-title'][intl]);
            return;
        }
        if (content == '<p></p>') {
            setError(ENCHIntl['error']['note']['modal']['empty-content'][intl]);
            return;
        }
        let payload: NewNoteDTO = {
            title,
            content,
            date: activeDate
        };
    }

    const handlerEditorStateChange = (value: EditorState) => {
        setEditorState(value);
    }

    return (
        <Dialog.Root open={visible} onOpenChange={handleModalShow}  >
            <Dialog.Content size="4" className="max-w-[800px]">
                <Dialog.Title>
                    {type == NOTE_MODAL_TYPE.Create ? ENCHIntl['modal']['note']['title-d']['create'][intl] : null}
                    {type == NOTE_MODAL_TYPE.Update ? ENCHIntl['modal']['note']['title-d']['update'][intl] : null}
                </Dialog.Title>
                <Dialog.Description>

                </Dialog.Description>

                <Flex direction="column" py="2" gap="1">
                    <Text as="p" >{ENCHIntl['modal']['note']['title-p'][intl]}</Text>
                    <TextField.Root
                        autoFocus={true}
                        size="2"
                        placeholder={ENCHIntl['modal']['note']['title-textfield-holder'][intl]}
                        value={title}
                        onChange={e => handleTitleChange(e.target.value)}
                    />
                </Flex >
                <Flex direction="column" py="2" gap="1">
                    <Text as="p">{ENCHIntl['modal']['note']['content-p'][intl]}</Text>
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
                        onEditorStateChange={handlerEditorStateChange}
                        toolbarClassName="toolbar-class"
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                    />
                </Flex>
                <Flex justify="end" py="2" direction="row" gap="2">
                    <Button
                        radius='full'
                        color="indigo"
                        onClick={handleSubmitBtnClick}
                    >
                        {ENCHIntl['modal']['note']['button']['submit'][intl]}
                    </Button>
                    <Dialog.Close>
                        <Button
                            radius='full'
                            color="gray"
                            onClick={handleModalShow}
                        >
                            {ENCHIntl['modal']['note']['button']['close'][intl]}
                        </Button>
                    </Dialog.Close>
                </Flex>

            </Dialog.Content>
        </Dialog.Root>
    )
}

export default NoteModal;