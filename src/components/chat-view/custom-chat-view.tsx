
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import MessageCard  from "../assets/custom-message-card";
import { AssetItem } from "../../services/chatboard-service";


interface ChatListProps<I, O, M> {
    messages: AssetItem<I, O, M>[]
    inputMessageComp: (input: I, metadata: M) => React.ReactNode
    outputMessageComp: (output: O, metadata: M) => React.ReactNode
    width?: string
    height?: string
}

export default function ChatList<I, O, M>({messages, inputMessageComp, outputMessageComp, width, height}: ChatListProps<I,O,M>) {
    const [ data, setData ] = useState( messages );
    const MAX_DATA = 1000;
    const hasMore = data.length < MAX_DATA;

    useEffect(()=>{
        setData(messages)
    }, [messages])

    function fetchData( limit=10 ){
        // const start = data.length + 1;
        // const end = (data.length + limit) >= MAX_DATA 
        //             ? MAX_DATA 
        //             : (data.length + limit);
        // let newData = [ ...data ];
        
        // for( var i = start ; i <= end ; i++ ) {
        //     newData = [ ...newData, i ];
        // }
    
        // // fake delay to simulate a time-consuming network request
        // setTimeout( () => setData( newData ), 1500 );
    }

    return (
        <div id="scrollableDiv" style={{
                // width: width || "1000px", 
                height: height || "100vh", 
                overflowY: "scroll", 
                display: "flex", 
                flexDirection: "column-reverse", 
                margin: "auto"
            }} className="bg-body-tertiary p-3">
            <InfiniteScroll
                dataLength={ data.length }
                next={fetchData}
                hasMore={hasMore}
                loader={<p className="text-center m-5">⏳&nbsp;Loading...</p>}
                endMessage={<p className="text-center m-5">That&apos;s all folks!🐰🥕</p>}
                style={{ display: "flex", flexDirection: "column-reverse", overflow: "visible" }}
                scrollableTarget="scrollableDiv"
                inverse={true}
                >
                {
                    data.map( (message: AssetItem<I, O, M>) => (
                        <MessageCard 
                            message={message} 
                            inputMessageComp={inputMessageComp}
                            outputMessageComp={outputMessageComp}
                        />
                    ))
                }
            </InfiniteScroll>
        </div>
    )
}