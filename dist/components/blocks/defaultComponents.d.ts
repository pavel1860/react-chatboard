import React from "react";
import { BlockChunkType, BlockSentType, BlockType, SpanType } from "../chat/schema";
export declare const DefaultText: (chunk: BlockChunkType) => import("react/jsx-runtime").JSX.Element;
export declare const DefaultSentence: (sent: BlockSentType) => import("react/jsx-runtime").JSX.Element;
export declare const DefaultBlock: (block: BlockType) => import("react/jsx-runtime").JSX.Element;
export declare const DefaultButton: (block: BlockType) => import("react/jsx-runtime").JSX.Element;
export declare const useBlock: (block: BlockType) => {
    content: any;
};
export interface SpanProps {
    children: React.ReactNode;
    span: SpanType;
}
export declare const BasicSpan: ({ children, span }: SpanProps) => import("react/jsx-runtime").JSX.Element;
export declare const HiddenSpan: ({ children, span }: SpanProps) => import("react/jsx-runtime").JSX.Element;
export interface BlockProps {
    children: React.ReactNode;
    block: BlockType;
}
export declare const HiddenBlock: ({ children, block }: BlockProps) => import("react/jsx-runtime").JSX.Element;
export declare const BasicBlock: ({ children, block }: BlockProps) => import("react/jsx-runtime").JSX.Element;
export declare const AvatarSpan: ({ children, span }: SpanProps) => import("react/jsx-runtime").JSX.Element;
export declare const AnswerBlock: ({ children, block }: BlockProps) => import("react/jsx-runtime").JSX.Element;
export declare const UserMessage: ({ children, block }: BlockProps) => import("react/jsx-runtime").JSX.Element;
export declare const AutosuggestionsBlock: ({ children, block }: BlockProps) => import("react/jsx-runtime").JSX.Element;
export declare const SuggestionItem: ({ children, block }: BlockProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=defaultComponents.d.ts.map