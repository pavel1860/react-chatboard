
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
import { Placeholder } from "./util";
import { ToolbarPlugin } from "./plugins/toolbar";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";







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

export function TextEditor() {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="relative mx-auto overflow-hidden my-5 w-full max-w-xl rounded-xl border border-gray-300 bg-white text-left font-normal leading-5 text-gray-900">
                <ToolbarPlugin />
                <div className="relative rounded-b-lg border-opacity-5 bg-white">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="lexical min-h-[280px] resize-none px-2.5 py-4 text-base caret-gray-900 outline-none" />
                        }
                        placeholder={<Placeholder />}
                        // ErrorBoundary={null}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}