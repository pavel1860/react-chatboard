//@ts-ignore
export const createChatSlice = (set, get) => ({
    messages: [],
    loading: false,
    error: null,
    limit: 10,
    sending: false,
    setSending: (sending) => {
        set({ sending }, undefined, "setSending");
    },
    setMessages: (messages) => {
        return set({ messages }, undefined, "setMessages");
    },
});
//# sourceMappingURL=chat-slice.js.map