import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-nocheck
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
// const theme = {
//     paragraph: 'editor-paragraph',
//     heading: { h1: 'editor-h1', h2: 'editor-h2' },
//     // …add the CSS classes you like (Tailwind works great)
// };
const theme = {
    paragraph: 'my-2 leading-7 text-gray-800',
    heading: {
        h1: 'text-xl font-bold my-4',
        h2: 'text-lg font-semibold my-3',
    },
    list: {
        ul: 'list-disc ml-6',
        ol: 'list-decimal ml-6',
    },
    quote: 'border-l-4 pl-4 italic text-gray-600 my-4',
    // code: 'bg-gray-800 text-green-300 p-2 rounded font-mono',
};
const editorConfig = {
    namespace: 'MarkdownEditor',
    theme,
    nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        CodeNode,
        LinkNode,
        HorizontalRuleNode,
        // AgentActionNode,
        // {
        //     replace: TextNode,
        //     with: (node: TextNode) => {
        //         return $createAgentActionNode(node.__text)
        //     }
        // }
    ], // add custom nodes if you need them
    onError(error) { throw error; },
};
export default function MarkdownEditor({ text = '', onChange, notEditable, placeholder }) {
    const initialConfig = {
        ...editorConfig,
        editable: notEditable ? false : true,
        editorState: () => $convertFromMarkdownString(text, TRANSFORMERS),
    };
    return (_jsxs(LexicalComposer, { initialConfig: initialConfig, children: [_jsx(RichTextPlugin
            // @ts-ignore
            , { 
                // @ts-ignore
                placeholder: placeholder && _jsx("span", { className: "text-gray-400", children: placeholder }), contentEditable: _jsx(ContentEditable, { className: "outline-none" }) }), _jsx(HistoryPlugin, {}), _jsx(MarkdownShortcutPlugin, { transformers: TRANSFORMERS }), _jsx(OnChangePlugin, { onChange: (state, editor) => {
                    const md = editor.getEditorState().read(() => $convertToMarkdownString(TRANSFORMERS));
                    onChange?.(md);
                } })] }));
}
//# sourceMappingURL=markdownEditor.js.map