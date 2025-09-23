import { LexicalEditor } from "lexical";
import { EditorValue } from "../util";
export declare const useKeyPressPlugin: (editor: LexicalEditor, onKeyPress?: (value: EditorValue) => void, dontClear?: boolean) => void;
interface KeyPressPluginProps {
    onKeyPress?: (value: EditorValue) => void;
    dontClear?: boolean;
}
export default function KeyPressPlugin({ onKeyPress, dontClear }: KeyPressPluginProps): null;
export {};
//# sourceMappingURL=key-press.d.ts.map