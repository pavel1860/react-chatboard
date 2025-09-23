import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// import { MessageType, useChat } from "@/providers/chat-provider"
import InfiniteChat from "./infinite-chat";
import { Button, cn, } from "@heroui/react";
import { useEffect, useState } from "react";
import { useChat } from "../../providers/chat-provider";
import EmptyChatView from "./emptyChatView";
import { useConversation } from "../../services/conversationService";
import { useCtx } from "../../providers/ctx-provider";
import { Turn } from "./turn";
import { useTurnApproval } from "../../services/turnService";
import StreamingSpanViewer from "./streamingSpan";
import { Icon } from "@iconify-icon/react";
import { SpanContainer } from "../blocks/UserSpan";
import { EvaluatorsWrapper, TestCheckbox, useTestSelection } from "../evaluation/evaluators";
import { useStore } from "../../store/useStore";
// const registry = {
//     BlockChunk: DefaultText,
//     BlockSent: DefaultSentence,
//     Block: DefaultBlock,
//     button: DefaultButton, // tag-based
//     default: (b: any) => <div>Unknown block</div>,
// };
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
    // const { requestId: streamingRequestId } = useStream();
    const { partitionId } = useCtx();
    const { sendMessage, loading, sending, mutate: refetch, turns, fetchMore } = useChat();
    const ctx = useCtx();
    const [showSelection, setShowSelection] = useState(false);
    const { testTurns, addTestTurn, removeTestTurn } = useStore();
    const { selectedTurns, selectForTest, deselectForTest, isTestMode } = useTestSelection(turns);
    const { trigger: updateTurn } = useTurnApproval();
    const { data: conversation } = useConversation({ id: ctx?.partitionId });
    // console.log("####turns", turns)
    if ((!partitionId || partitionId === "0") && turns.length == 0 && !loading) {
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
    // return (
    //     <UserComponentProvider registry={registry}>
    //             <StreamingSpanViewer key={`streaming-`} />
    //     </UserComponentProvider>
    // )
    return (_jsx(_Fragment, { children: _jsx(InfiniteChat, { items: turns || [], 
            // height="750px"
            gap: "none", loading: sending || loading, fetchMore: fetchMore, 
            // emptyMessage={<EmptyChatView />}
            endMessage: _jsx("div", { className: "text-center text-sm" }), children: (turn, index, turns, nextTurn, prevTurn, isLast) => (turn.span && _jsx(Turn, { turn: turn, items: [turn.span], index: index, showFooterControls: true, nextTurn: turns[index + 1], prevTurn: turns[index - 1], branchId: turn.branchId, setBranchId: () => { }, sendMessage: sendMessage, refetchChat: refetch, showSideControls: true, className: cn({ "pb-20": index === 0 }), handleApproval: async (status) => {
                    const updatedTurn = await updateTurn({ id: turn.id, status });
                    console.log("updatedTurn", updatedTurn);
                    refetch();
                    console.log("refetched");
                }, rightContent: _jsxs(_Fragment, { children: [!isTestMode && _jsx(Button, { isIconOnly: true, variant: "light", onPress: () => {
                                if (prevTurn) {
                                    // sendMessage(turn.messages[0].content, turn.messages[0].toolCalls, turn.messages[0].state, prevTurn.id, true)
                                }
                            }, children: _jsx(Icon, { icon: "mdi:refresh" }) }), isTestMode && _jsx(TestCheckbox, { isSelected: selectedTurns[turn.id], onSelectChange: (isSelected) => {
                                if (isSelected) {
                                    selectForTest(turn);
                                }
                                else {
                                    deselectForTest(turn);
                                }
                            } })] }), evaluators: _jsx(EvaluatorsWrapper, { turnId: turn.id }), children: (span, index, spans) => {
                    if (!span?.status) {
                        throw new Error(`Span ${span.id} has no status`);
                    }
                    // const isStreaming = !turn.endedAt || span?.status === "running";
                    const isStreaming = turn.status === "streaming";
                    // console.log(`ChatBlockView(${turn.id}) isStreaming`, isStreaming)
                    return isStreaming ? (_jsx(StreamingSpanViewer, {}, `streaming-${index}`)) : (_jsx(SpanContainer, { span: span }, `user-span-${turn.id}-${index}`));
                } }, turn.id)) }) }));
}
//# sourceMappingURL=ChatBlockView.js.map