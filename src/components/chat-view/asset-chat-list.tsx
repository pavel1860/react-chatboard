
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AssetCard } from "../assets/assetCard";
import { AssetItem } from "../../services/chatboard-service";


interface ChatListProps {
    assetList: AssetItem[]
}

export default function ChatList({assetList}: ChatListProps) {
    const [ data, setData ] = useState( assetList );
    const MAX_DATA = 1000;
    const hasMore = data.length < MAX_DATA;

    useEffect(()=>{
        setData(assetList)
    }, [assetList])

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
        <div id="scrollableDiv" style={{width: "1000px", height: "100vh", overflowY: "scroll", display: "flex", flexDirection: "column-reverse", margin: "auto"}} className="bg-body-tertiary p-3">
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
                    data.map( (asset: AssetItem) => (
                        <AssetCard asset={asset}/>
                    ))
                }
            </InfiniteScroll>
        </div>
    )
}