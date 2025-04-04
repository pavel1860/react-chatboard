import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AnimatePresence, motion } from 'framer-motion';
import { AssetItem } from "../../services/chatboard-service";
import { Chip, Spinner } from '@nextui-org/react';
import { BaseArtifactType } from '../../model/services/model-service';





interface InfiniteChatProps<M extends BaseArtifactType> {
    messages: M[]
    gap?: string
    width?: string
    height?: string
    fetchMore: () => void,
    children: (message: M, idx: number, prevMessage?: M) => React.ReactNode
    loading?: boolean
}





export default function InfiniteChat<M extends BaseArtifactType>({messages, children, width, height, fetchMore, gap, loading}: InfiniteChatProps<M>) {
    
    const MAX_DATA = 1000;

    // const hasMore = messages.length < MAX_DATA;
    const hasMore = false;

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
            {loading && <Spinner classNames={{label: "text-foreground mt-4"}} variant="wave" />}
            <InfiniteScroll
                dataLength={ messages.length }
                next={fetchMore}
                hasMore={hasMore}
                loader={<p className="text-center m-5">⏳&nbsp;Loading...</p>}
                // loader={<p className="text-center m-5">{loading ? "⏳&nbsp;Loading..." : "⏳&nbsp;Loading..."}</p>}
                // loader={<p className="text-center m-5">{loading ? "⏳&nbsp;Loading..." : "⏳&nbsp;Loading..."}</p>}
                endMessage={<p className="text-center m-5">{messages.length > 0 ? "No more messages" : "No messages"}</p>}
                style={{ 
                    display: "flex", 
                    flexDirection: "column-reverse", 
                    overflow: "visible", 
                    gap: gap || "10px"
                }}
                scrollableTarget="scrollableDiv"
                inverse={true}
                // initialScrollY={0}
                onScroll={(e) => {
                    console.log("scrolled", e)
                }}
                >
                <AnimatePresence>
                    {messages.map( (message: M, idx: number) => {
                        // let turn = undefined;
                        // if (idx > 0) {
                        //     if (message.turn_id !== (messages[idx - 1] as any).turn_id) {
                        //         // turn = <Chip color="default">Turn {message.turn_id}</Chip>
                        //         turn = TurnChip(message.turn_id)
                        //     }
                        // } else {
                        //     turn = TurnChip(message.turn_id)
                        // }
                        let prevMessage = idx > 0 ? messages[idx - 1] as M : undefined;
                        
                        return (
                            <motion.div
                                // key={message && (message as any).id ? (message as any).id : idx}
                                key={message.id}
                                initial={ idx < 2 ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                            
                            {children(message, idx, prevMessage)}
                        </motion.div>
                    )
                    })}
                    
                </AnimatePresence>                
            </InfiniteScroll>
            
        </div>
    )
}



