import { Role, useChatEndpoint } from "../services/chatbot-service";
import React, { useCallback, useEffect } from "react";
const optimisticMessage = (content, phoneNumber) => {
    return {
        id: "temp-id",
        input: "",
        output: content,
        metadata: {
            prompt: undefined,
            role: Role.CLIENT,
            run_id: undefined,
            phone_number: phoneNumber,
            manager_phone_number: ""
        },
        asset_input_date: undefined,
        asset_output_date: new Date().toISOString(),
        asset_update_ts: Date.now()
    };
};
export const useChatBot = (selectedPhoneNumber) => {
    const [limit, setLimit] = React.useState(10);
    const [offset, setOffset] = React.useState(0);
    const [sending, setSending] = React.useState(false);
    const { data, mutate, error, isLoading, size, setSize, refetch } = useChatEndpoint(selectedPhoneNumber, limit);
    const dataRef = React.useRef(data);
    const fetchMore = () => {
        //@ts-ignore
        setSize(size => size + 1);
    };
    useEffect(() => {
        dataRef.current = data;
    }, [data]);
    const sendMessageRequest = async (content, data, fromMessageId) => {
        console.log("################ content", content);
        if (!content) {
            throw new Error("Message content is empty.");
        }
        const res = await fetch(`/api/debug/${selectedPhoneNumber}/chat`, {
            method: "POST",
            body: JSON.stringify({ content, fromMessageId }),
            // body: { content: content },
            headers: {
                "Content-Type": "application/json"
            }
        });
        const msg = await res.json();
        if (res.ok) {
            const newThread = [...msg, ...data];
            console.log("######new thread", newThread);
            return newThread;
        }
        else {
            throw new Error("Failed to send message.");
        }
    };
    const deleteMessageRequest = async (id, data) => {
        const res = await fetch(`/api/debug/${selectedPhoneNumber}/chat/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.ok) {
            return data.filter((msg) => msg.id !== id);
        }
        else {
            throw new Error("Failed to delete message.");
        }
    };
    const filterMessagesFromId = (data, fromMessageId) => {
        const index = data.findIndex((msg) => msg.id === fromMessageId);
        return data.slice(index);
    };
    const sendMessage = useCallback(async (content, fromMessageId) => {
        try {
            if (!selectedPhoneNumber) {
                return;
            }
            setSending(true);
            console.log("#### curr", dataRef.current);
            const oldData = [...dataRef.current];
            const optimisticData = [optimisticMessage(content.text, selectedPhoneNumber), ...(fromMessageId ? filterMessagesFromId(oldData, fromMessageId) : oldData)];
            await mutate(sendMessageRequest(content.text, oldData, fromMessageId), {
                optimisticData: optimisticData,
            });
            setSending(false);
        }
        catch (error) {
            console.error(error);
            setSending(false);
        }
    }, [data, selectedPhoneNumber]);
    const deleteMessage = useCallback(async (id) => {
        try {
            if (!selectedPhoneNumber) {
                return;
            }
            setSending(true);
            const oldData = [...dataRef.current];
            await mutate(deleteMessageRequest(id, oldData), {
                optimisticData: oldData.filter((msg) => msg.id !== id),
            });
            setSending(false);
        }
        catch (error) {
            console.error(error);
            setSending(false);
        }
    }, [data, selectedPhoneNumber]);
    return {
        messages: data || [],
        loading: isLoading,
        sending: sending,
        error: error,
        sendMessage,
        deleteMessage,
        fetchMore,
        refetch,
        setLimit: setLimit,
        setOffset: setOffset,
    };
};
//# sourceMappingURL=chatbot-hook.js.map