// import { MessageType, useChat } from "@/providers/chat-provider"
import InfiniteChat from "./infinite-chat"
import {
    cn,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../../providers/chat-provider";
import EmptyChatView from "./emptyChatView";
import {useConversation} from "../../services/conversationService"
import { useCtx } from "../../providers/ctx-provider";
import { Turn } from "./turn";
import { ChoiceType, MessageType, TurnType, useTurnApproval } from "../../services/turnService";
import StreamingSpanViewer from "./streamingSpan";
import { SpanType } from "./schema";
import { SpanContainer } from "../blocks/UserSpan";




// const registry = {
//     BlockChunk: DefaultText,
//     BlockSent: DefaultSentence,
//     Block: DefaultBlock,
//     button: DefaultButton, // tag-based
//     default: (b: any) => <div>Unknown block</div>,
// };



const AVATAR_TITLE: any = {
    atoz: { name: "Professor AtoZ", title: "The Educator" },
    connie: { name: "Connie Buyers", title: "The Real Estate Agent" },
    maximilian: { name: "Maximilian Roy", title: "The Deal Optimizer" },
    dean: { name: "Dean Simple", title: "The Deal Closer" },
};

function useIsLargeScreen() {
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        // Check initially
        checkScreenSize();

        // Add event listener
        window.addEventListener("resize", checkScreenSize);

        // Cleanup
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return isLargeScreen;
}

export default function ChatView() {
    // const { requestId: streamingRequestId } = useStream();

    const {partitionId} = useCtx()

    const {
        sendMessage,
        loading,
        sending,
        mutate: refetch,
        turns,
        fetchMore
    } = useChat()


    const ctx = useCtx()



    const { trigger: updateTurn } = useTurnApproval()

    const { data: conversation } = useConversation({id: ctx?.partitionId});

    // console.log("####turns", turns)

    if ((!partitionId || partitionId === "0") && turns.length == 0 && !loading) {
        return <EmptyChatView 
                    // backgroundImage="/modern-luxury-home-with-beautiful-landscape 2.svg" 
                    title={["ShippingToGo"]} 
                    companyName="ShippingToGo"
                    messages={[[
                                "Hey there",
                                "I am a shipping agent."
                            ], [
                                "what can I do for you today?"
                            ]]} 
                    />
    }


    // return (
    //     <UserComponentProvider registry={registry}>
    //             <StreamingSpanViewer key={`streaming-`} />
    //     </UserComponentProvider>
    // )

    return (
        <>
            {/* <UserComponentProvider registry={registry} > */}
                {/* <UserVisibilityProvider defaultVisibleTags={["answer", "user"]}>  */}
                    {/* <div className="flex justify-end"> */}
                    
                    <InfiniteChat
                        items={turns || []}
                        // height="750px"
                        gap="none"
                        loading={sending || loading}
                        fetchMore={fetchMore}
                        // emptyMessage={<EmptyChatView />}
                        endMessage={<div className="text-center text-sm"></div>}
                    >


                        {(turn, index, turns) => (
                            turn.span && <Turn
                                key={turn.id}
                                turn={turn as TurnType}
                                items={[turn.span]} // Pass the span as a single item
                                index={index}
                                showFooterControls={true}
                                nextTurn={turns[index + 1] as TurnType}
                                prevTurn={turns[index - 1] as TurnType}
                                branchId={turn.branchId}
                                setBranchId={() => { }}
                                sendMessage={sendMessage}
                                refetchChat={refetch}
                                className={cn({"pb-20": index === 0})}
                                handleApproval={async (status: "committed" | "reverted") => {
                                    const updatedTurn = await updateTurn({ id: turn.id, status })
                                    console.log("updatedTurn", updatedTurn)
                                    refetch()
                                    console.log("refetched")
                                }}
                            >
                                {(span: SpanType, index, spans) => {
 
                                    if (!span?.status) {
                                        throw new Error(`Span ${span.id} has no status`)
                                    }
                                    // const isStreaming = !turn.endedAt || span?.status === "running";
                                    const isStreaming = turn.status === "streaming";
                                    // console.log(`ChatBlockView(${turn.id}) isStreaming`, isStreaming)
                                    
                                    return isStreaming ? (
                                        <StreamingSpanViewer 
                                            key={`streaming-${index}`} 
                                            // requestId={streamingRequestId} 
                                        />
                                        ):( 
                                            <SpanContainer key={`user-span-${turn.id}-${index}`} span={span} />
                                        )
                                }}

                            </Turn>
                        )}

                    </InfiniteChat> 
        </>)            
}
