import { LexicalEditor } from "lexical";
export declare const useResizeWrapperPlugin: (editor: LexicalEditor, setRows: (rows: any) => void) => void;
interface ResizeWrapperPluginProps {
    setRows: (rows: number) => void;
}
export default function ResizeWrapperPlugin({ setRows }: ResizeWrapperPluginProps): null;
export {};
//# sourceMappingURL=resize-wrapper-plugin.d.ts.map