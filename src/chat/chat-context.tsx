import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { AnyZodObject, z } from "zod";
import createArtifactService, { BaseArtifactType } from "../model/services/artifact-service";
import { useVersionHead } from "../model/hooks/artifact-head-hooks";
import { buildHeaders } from "../services/utils";


export interface ToolCall {
    name: string;
    payload: any;
}


export interface ChatContextType<T> {
    messages: T[];
    loading: boolean;
    error: Error | null;
    sending: boolean;
    sendMessage: (message: T, toolCalls?: ToolCall[], state?: any, fromMessageId?: string | null, sessionId?: string | null, files?: any) => Promise<void>;
    mutate: () => void;
}




export interface ChatOptions {
    completeUrl: string
}


export const createChatProvider = <T extends AnyZodObject>(
    messageName: string, 
    messageSchema: T, 
    handler: (
        toolCall: any, 
    ) => void
) => {

    
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

    function useSendMessage(
        history: T[], 
        mutate: (data: any, options?: any) => Promise<any>,
        options: ChatOptions = {
            completeUrl: "/api/ai/complete"
        }
    ) {
        const head = useVersionHead()
        // const { mutate } = useSWRConfig();
        // const baseUrl = "/api/ai/chat"
        const model = "Message"
        const [sending, setSending] = useState(false);


    
        const sendMessage = useCallback(async (
            message: T, 
            toolCalls?: ToolCall[],
            state?: any,
            fromMessageId?: string | null, 
            sessionId?: string | null,
            files?: any) => {
            try {
                setSending(true);
                
                const mock_message = {
                    // @ts-ignore
                    id: history && history.length > 0 ? history[0].id + 1 : 10000,
                    score: -1,
                    // @ts-ignore
                    turn_id: history && history.length > 0 ? history[0].turn_id + 1 : 1,
                    created_at: new Date().toISOString(),
                    ...message,
                } as T & BaseArtifactType;
                
                const optimisticData = [mock_message, ...(history || [])];
                
                const sendMessageRequest = async (message: T, state: any, messageHistory: any[], files?: any) => {
                    const formData = new FormData();
                    formData.append("message_json", JSON.stringify(message));
                    formData.append("state_json", JSON.stringify(state || {}));
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
                    
                    const res = await fetch(options.completeUrl, {
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
                                    handler(tool_call)
                                    // if (tool_call.name === "ChangeUserView"){
                                    //     console.log("### tool_call", tool_call)
                                    //     setArtifactView(tool_call.tool.view_name)
                                    // }
                                }
                            }
                        }
                        return [...responseMessages, ...messageHistory];
                    } else {
                        throw new Error("Failed to send message.", { cause: res.statusText });
                    }
                };
                
                await mutate(
                    sendMessageRequest(
                        message, 
                        state, 
                        history || [], 
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
        }, [head, history, mutate]);
    
    
        return {
            sendMessage,
            sending
        }
    }
    

    function ChatProvider<T>({ 
        children, 
        messageSchema, 
    }: ChatProviderProps<T>) {

        const {
            data: messages,
            isLoading: loading,
            error: messagesError,
            mutate: mutateMessages
        } = useMessageList(1, undefined, 10, 0)

        const { sendMessage, sending } = useSendMessage(messages || [] as any, mutateMessages)
        return (
            <ChatContext.Provider value={{
                messages: messages || [],
                loading,
                error: messagesError,
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