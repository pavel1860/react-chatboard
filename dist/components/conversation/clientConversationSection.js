import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Switch, User } from "@heroui/react";
import { useConversationList, useCreateConversation } from "../../services/conversationService";
import { Listbox, ListboxItem } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useCtx } from "../../providers/ctx-provider";
import { useConversationRouter } from "../../hooks/conversation-hook";
import { Bot, User as UserIcon } from "lucide-react";
import { useUpdateUser } from "../../services/userService";
import { useState } from "react";
const AutoRespondSwitch = ({ conversation, refresh }) => {
    const clientUser = conversation.participants.find((participant) => participant.role === "client");
    const [isSelected, setIsSelected] = useState(clientUser?.autoRespond === "auto");
    console.log(">>>", clientUser);
    const { trigger: updateUser } = useUpdateUser(clientUser && { id: clientUser.id });
    // useEffect(()=>{
    //     const clientUser = conversation.participants.find((participant: any) => participant.role === "client")
    //     if (clientUser) {
    //         setIsSelected(clientUser.autoRespond === "auto")
    //     } else {
    //         setIsSelected(false)
    //     }
    // }, [conversation])
    return (_jsx("div", { onClick: (e) => e.stopPropagation(), children: _jsx(Switch, { isSelected: isSelected, color: "success", endContent: _jsx(UserIcon, {}), size: "sm", startContent: _jsx(Bot, {}), onValueChange: async (value) => {
                // if (!clientUser) {
                //     return
                // }
                setIsSelected(value);
                // await updateUser({
                //     auto_respond: value ? "auto" : "approve"
                // })
                // refresh()
            } }) }));
};
export default function ConversationSection() {
    // const { conversationId, setConversationId } = useStore()
    const { data: session, status } = useSession({
        required: false,
    });
    const { partitionId } = useCtx();
    const { items: conversations, isLoading, mutate,
    // trigger: triggerConversationList 
     } = useConversationList({
        limit: 10,
        offset: 0,
        filters: ["platform", "==", "whatsapp"]
    });
    const { trigger: createConversation, isMutating } = useCreateConversation();
    const { goToConversation } = useConversationRouter();
    // if (isLoading) {
    //     return <Spinner />
    // }
    return (_jsxs("div", { className: "w-full flex flex-col items-start justify-start gap-4", children: [_jsx("div", { className: "flex flex-row items-center justify-start px-2 pt-2 gap-6 w-full", children: _jsx("span", { className: "font-typography-base-primary font-semibold text-base leading-6 text-[#18181B]", children: "Whatsapp Conversations" }) }), conversations && status === "authenticated" && (_jsx(Listbox, { selectionMode: "none", selectionBehavior: "replace", selectedKeys: partitionId ? [partitionId] : [], children: conversations?.map((conv) => {
                    const clientUser = conv.participants?.[0];
                    const turn = conv.turns?.[0];
                    let lastMessageContent = conv.name;
                    if (turn) {
                        const lastMessage = turn.messages?.[0];
                        if (lastMessage) {
                            lastMessageContent = lastMessage.content;
                        }
                    }
                    return (_jsx(ListboxItem, { className: "w-full", onPress: () => goToConversation(conv.id), children: _jsxs("div", { className: "flex flex-row items-center justify-between w-full", children: [_jsx(User, { name: clientUser?.name || "Unknown", description: lastMessageContent, avatarProps: {
                                        src: clientUser?.image,
                                    } }), _jsx(AutoRespondSwitch, { conversation: conv, refresh: mutate })] }) }, conv.id));
                }) }))] }));
}
//# sourceMappingURL=clientConversationSection.js.map