import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AnimatePresence, motion } from 'framer-motion';
import { AssetItem } from "../../services/chatboard-service";
import { Chip, Spinner } from '@heroui/react';






interface InfiniteChatProps<M> {
    children: (item: M, idx: number, items: M[]) => React.ReactNode
    items: M[]
    gap?: string
    width?: string
    height?: string
    fetchMore: () => void,    
    loading?: boolean
    emptyMessage?: string | React.ReactNode
    endMessage?: string | React.ReactNode
}



const buildEndMessage = <M,>(messages: M[], emptyMessage?: string | React.ReactNode, endMessage?: string | React.ReactNode) => {
    if (messages.length > 0) {
        if (typeof endMessage === "string") {
            return <p className="text-center m-5">{endMessage}</p>
        }
        return endMessage
    } else {
        return emptyMessage
    }
}



export default function InfiniteChat<M>({
        children: itemRender, 
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
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        if (items.length !== itemCount) {
            setHasMore(items.length > itemCount)
            setItemCount(items.length)
        }
    }, [items])

    return (
        <div id="scrollableDiv" 
            style={{
                // height: height,
                // height: "800px",
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flexGrow: 1,
                width: "100%",
            }} 
            className="bg-body-tertiary">
                {/* <div>has more: {hasMore.toString()}</div> */}
            {loading && <Spinner classNames={{label: "text-foreground mt-4"}} variant="wave" />}
            <InfiniteScroll
                dataLength={ items.length }
                next={fetchMore}
                hasMore={hasMore}
                loader={<p className="text-center m-5">⏳&nbsp;Loading...</p>}
                endMessage={buildEndMessage(items, emptyMessage, endMessage)}
                style={{ 
                    display: "flex", 
                    flexDirection: "column-reverse", 
                    overflow: "visible", 
                    gap: gap || "10px"
                }}
                scrollableTarget="scrollableDiv"
                // initialScrollY={-420}
                inverse={true}
                // initialScrollY={0}
                onScroll={(e) => {
                    // console.log("scrolled", e)
                }}
                >
                    {items.map( (message: M, idx: number) => itemRender(message, idx, items))}
                {/* <AnimatePresence>
                    {messages.map( (message: M, idx: number) => {                        
                        return (
                            <motion.div
                                // key={message && (message as any).id ? (message as any).id : idx}
                                key={message.id}
                                initial={ idx < 2 ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                            
                            {children(message, idx, messages)}
                        </motion.div>
                    )
                    })}
                    
                </AnimatePresence>                 */}
            </InfiniteScroll>
            
        </div>
    )
}



