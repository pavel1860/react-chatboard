import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { File, X } from "lucide-react";
// lexical
import {

    EditorState,
    $getRoot,
} from "lexical";

import {
    QuoteNode,
    HeadingNode,
    $isHeadingNode,
    $createQuoteNode,
    $createHeadingNode,
} from "@lexical/rich-text";
import {
    $isCodeNode,
    $createCodeNode,
    getCodeLanguages,
    getDefaultCodeLanguage,
} from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";
import {
    AutoLinkNode,
    LinkNode,
    $isLinkNode,
    TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { $wrapNodes, $isAtNodeEnd } from "@lexical/selection";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorValue, Placeholder } from "./util";
import { ToolbarPlugin } from "./plugins/toolbar";
import { on } from "events";
import KeyPressPlugin from "./plugins/key-press";
import ResizeWrapperPlugin from "./plugins/resize-wrapper-plugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { Button } from "@heroui/react";







const editorConfig = {
    namespace: "MyEditor",
    onError(error: any) {
        throw error;
    },
    nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        AutoLinkNode,
        LinkNode,
    ],
};





export interface ChatInputProps {
    placeholder: string | undefined;
    file?: any;
    removeFile?: () => void;
    onChange?: (e: EditorValue) => void;
    onKeyPress?: (e: EditorValue) => void;
    dontClear?: boolean;
    bgColor?: string;
}

export function ChatInput({placeholder, onChange, onKeyPress, dontClear, bgColor, file, removeFile}: ChatInputProps) {

    const [rows, setRows] = useState(2 + (file ? 2 : 0));
    // const [rows, setRows] = useState(2);
    const [dependentVersion, setDependentVersion] = useState(0);

    useEffect(() => {
        setDependentVersion(dependentVersion + 1)
    }, [onChange, onKeyPress, dontClear])

    useEffect(() => {
        if (file) {
            setRows(rows + 2)
        }
    }, [file])

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div 
                // className={`relative mx-auto overflow-hidden my-5 w-full max-w-xxl rounded-xl border border-gray-300 bg-white text-left font-normal leading-5 text-gray-900`}                
                // className={`relative mx-auto overflow-hidden my-5 w-full max-w-xxl border-1 border-opacity-1 rounded-xl shadow-sm text-left font-normal leading-5 text-gray-900`}
                className={`relative mx-auto overflow-hidden my-5 w-full max-w-xxl border-1 border-opacity-1 rounded-xl shadow-sm text-left font-normal leading-5 text-gray-900`}
                key={`editor-${dependentVersion}`}
                
                style={{height: `${rows * 25}px`}}
                data-testid="chat-input"
            >                
            {file && <div className="bg-slate-200 inline-flex p-2 rounded-md flex-grow-0 border-1 border-slate-400">
                    <File />{file.name.slice(0,10)} file
                    <Button onClick={removeFile} isIconOnly variant="light" size="sm"><X /></Button>
                    </div> }
                {/* <ToolbarPlugin /> */}
                <div 
                    // className="relative rounded-b-lg border border-opacity-5 bg-white"
                    // className="relative rounded-md bg-gray-100 shadow-sm"
                    style={{backgroundColor: bgColor || "#FFFFFF"}}
                >
                
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="lexical min-h-[280px] resize-none px-2.5 py-2 text-base caret-gray-900 outline-none" />
                        }
                        placeholder={<Placeholder text={placeholder} offset={file ? 10 : 0}/>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={(editorState: EditorState)=> {
                        editorState.read(() => {
                            const root = $getRoot();
                            // console.log(root.getAllTextNodes().length)
                            // if (root.getAllTextNodes().length > rows) {
                            //     setRows(Math.max(root.getAllTextNodes().length, 1))
                            // }
                            const currentText = root.getAllTextNodes().map(textNode => textNode.getTextContent()).join('\n')
                            if (onChange) {
                                onChange({text: currentText})
                            }
                        })                        
                    }} />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <KeyPressPlugin onKeyPress={onKeyPress} dontClear={dontClear}/>
                    <ResizeWrapperPlugin setRows={(r) => {
                        console.log('setRows', r)
                        setRows(r)
                    }}/>
                </div>
                
            </div>
            
        </LexicalComposer>
    );
}