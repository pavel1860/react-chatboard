import { BlockType, BlockChunkType, BlockSentType } from "./schema";
export declare const $getPath: (path: any) => any;
export declare const $splitPathIndex: (path: number[]) => (number | number[])[];
export declare const $isPostfix: (path: number[]) => boolean;
export declare const $setBlock: (block: any, path: number[], value: any) => any;
export declare const $insertBlock: (block: any, path: number[], value: any) => any;
export declare const $insertBlockChunk: (block: any, path: number[], index: number, value: any) => any;
export declare const $insertRootBlock: (block: any, path: number[], value: any) => any;
export declare const $insertPostfix: (block: any, path: number[], value: any) => any;
export declare const $getBlock: (block: any, path: number[]) => any;
export declare const $isBlockType: (block: any, path: number[], type: string) => boolean;
export declare const $mapBlocks: (block: any, path: number[], fn: (block: any) => any) => any;
export declare const $forEachBlock: (block: any, path: number[], fn: (block: any) => any) => void;
export declare const $countBlocks: (block: any, path: number[]) => any;
export declare const $buildChunk: (props: Partial<BlockChunkType>) => {
    Type: string;
    index: number;
    content: string;
    logprob: number | undefined;
};
export declare const $buildSent: (props: Partial<BlockSentType>) => {
    Type: string;
    index: number;
    path: number[];
    children: {
        Type: string;
        index: number;
        content: string;
        logprob?: number | null | undefined;
    }[];
};
export declare const $buildBlock: (props: Partial<BlockType>) => {
    Type: string;
    index: any;
    path: any;
    tags: any;
    content: any;
    children: any;
    postfix: any;
    role: any;
    styles: any;
    attrs: any;
};
export declare const $renderSent: (sent: any) => any;
//# sourceMappingURL=blockUtils.d.ts.map