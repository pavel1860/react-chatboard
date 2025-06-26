import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { cn, Spinner } from '@heroui/react';






interface InfiniteChatProps<M> {
    children: (item: M, idx: number, items: M[], nextItem: M | undefined, prevItem: M | undefined, isLast: boolean) => React.ReactNode
    className?: string
    items: M[]
    gap?: string
    width?: string
    height?: string
    fetchMore: () => void,    
    loading?: boolean
    emptyMessage?: string | React.ReactNode
    endMessage?: string | React.ReactNode
}



const buildEndMessage = <M,>(messages: M[], emptyMessage?: string | React.ReactNode, endMessage?: string | React.ReactNode, loading?: boolean) => {
    if (messages.length > 0) {
        if (typeof endMessage === "string") {
            return <p className="text-center m-5">{endMessage}</p>
        }
        return endMessage
    } else if (!loading) {
        return emptyMessage
    }
}



export default function InfiniteChat<M>({
        children: itemRender, 
        className,
        items,         
        width, 
        height, 
        fetchMore, 
        gap, 
        loading, 
        emptyMessage = "No messages", 
        endMessage = "No more messages"
    }: InfiniteChatProps<M>) {

    const [itemCount, setItemCount] = useState(items.length || 0)
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        if (items.length !== itemCount) {
            setHasMore(items.length > itemCount)
            setItemCount(items.length)
        }
    }, [items])

    return (
        <div id="scrollableDiv" 
            className={cn(
                "flex flex-col-reverse items-stretch w-full flex-grow", 
                // "overflow-auto"
                items?.length > 0 ? "overflow-auto" : "overflow-hidden"
            )}
            >                
                {/* <div>has more: {hasMore.toString()}</div> */}
            {loading && <Spinner classNames={{label: "text-foreground mt-4"}} variant="wave" />}
            <InfiniteScroll
                dataLength={ items.length }
                next={fetchMore}
                hasMore={hasMore}
                loader={<Spinner classNames={{label: "text-gray-500 mt-4"}} label="Loading more messages..." variant="spinner" />}
                endMessage={buildEndMessage(items, emptyMessage, endMessage, loading)}
                className={cn("w-full max-w-4xl mx-auto items-center flex flex-col-reverse overflow-visible gap-2", className)}
                scrollableTarget="scrollableDiv"
                // initialScrollY={-420}
                inverse={true}
                // initialScrollY={0}
                // hasChildren={false}
                onScroll={(e) => {
                    // console.log("scrolled", e)
                }}
                >
                    {items.map( (message: M, idx: number) => itemRender(message, idx, items, items[idx - 1], items[idx + 1], idx === items.length - 1))}                
            </InfiniteScroll>
            
        </div>
    )
}



