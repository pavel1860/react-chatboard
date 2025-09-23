import React from "react";
import { BlockType, BlockSentType, BlockChunkType, SpanType } from "../chat/schema";
type BlockRendererFn = (block: BlockType | BlockSentType | BlockChunkType) => React.ReactNode;
type SpanRendererFn = (span: SpanType) => React.ReactNode;
export type BlockConfig = {
    component: BlockRendererFn;
    isHidden: boolean | null;
    isWrapper: boolean;
};
export type SpanConfig = {
    component: SpanRendererFn;
    isHidden: boolean | null;
    isWrapper: boolean;
};
export type RegistryProps = {
    span: Record<string, Partial<SpanConfig> | SpanRendererFn | null>;
    block: Record<string, Partial<BlockConfig> | BlockRendererFn | null>;
};
export type Registry = {
    span: Record<string, SpanConfig>;
    block: Record<string, BlockConfig>;
};
export interface ComponentProviderProps {
    plainMode: boolean;
    setPlainMode: (plainMode: boolean) => void;
    registry: Registry;
    debugOutlines?: boolean;
    setDebugOutlines: (debugOutlines: boolean) => void;
    getComponent: (tags: string[], type: "block" | "span") => BlockConfig | SpanConfig;
}
export declare function UserComponentProvider({ registry: registryProps, children, debugOutlines: debugOutlinesProps, }: {
    registry: RegistryProps;
    children: React.ReactNode;
    debugOutlines?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function useComponentRegistry(): ComponentProviderProps;
export declare function useComponentConfig(tags: string[], type: "block" | "span"): BlockConfig | SpanConfig;
export {};
//# sourceMappingURL=UserComponentRegistry.d.ts.map