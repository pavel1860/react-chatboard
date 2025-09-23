import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-nocheck
// import { MessageType, useChat } from "@/providers/chat-provider"
import { Message } from "./message";
import InfiniteChat from "./infinite-chat";
import { cn, } from "@heroui/react";
import { useEffect, useState } from "react";
import { useBotState } from "@/hooks/use-bot-state";
import { useChat } from "../../providers/chat-provider";
import EmptyChatView from "./emptyChatView";
import { useConversation } from "../../services/conversationService";
import { useCtx } from "../../providers/ctx-provider";
import { Turn } from "./turn";
import { useTurnApproval } from "../../services/turnService";
import { StreamingContent } from "./streamingContent";
const AVATAR_TITLE = {
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
    const state = useBotState();
    const { partitionId } = useCtx();
    const { sendMessage, loading, sending, mutate: refetch, turns, fetchMore } = useChat();
    const ctx = useCtx();
    const { trigger: updateTurn } = useTurnApproval();
    const { data: conversation } = useConversation({ id: ctx?.partitionId });
    if ((!partitionId) && turns.length == 0 && !loading) {
        return _jsx(EmptyChatView
        // backgroundImage="/modern-luxury-home-with-beautiful-landscape 2.svg" 
        , { 
            // backgroundImage="/modern-luxury-home-with-beautiful-landscape 2.svg" 
            title: ["ShippingToGo"], companyName: "ShippingToGo", messages: [[
                    "Hey there",
                    "I am a shipping agent."
                ], [
                    "what can I do for you today?"
                ]] });
    }
    return (_jsx(_Fragment, { children: _jsx(InfiniteChat, { items: turns || [], 
            // height="750px"
            gap: "none", loading: sending || loading, fetchMore: fetchMore, 
            // emptyMessage={<EmptyChatView />}
            endMessage: _jsx("div", { className: "text-center text-sm" }), children: (turn, index, turns) => (_jsx(Turn, { turn: turn, items: turn.messages, index: index, nextTurn: turns[index + 1], prevTurn: turns[index - 1], branchId: turn.branchId, setBranchId: () => { }, sendMessage: sendMessage, refetchChat: refetch, className: cn({ "pb-20": index === 0 }), handleApproval: async (status) => {
                    const updatedTurn = await updateTurn({ id: turn.id, status });
                    console.log("updatedTurn", updatedTurn);
                    refetch(undefined, { revalidate: true });
                    console.log("refetched");
                }, children: (message, index, messages) => (message.meta?.isStreaming ? _jsx(StreamingContent, {}) :
                    _jsx(Message, { message: message, index: index, showChoices: index == 0, avatar: conversation?.avatar, isStreaming: message.meta?.isStreaming, 
                        // isStreaming={message.role == "assistant" && index == 0}
                        onChoice: (choice) => {
                            sendMessage(choice.content, undefined, state);
                        } })) })) }) }));
    { /* </CardBody>
    <CardFooter className="flex justify-center max-w-3xl">
        <ChatInput
            bgColor="#F4F4F5"
            rows={isLargeScreen ? 2 : 1}
            borderColor="#E0E0E0"
            width={artifactView === undefined ? "100%" : "100%"}
            placeholder="What are you looking for today?"
            // onKeyPress={sendMessage}
            onSubmit={(text: string) => {
                sendMessage(text, undefined, state);
            }}
        />
    </CardFooter>
</Card> */
    }
    // )
}
//# sourceMappingURL=ChatView.js.map