// @ts-nocheck
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND, LexicalEditor } from "lexical";
import {mergeRegister} from '@lexical/utils';
import { useEffect } from "react";
import { EditorValue } from "../util";




export const useKeyPressPlugin = (editor: LexicalEditor, onKeyPress?: (value: EditorValue)=>void, dontClear?: boolean) => {

    const $handleEnter = (event: KeyboardEvent, editor: LexicalEditor) => {        
        if (event.metaKey || event.ctrlKey) {
            const editorState = editor.getEditorState()            
            editorState.read(() => {                
                const root = $getRoot();
                const currentText = root.getAllTextNodes().map(textNode => textNode.getTextContent()).join('')
                if (onKeyPress)
                    onKeyPress({text: currentText})
                    if (!dontClear) {
                        editor.update(() => {
                            root.clear()
                        })
                    }
            })
            // return true;
        }
        return false
        
    }

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                KEY_ENTER_COMMAND,
                $handleEnter,
                COMMAND_PRIORITY_LOW
            )
        )
    }, [editor]);


}



interface KeyPressPluginProps {
    onKeyPress?: (value: EditorValue) => void;
    dontClear?: boolean;
}


export default function KeyPressPlugin({onKeyPress, dontClear}: KeyPressPluginProps){
    const [editor] = useLexicalComposerContext();
    useKeyPressPlugin(editor, onKeyPress, dontClear);
    return null;
}
