import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AnimatePresence, motion } from 'framer-motion';
import { AssetItem } from "../../services/chatboard-service";
import { Chip, Spinner } from '@heroui/react';
import { BaseArtifactType } from '../../model/services/model-service';





interface InfiniteChatProps<M extends BaseArtifactType> {
    messages: M[]
    gap?: string
    width?: string
    height?: string
    fetchMore: () => void,
    children: (message: M, idx: number, messages?: M[]) => React.ReactNode
    loading?: boolean
    emptyMessage?: string | React.ReactNode
    endMessage?: string | React.ReactNode
}



const buildEndMessage = <M extends BaseArtifactType>(messages: M[], emptyMessage?: string | React.ReactNode, endMessage?: string | React.ReactNode) => {
    if (messages.length > 0) {
        if (typeof endMessage === "string") {
            return <p className="text-center m-5">{endMessage}</p>
        }
        return endMessage
    } else {
        return emptyMessage
    }
}



export default function InfiniteChat<M extends BaseArtifactType>({
        messages, 
        children, 
        width, 
        height, 
        fetchMore, 
        gap, 
        loading, 
        emptyMessage = "No messages", 
        endMessage = "No more messages"
    }: InfiniteChatProps<M>) {

    const [itemCount, setItemCount] = useState(messages.length || 0)
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        if (messages.length !== itemCount) {
            setHasMore(messages.length > itemCount)
            setItemCount(messages.length)
        }
    }, [messages])

    return (
        <div id="scrollableDiv" 
            style={{
                // height: height,
                // height: "800px",
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
            }} 
            className="bg-body-tertiary p-3">
                {/* <div>has more: {hasMore.toString()}</div> */}
            {loading && <Spinner classNames={{label: "text-foreground mt-4"}} variant="wave" />}
            <InfiniteScroll
                dataLength={ messages.length }
                next={fetchMore}
                hasMore={hasMore}
                loader={<p className="text-center m-5">⏳&nbsp;Loading...</p>}
                endMessage={buildEndMessage(messages, emptyMessage, endMessage)}
                style={{ 
                    display: "flex", 
                    flexDirection: "column-reverse", 
                    overflow: "visible", 
                    gap: gap || "10px"
                }}
                scrollableTarget="scrollableDiv"
                initialScrollY={-420}
                inverse={true}
                // initialScrollY={0}
                onScroll={(e) => {
                    // console.log("scrolled", e)
                }}
                >
                    {messages.map( (message: M, idx: number) => children(message, idx, messages))}
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



