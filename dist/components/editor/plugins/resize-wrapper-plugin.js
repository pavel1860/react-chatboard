// @ts-nocheck
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, COMMAND_PRIORITY_LOW, KEY_BACKSPACE_COMMAND, KEY_ENTER_COMMAND } from "lexical";
import { useEffect } from "react";
import { mergeRegister } from '@lexical/utils';
import React from "react";
export const useResizeWrapperPlugin = (editor, setRows) => {
    // const [currRows, setCurrRows] = useState(2);
    const rowsRef = React.useRef(2);
    const $handleEnter = (event, editor) => {
        console.log('Enter key pressed');
        if (!event.metaKey && !event.ctrlKey) {
            rowsRef.current += 1;
            console.log("Enter", rowsRef.current);
            setRows(rowsRef.current);
        }
        else {
            rowsRef.current = 2;
            setRows(rowsRef.current);
        }
        return false;
    };
    const $handleEscape = (event, editor) => {
        const editorState = editor.getEditorState();
        editorState.read(() => {
            const root = $getRoot();
            const allNodes = root.getChildren();
            console.log('allNodes', allNodes.length, "currRows", rowsRef.current);
            if (allNodes.length + 1 < rowsRef.current) {
                rowsRef.current = Math.max(allNodes.length + 1, 2);
                setRows(rowsRef.current);
            }
        });
        return false;
    };
    useEffect(() => {
        return mergeRegister(editor.registerCommand(KEY_ENTER_COMMAND, $handleEnter, COMMAND_PRIORITY_LOW), editor.registerCommand(KEY_BACKSPACE_COMMAND, $handleEscape, COMMAND_PRIORITY_LOW));
    }, [editor]);
};
export default function ResizeWrapperPlugin({ setRows }) {
    const [editor] = useLexicalComposerContext();
    useResizeWrapperPlugin(editor, setRows);
    return null;
}
//# sourceMappingURL=resize-wrapper-plugin.js.map