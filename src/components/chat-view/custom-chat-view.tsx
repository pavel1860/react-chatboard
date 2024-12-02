
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AssetItem } from "../../services/chatboard-service";





interface ChatListProps<I, O, M> {
    messages: AssetItem<I, O, M>[]
    messageComp: (message: AssetItem<I, O, M>) => React.ReactNode    
    width?: string
    height?: string
    fetchMore: () => void
}


export default function InfiniteChat<I, O, M>({messages, messageComp, width, height, fetchMore}: ChatListProps<I,O,M>) {
    
    const MAX_DATA = 1000;

    const hasMore = messages.length < MAX_DATA;

    return (
        <div id="scrollableDiv" style={{
                // width: width || "1000px", 
                // height: height || "100vh", 
                height: height || "100%", 
                width: width || "100%",
                overflowY: "scroll", 
                display: "flex",
                flexDirection: "column-reverse", 
                margin: "auto"
            }} className="bg-body-tertiary p-3">
            <InfiniteScroll
                dataLength={ messages.length }
                next={fetchMore}
                hasMore={hasMore}
                loader={<p className="text-center m-5">⏳&nbsp;Loading...</p>}
                endMessage={<p className="text-center m-5">That&apos;s all folks!🐰🥕</p>}
                style={{ display: "flex", flexDirection: "column-reverse", overflow: "visible" }}
                scrollableTarget="scrollableDiv"
                inverse={true}
                >
                {
                    messages.map( (message: AssetItem<I, O, M>) => (
                        <div key={message.id}>
                            {messageComp(message)}
                        </div>
                    ))
                }
            </InfiniteScroll>
        </div>
    )
}



// interface ChatListProps<I, O, M> {
//     messages: AssetItem<I, O, M>[]
//     messageComp: (message: AssetItem<I, O, M>) => React.ReactNode
//     leftIconComp?: (message: AssetItem<I, O, M>) => React.ReactNode
//     isInputCheck: (message: AssetItem<I, O, M>) => boolean
//     width?: string
//     height?: string
//     fetchMore: () => void
// }

// export default function InfiniteChat<I, O, M>({messages, messageComp, isInputCheck, width, height, leftIconComp, fetchMore}: ChatListProps<I,O,M>) {
//     const MAX_DATA = 1000;

//     const hasMore = messages.length < MAX_DATA;


//     // function fetchData( limit=10 ){        
//         // const start = data.length + 1;
//         // const end = (data.length + limit) >= MAX_DATA 
//         //             ? MAX_DATA 
//         //             : (data.length + limit);
//         // let newData = [ ...data ];
        
//         // for( var i = start ; i <= end ; i++ ) {
//         //     newData = [ ...newData, i ];
//         // }
    
//         // // fake delay to simulate a time-consuming network request
//         // setTimeout( () => setData( newData ), 1500 );
//     // }

//     return (
//         <div id="scrollableDiv" style={{
//                 // width: width || "1000px", 
//                 height: height || "100vh", 
//                 overflowY: "scroll", 
//                 display: "flex", 
//                 flexDirection: "column-reverse", 
//                 margin: "auto"
//             }} className="bg-body-tertiary p-3">
//             <InfiniteScroll
//                 dataLength={ messages.length }
//                 next={fetchMore}
//                 hasMore={hasMore}
//                 loader={<p className="text-center m-5">⏳&nbsp;Loading...</p>}
//                 endMessage={<p className="text-center m-5">That&apos;s all folks!🐰🥕</p>}
//                 style={{ display: "flex", flexDirection: "column-reverse", overflow: "visible" }}
//                 scrollableTarget="scrollableDiv"
//                 inverse={true}
//                 >
//                 {
//                     messages.map( (message: AssetItem<I, O, M>) => (
//                         <div key={message.id}>
//                             <MessageCard 
//                                 message={message} 
//                                 messageComp={messageComp}
//                                 leftIconComp={leftIconComp}
//                                 role={isInputCheck(message) ? "input" : "output"}
//                             />
//                         </div>
//                     ))
//                 }
//             </InfiniteScroll>
//         </div>
//     )
// }