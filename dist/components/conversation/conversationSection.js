import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spinner } from "@heroui/react";
import { useConversationList, useCreateConversation } from "../../services/conversationService";
import { Listbox, ListboxItem } from "@heroui/react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCtx } from "../../providers/ctx-provider";
import { useConversationRouter } from "../../hooks/conversation-hook";
export default function ConversationSection() {
    // const { conversationId, setConversationId } = useStore()
    const { data: session, status } = useSession({
        required: false,
    });
    const { partitionId } = useCtx();
    const { items: conversations, isLoading, mutate,
    // trigger: triggerConversationList 
     } = useConversationList({ limit: 10, offset: 0 });
    const { trigger: createConversation, isMutating } = useCreateConversation();
    const { goToConversation } = useConversationRouter();
    const router = useRouter();
    if (isLoading) {
        return _jsx(Spinner, {});
    }
    return (_jsxs("div", { className: "w-full flex flex-col items-start justify-start gap-4", children: [_jsx("div", { className: "flex flex-row items-center justify-start px-2 pt-2 gap-6 w-full", children: _jsx("span", { className: "font-typography-base-primary font-semibold text-base leading-6 text-[#18181B]", children: "Previous Chats" }) }), conversations && status === "authenticated" && (_jsx(Listbox, { selectionMode: "single", selectedKeys: partitionId ? [partitionId] : [], children: conversations?.map((conv) => (_jsx(ListboxItem, { className: "w-full", onPress: () => goToConversation(conv.id), children: _jsx("h2", { className: `text-lg ${partitionId === conv.id ? "font-medium" : "font-light text-default-500"}`, children: conv.name }) }, conv.id))) }))] }));
}
//# sourceMappingURL=conversationSection.js.map