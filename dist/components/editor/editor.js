import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
import { QuoteNode, HeadingNode, } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode, } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { Placeholder } from "./util";
import { ToolbarPlugin } from "./plugins/toolbar";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
const editorConfig = {
    namespace: "MyEditor",
    onError(error) {
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
export function TextEditor() {
    return (_jsx(LexicalComposer, { initialConfig: editorConfig, children: _jsxs("div", { className: "relative mx-auto overflow-hidden my-5 w-full max-w-xl rounded-xl border border-gray-300 bg-white text-left font-normal leading-5 text-gray-900", children: [_jsx(ToolbarPlugin, {}), _jsxs("div", { className: "relative rounded-b-lg border-opacity-5 bg-white", children: [_jsx(RichTextPlugin, { contentEditable: _jsx(ContentEditable, { className: "lexical min-h-[280px] resize-none px-2.5 py-4 text-base caret-gray-900 outline-none" }), placeholder: _jsx(Placeholder, {}), 
                            // ErrorBoundary={null}
                            // @ts-ignore
                            ErrorBoundary: LexicalErrorBoundary }), _jsx(AutoFocusPlugin, {}), _jsx(ListPlugin, {}), _jsx(LinkPlugin, {})] })] }) }));
}
//# sourceMappingURL=editor.js.map