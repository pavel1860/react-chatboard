import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { cn, Spinner } from '@heroui/react';
const buildEndMessage = (messages, emptyMessage, endMessage, loading) => {
    if (messages.length > 0) {
        if (typeof endMessage === "string") {
            return _jsx("p", { className: "text-center m-5", children: endMessage });
        }
        return endMessage;
    }
    else if (!loading) {
        return emptyMessage;
    }
};
export default function InfiniteChat({ children: itemRender, className, items, width, height, fetchMore, gap, loading, emptyMessage = "No messages", endMessage = "No more messages", shadowVisibility = "top" }) {
    const [itemCount, setItemCount] = useState(items.length || 0);
    const [hasMore, setHasMore] = useState(false);
    useEffect(() => {
        if (items.length !== itemCount) {
            setHasMore(items.length > itemCount);
            setItemCount(items.length);
        }
    }, [items]);
    return (
    // <ScrollShadow visibility = {shadowVisibility}>
    _jsx("div", { id: "scrollableDiv", className: cn("flex flex-col-reverse items-stretch w-full flex-grow scrollbar-thumb-only", 
        // "overflow-hidden",
        // "overflow-auto"
        items?.length > 0 ? "overflow-auto" : "overflow-hidden"), children: _jsx(InfiniteScroll, { dataLength: items.length, next: fetchMore, hasMore: hasMore, loader: _jsx(Spinner, { classNames: { label: "text-gray-500 mt-4" }, label: "Loading more messages...", variant: "spinner" }), endMessage: buildEndMessage(items, emptyMessage, endMessage, loading), className: cn("w-full max-w-4xl mx-auto items-center flex flex-col-reverse overflow-visible gap-2", className), scrollableTarget: "scrollableDiv", 
            // initialScrollY={-420}
            inverse: true, 
            // initialScrollY={0}
            // hasChildren={false}
            onScroll: (e) => {
                // console.log("scrolled", e)
            }, children: items.map((message, idx) => itemRender(message, idx, items, items[idx - 1], items[idx + 1], idx === items.length - 1)) }) })
    // </ScrollShadow>
    );
}
//# sourceMappingURL=infinite-chat.js.map