// @ts-ignore
import objectPath from "object-path";
import { BlockChunkSchema, BlockSchema, BlockSentSchema } from "./schema";
// export const $getPath = (path: any, zeroPath: boolean = true) => path.reduce((acc, a)=> [...acc, a - (zeroPath ? 1 : 0), "children"], []).slice(1).slice(0,-1)
// export const $getPath = (path: any) => path.reduce((acc, a)=> [...acc, a-1, "children"], []).slice(1)
// export const $getPath = (path: any) => path.reduce((acc, a)=> [...acc, a, "children"], []).slice(1).slice(0,-1)
export const $getPath = (path) => path.reduce((acc, a) => [...acc, "children", a], []);
export const $splitPathIndex = (path) => {
    const index = path.at(-1);
    const realPath = path.slice(0, -1);
    if (index !== undefined) {
        return [realPath, index];
    }
    throw new Error(`Index not found in path: ${path}`);
};
export const $isPostfix = (path) => {
    const index = path.at(-1);
    if (index !== undefined) {
        return index === -1;
    }
    return false;
};
export const $setBlock = (block, path, value) => {
    const jsonPath = $getPath(path);
    return objectPath.set(block, jsonPath, value);
};
export const $insertBlock = (block, path, value) => {
    const jsonPath = $getPath(path);
    const [realPath, index] = $splitPathIndex(jsonPath);
    // @ts-ignore
    const target = objectPath.get(block, realPath.slice(0, -1));
    console.log("inserting", value.Type, "to", target?.Type);
    return objectPath.insert(block, realPath, value, index);
};
export const $insertBlockChunk = (block, path, index, value) => {
    const jsonPath = $getPath(path);
    const realPath = [...jsonPath, "content", "children"];
    return objectPath.insert(block, realPath, value, index);
};
// export const $insertChildBlock = (block: any, path: number[], value: any) => {
//     let index = path.at(-1)
//     if (index !== undefined) {
//         index = index - 1
//     }
//     const jsonPath = $getPath(path.slice(0, -1))
//     jsonPath.push("children")
//     return objectPath.insert(block, jsonPath, value,)
// }
export const $insertRootBlock = (block, path, value) => {
    const jsonPath = $getPath(path);
    jsonPath.push("content");
    jsonPath.push("children");
    return objectPath.insert(block, jsonPath, value);
};
export const $insertPostfix = (block, path, value) => {
    const jsonPath = $getPath(path);
    jsonPath.push("postfix");
    return objectPath.set(block, jsonPath, value);
};
export const $getBlock = (block, path) => {
    const jsonPath = $getPath(path);
    return objectPath.get(block, jsonPath);
};
export const $isBlockType = (block, path, type) => {
    const jsonPath = $getPath(path);
    const target = objectPath.get(block, jsonPath);
    return target?._type === type;
};
export const $mapBlocks = (block, path, fn) => {
    const jsonPath = $getPath(path);
    const target = objectPath.get(block, jsonPath);
    if (target?._type === "BlockChunk") {
        throw new Error("nothing to map in BlockChunk");
    }
    return target.children.map(fn);
};
export const $forEachBlock = (block, path, fn) => {
    const jsonPath = $getPath(path);
    const target = objectPath.get(block, jsonPath);
    if (target?._type === "BlockChunk") {
        throw new Error("nothing to forEach in BlockChunk");
    }
    target.children.forEach(fn);
};
export const $countBlocks = (block, path) => {
    const jsonPath = $getPath(path);
    const target = objectPath.get(block, jsonPath);
    if (target?._type === "BlockChunk") {
        throw new Error("nothing to cound in BlockChunk");
    }
    return target.children.length;
};
export const $buildChunk = (props) => {
    const block = {
        Type: "BlockChunk",
        index: props.index ?? 0,
        content: props.content ?? "",
        logprob: props.logprob ?? undefined,
    };
    BlockChunkSchema.parse(block);
    return block;
};
export const $buildSent = (props) => {
    const block = {
        Type: "BlockSent",
        index: props.index ?? 0,
        path: props.path ?? [],
        children: props.children ?? [],
    };
    BlockSentSchema.parse(block);
    return block;
};
export const $buildBlock = (props) => {
    const block = {
        Type: "Block",
        index: props.index ?? 0,
        path: props.path ?? [],
        tags: props.tags ?? [],
        content: props.content ?? $buildSent({}),
        children: props.children ?? [],
        postfix: props.postfix ?? undefined,
        role: props.role ?? undefined,
        styles: props.styles ?? [],
        attrs: props.attrs ?? {},
    };
    // BlockSchema.parse(block)
    const result = BlockSchema.safeParse(block);
    if (!result.success) {
        console.error(result.error.errors);
        throw new Error(`Failed to parse block: ${result.error.errors}`);
    }
    return block;
};
export const $renderSent = (sent) => {
    return sent.children.map((c) => c.content).join("");
};
//# sourceMappingURL=blockUtils.js.map