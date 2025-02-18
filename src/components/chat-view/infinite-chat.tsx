import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AnimatePresence, motion } from 'framer-motion';
import { AssetItem } from "../../services/chatboard-service";
import { Chip } from '@nextui-org/react';





interface InfiniteChatProps<M> {
    messages: M[]
    gap?: string
    width?: string
    height?: string
    fetchMore: () => void,
    children: (message: M, idx: number) => React.ReactNode
}


function TurnChip(turn_id: number) {
    return <span className="text-xs text-gray-500">End of Turn {turn_id}</span>
}


export default function InfiniteChat<I, O, M>({messages, children, width, height, fetchMore, gap}: InfiniteChatProps<M>) {
    
    const MAX_DATA = 1000;

    const hasMore = messages.length < MAX_DATA;

    return (
        <div id="scrollableDiv" style={{
                // height: height,
                height: "800px",
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
            }} className="bg-body-tertiary p-3">
            <InfiniteScroll
                dataLength={ messages.length }
                next={fetchMore}
                hasMore={hasMore}
                // loader={<p className="text-center m-5">⏳&nbsp;Loading...</p>}
                loader={<p className="text-center m-5"></p>}
                endMessage={<p className="text-center m-5">That&apos;s all folks!🐰🥕</p>}
                style={{ display: "flex", flexDirection: "column-reverse", overflow: "visible", gap: gap || "10px"}}
                scrollableTarget="scrollableDiv"
                inverse={true}
                // initialScrollY={0}
                onScroll={(e) => {
                    console.log("scrolled", e)
                }}
                >
                <AnimatePresence>
                    {messages.map( (message: M, idx: number) => {
                        let turn = undefined;
                        if (idx > 0) {
                            if (message.turn_id !== (messages[idx - 1] as any).turn_id) {
                                // turn = <Chip color="default">Turn {message.turn_id}</Chip>
                                turn = TurnChip(message.turn_id)
                            }
                        } else {
                            turn = TurnChip(message.turn_id)
                        }
                        return (
                            <motion.div
                                key={message && (message as any).id ? (message as any).id : idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                        >
                            
                            {children(message, idx)}
                            {turn}
                        </motion.div>
                    )
                    })}
                </AnimatePresence>
            </InfiniteScroll>
        </div>
    )
}



