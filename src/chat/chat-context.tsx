import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { z } from "zod";
import createArtifactService, { BaseArtifactType } from "../model/services/artifact-service";
import { useHeadEnv, useVersionHead } from "../model/hooks/artifact-head-hooks";
import { useArtifactLayout } from "../hooks/layout-hook";
import { buildHeaders } from "../services/utils";



export interface ChatContextType<T> {
    messages: T[];
    loading: boolean;
    error: Error | null;
    sending: boolean;
    sendMessage: (message: T, fromMessageId?: string | null, sessionId?: string | null, files?: any) => Promise<void>;
    mutate: () => void;
}


export const createChatProvider = <T extends { content: string; role: string }>(messageName: string, messageSchema: z.ZodType<T>) => {
    
    const {
        ArtifactSchema: MessageArtifactSchema,
        useArtifactList: useMessageList,
        useArtifact: useMessage,
        useCreateArtifact: useCreateMessage,
        useUpdateArtifact: useUpdateMessage,
    } = createArtifactService(messageName, messageSchema)

    const ChatContext = createContext<ChatContextType<any>>({} as ChatContextType<any>);

    interface ChatProviderProps<T> {
        children: ReactNode;
        messageSchema: z.ZodType<T>;
    }

    function useSendMessage(currentData: T[], mutate: (key: string, data: any, options?: any) => Promise<any>) {
        const head = useVersionHead()
        // const { mutate } = useSWRConfig();
        const baseUrl = "/api/ai/chat"
        const model = "Message"
        const [sending, setSending] = useState(false);
    
        const { artifactView, setArtifactView } = useArtifactLayout()
    
        const sendMessage = useCallback(async (message: T, fromMessageId?: string | null, sessionId?: string | null, files?: any) => {
            try {
                setSending(true);
                const listKey = [`${baseUrl}/${model}/list`, 10, 0, head];
                // const currentData = await mutate(listKey);
                
                const mock_message = {
                    id: currentData && currentData.length > 0 ? currentData[0].id + 1 : 10000,
                    score: -1,
                    turn_id: currentData && currentData.length > 0 ? currentData[0].turn_id + 1 : 1,
                    created_at: new Date().toISOString(),
                    ...message,
                } as T & BaseArtifactType;
                
                const optimisticData = [mock_message, ...(currentData || [])];
                
                const sendMessageRequest = async (message: T, userContext: any, messageHistory: any[], files?: any) => {
                    const formData = new FormData();
                    formData.append("message_json", JSON.stringify(message));
                    formData.append("user_context_json", JSON.stringify(userContext));
                    if (files) {
                        formData.append('file', files);
                    }
                    
                    const headers = buildHeaders({
                        "partition_id": head.partitionId,
                        "branch_id": head.branchId,
                        "turn_id": head.turnId,
                        "from_message_id": fromMessageId,
                        "session_id": sessionId                        
                    })
                    
                    const res = await fetch(`/api/ai/chat`, {
                        method: "POST",
                        body: formData,
                        headers: headers,
                    });
                    if (res.ok) {
                        const responseMessages = await res.json();
                        console.log("### responseMessages", responseMessages)
                        for (const message of responseMessages) {
                            if (message.tool_calls.length > 0) {
                                for (const tool_call of message.tool_calls) {
                                    if (tool_call.name === "ChangeUserView"){
                                        console.log("### tool_call", tool_call)
                                        setArtifactView(tool_call.tool.view_name)
                                    }
                                }
                            }
                        }
                        return [...responseMessages, ...messageHistory];
                    } else {
                        throw new Error("Failed to send message.", { cause: res.statusText });
                    }
                };
                
                await mutate(
                    // listKey,
                    sendMessageRequest(
                        message, 
                        {
                            "artifact_view": artifactView
                        }, 
                        currentData || [], 
                        files
                    ),
                    {
                        optimisticData,
                        rollbackOnError: true,
                    }
                );
            } catch (error) {
                console.error(error);
            } finally {
                setSending(false);
            }
        }, [head, currentData, mutate]);
    
    
        return {
            sendMessage,
            sending
        }
    }
    

    function ChatProvider<T extends { content: string; role: string }>({ 
        children, 
        messageSchema, 
    }: ChatProviderProps<T>) {
        const [error, setError] = useState<Error | null>(null);

        const {
            data: messages,
            isLoading: loading,
            error: messagesError,
            mutate: mutateMessages
        } = useMessageList(1, undefined, 10, 0)

        const { sendMessage, sending } = useSendMessage(messages || [], mutateMessages)
        return (
            <ChatContext.Provider value={{
                messages,
                loading,
                error,
                sending,
                sendMessage,
                mutate: mutateMessages
            }}>
                {children}
            </ChatContext.Provider>
        );
    }

    function useChat<T>() {
        return useContext(ChatContext) as ChatContextType<T>;
    }



    return {
        ChatProvider,
        useChat,
        MessageArtifactSchema,
        useMessageList,
        useMessage,
        useCreateMessage,
        useUpdateMessage,        
    }
}