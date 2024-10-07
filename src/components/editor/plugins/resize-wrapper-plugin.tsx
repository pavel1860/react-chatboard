import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, COMMAND_PRIORITY_LOW, KEY_BACKSPACE_COMMAND, KEY_ENTER_COMMAND, LexicalEditor } from "lexical";
import { useEffect, useState } from "react";
import { EditorValue } from "../util";
import {mergeRegister} from '@lexical/utils';
import React from "react";



export const useResizeWrapperPlugin = (editor: LexicalEditor, setRows: (rows: any) => void) => {

    // const [currRows, setCurrRows] = useState(2);
    const rowsRef = React.useRef(2)

    const $handleEnter = (event: KeyboardEvent, editor: LexicalEditor) => {        
        console.log('Enter key pressed')           
        if (!event.metaKey && !event.ctrlKey) {    
            rowsRef.current += 1
            console.log("Enter", rowsRef.current)
            setRows(rowsRef.current)
        } else {
            rowsRef.current = 2
            setRows(rowsRef.current)
        }
        return false
    }


    const $handleEscape = (event: KeyboardEvent, editor: LexicalEditor) => {
        const editorState = editor.getEditorState()
        editorState.read(() => {
            const root = $getRoot();
            const allNodes = root.getChildren()
            console.log('allNodes', allNodes.length, "currRows", rowsRef.current)
            if (allNodes.length + 1 < rowsRef.current) {
                rowsRef.current = Math.max(allNodes.length + 1, 2) 
                setRows(rowsRef.current)
            }
        })
        return false

    }

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                KEY_ENTER_COMMAND,
                $handleEnter,
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_BACKSPACE_COMMAND,
                $handleEscape,
                COMMAND_PRIORITY_LOW
            )
        )
    }, [editor]);


}



interface ResizeWrapperPluginProps {
    setRows: (rows: number) => void
    
}


export default function ResizeWrapperPlugin({setRows}: ResizeWrapperPluginProps){
    const [editor] = useLexicalComposerContext();
    useResizeWrapperPlugin(editor, setRows);
    return null;
}