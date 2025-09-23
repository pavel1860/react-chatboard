// @ts-nocheck
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND } from "lexical";
import { mergeRegister } from '@lexical/utils';
import { useEffect } from "react";
export const useKeyPressPlugin = (editor, onKeyPress, dontClear) => {
    const $handleEnter = (event, editor) => {
        if (event.metaKey || event.ctrlKey) {
            const editorState = editor.getEditorState();
            editorState.read(() => {
                const root = $getRoot();
                const currentText = root.getAllTextNodes().map(textNode => textNode.getTextContent()).join('');
                if (onKeyPress)
                    onKeyPress({ text: currentText });
                if (!dontClear) {
                    editor.update(() => {
                        root.clear();
                    });
                }
            });
            // return true;
        }
        return false;
    };
    useEffect(() => {
        return mergeRegister(editor.registerCommand(KEY_ENTER_COMMAND, $handleEnter, COMMAND_PRIORITY_LOW));
    }, [editor]);
};
export default function KeyPressPlugin({ onKeyPress, dontClear }) {
    const [editor] = useLexicalComposerContext();
    useKeyPressPlugin(editor, onKeyPress, dontClear);
    return null;
}
//# sourceMappingURL=key-press.js.map