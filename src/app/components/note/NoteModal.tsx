import { useState } from "react";
import { useAppSelector } from "../../redux/hook";
import {
    Dialog,
    Button,
    TextField,
    Text,
    Flex
} from "@radix-ui/themes";
import {
    EditorState,
    ContentState,
    convertToRaw,
    convertFromHTML,
} from 'draft-js';
import { toast } from "react-toastify";
import dratfToHtml from 'draftjs-to-html';
import Editor from "./Editor";
import Message from "../common/message";
import {
    createNote,
    updateNote
} from "../../api/note.api";
import {
    NewNoteDTO,
    UpdateNoteDTO,
    NoteDTO
} from "../../type/note.dto";
import {
    NOTE_MODAL_TYPE,
    WYSIWYG_LOCALES
} from "../../const";
import ENCHIntl from '@/app/lang/EN-CH.json';




const NoteModal = (
    {
        type,
        isShow,
        note,
        activeDate,
        setShowModal,
        setShowDateBar,
    }: {
        type: NOTE_MODAL_TYPE;
        isShow: boolean;
        note?: NoteDTO;
        activeDate?: string;
        setShowModal: (arg: boolean) => void;
        setShowDateBar: (arg: boolean) => void;
    }) => {

    const { intl } = useAppSelector(state => state.calendar);
    const [visible, setVisible] = useState<boolean>(true);
    const [title, setTitle] = useState<string>(note ? note.title : "");
    const [error, setError] = useState<string>("");
    const [editorState, setEditorState] = useState<EditorState>(
        note ?
            EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(note.content).contentBlocks))
            :
            EditorState.createEmpty()
    );

    const handleModalShow = () => {
        setVisible(!visible);
        setShowModal(!visible);
    }

    const handleTitleChange = (value: string) => {
        setTitle(value);
    }

    async function handleSubmitBtnClick() {
        let content = dratfToHtml(convertToRaw(editorState.getCurrentContent()));
        if (title == "") {
            setError(ENCHIntl['error']['note']['modal']['empty-title'][intl]);
            return;
        }
        if (!editorState.getCurrentContent().hasText()) {
            setError(ENCHIntl['error']['note']['modal']['empty-content'][intl]);
            return;
        }
        if (type == NOTE_MODAL_TYPE.Create) {
            let payload: NewNoteDTO = {
                title,
                content,
                date: activeDate
            };
            const { data, status } = await createNote(payload);
            if (status >= 400) {

            } else {
                toast.success(ENCHIntl['toast']['note']['create-success'][intl]);
            }
        }
        if (type == NOTE_MODAL_TYPE.Update) {
            let payload: UpdateNoteDTO = {};
            if (title != note.title)
                payload.title = title;
            if (content != note.content)
                payload.content = content;
            const { data, status } = await updateNote(note.id, payload);
            if (status >= 400) {

            } else {
                toast.success(ENCHIntl['toast']['note']['update-success'][intl]);
            }
        }
        initState();
    }

    const handlerEditorStateChange = (value: EditorState) => {
        setEditorState(value);
    }

    const initState = () => {
        setTitle("");
        setEditorState(EditorState.createEmpty());
        setError("");
        setVisible(false);
        setShowModal(false);
        setShowDateBar(false);
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
                {error ? (<Message message={error} />) : null}
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