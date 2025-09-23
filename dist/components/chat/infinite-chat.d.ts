import React from 'react';
interface InfiniteChatProps<M> {
    children: (item: M, idx: number, items: M[], nextItem: M | undefined, prevItem: M | undefined, isLast: boolean) => React.ReactNode;
    className?: string;
    items: M[];
    gap?: string;
    width?: string;
    height?: string;
    fetchMore: () => void;
    loading?: boolean;
    emptyMessage?: string | React.ReactNode;
    endMessage?: string | React.ReactNode;
    shadowVisibility?: "top" | "bottom" | "both" | "none";
}
export default function InfiniteChat<M>({ children: itemRender, className, items, width, height, fetchMore, gap, loading, emptyMessage, endMessage, shadowVisibility }: InfiniteChatProps<M>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=infinite-chat.d.ts.map