import { jsx as _jsx } from "react/jsx-runtime";
// @ts-nocheck
import { useEffect, useRef, useState } from "react";
export function StreamingContent2() {
    // const { events, isStreaming, consumed } = useStream(["stream_start", "stream_delta", "stream_end"]);
    // const { events, isStreaming } = useStream();
    const [chunks, setChunks] = useState([]); // Visible chunks
    const [rawChunks, setRawChunks] = useState([]); // Incoming queue
    const animationRef = useRef(null);
    // Step 1: Accumulate raw streamed chunks
    useEffect(() => {
        const newContent = events
            .filter((e) => e.payload?.content)
            .map((e) => e.payload.content);
        consumed(events);
        if (newContent.length > 0) {
            setRawChunks((prev) => [...prev, ...newContent]);
        }
    }, [events]);
    // Step 2: Reveal one chunk at a time
    useEffect(() => {
        if (animationRef.current || rawChunks.length === 0)
            return;
        animationRef.current = setInterval(() => {
            setRawChunks((queue) => {
                if (queue.length === 0) {
                    clearInterval(animationRef.current);
                    animationRef.current = null;
                    return [];
                }
                const [next, ...rest] = queue;
                setChunks((prev) => [...prev, next]);
                return rest;
            });
        }, 40);
        return () => {
            clearInterval(animationRef.current);
            animationRef.current = null;
        };
    }, [rawChunks]);
    return (_jsx("div", { className: "max-w-4xl", children: _jsx("div", { className: " whitespace-pre-wrap leading-relaxed", children: chunks.map((chunk, i) => (_jsx(FadeInChunk, { content: chunk }, i))) }) }));
}
import { motion } from "framer-motion";
export function FadeInChunk({ content }) {
    return (_jsx(motion.span, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: {
            duration: 0.3,
            // ease: [0, 0.71, 0.2, 1.01],
            // ease: "easeInOut"
            // ease: "easeIn"
            ease: "easeOut"
        }, className: "inline-block", children: content }));
}
import { JSONTree } from "react-json-tree";
export function useStreamTree() {
    const rootRef = useRef({ type: "root", children: [] });
    const stackRef = useRef([rootRef.current]);
    const [tree, setTree] = useState(rootRef.current);
    // const { events, isStreaming, consumed } = useStream(["stream_start", "stream_delta", "stream_end"]);
    useEffect(() => {
        events.forEach((e) => {
            if (e.type !== "stream_delta")
                return;
            const tags = e.payload?.tags || [];
            console.log(e);
            // Opening tag
            if (tags.includes("tag_start")) {
                console.log("TAG START", e.payload.tags);
                const name = extractTagName(e.payload);
                const newNode = { type: "tag", name, children: [] };
                const parent = stackRef.current[stackRef.current.length - 1];
                if (parent.type === "tag" || parent.type === "root") {
                    parent.children.push(newNode);
                    stackRef.current.push(newNode);
                }
            }
            // Closing tag
            else if (tags.includes("tag_end")) {
                console.log("TAG END", e.payload.tags);
                stackRef.current.pop();
            }
            // Text content
            else if (tags.includes("chunk") && e.payload.content) {
                const parent = stackRef.current[stackRef.current.length - 1];
                if (parent.type === "tag" || parent.type === "root") {
                    const lastChild = parent.children[parent.children.length - 1];
                    if (lastChild?.type === "text") {
                        lastChild.content += e.payload.content;
                    }
                    else {
                        parent.children.push({ type: "text", content: e.payload.content });
                    }
                }
            }
        });
        // Force React to re-render with a copy
        setTree({ ...rootRef.current });
    }, [events]);
    return tree;
}
function extractTagName(payload) {
    return payload?.name || payload?.tag || "unknown";
}
export function StreamingContent() {
    const [counter, setCounter] = useState(0);
    const tree = useStreamTree();
    useEffect(() => {
        setCounter(counter + 1);
    }, [tree]);
    return (_jsx("div", { children: _jsx(JSONTree, { data: tree }, counter) }));
}
//# sourceMappingURL=streamingContent.js.map