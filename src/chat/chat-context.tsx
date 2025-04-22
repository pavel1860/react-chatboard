import { createContext, useContext, ReactNode, useState, useCallback, useRef } from "react";
import { AnyZodObject, z } from "zod";
import createArtifactService, { BaseArtifactType } from "../model/services/artifact-service";
import { useVersionHead } from "../model/hooks/artifact-head-hooks";
import { buildHeaders } from "../services/utils";
import { VersionHead } from "../services/fetcher3";


export interface ToolCall {
    name: string;
    payload: any;
}


export interface ChatContextType<T> {
    messages: T[];
    loading: boolean;
    error: Error | null;
    sending: boolean;
    sendMessage: (message: T | string, toolCalls?: ToolCall[], state?: any, fromMessageId?: string | null, sessionId?: string | null, files?: any) => Promise<void>;
    mutate: () => void;
    useToolCall: (handlerFunc: (toolCall: ToolCall) => void) => void;
    branchId: number;
    setBranchId: (branchId: number) => void;
    turnId: number | undefined;
    setTurnId: (turnId: number) => void;
    partitionId: number | undefined;
    setPartitionId: (partitionId: number) => void;
}




export interface ChatOptions {
    completeUrl: string
}





export const createChatProvider = <T extends AnyZodObject>(
    messageName: string, 
    messageSchema: T, 
    // handler?: (
    //     toolCall: any, 
    // ) => void
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
    }

    function useSendMessage(
        history: T[], 
        mutate: (data: any, options?: any) => Promise<any>,
        head: VersionHead = {},
        options: ChatOptions = {
            completeUrl: "/api/ai/complete"
        }
    ) {
        // const head = useVersionHead()
        // const { mutate } = useSWRConfig();
        // const baseUrl = "/api/ai/chat"
        const model = "Message"
        const [sending, setSending] = useState(false);
        const handlerRef = useRef<((toolCall: ToolCall) => void) | undefined>(undefined)


    
        const sendMessage = useCallback(async (
            message: T | string, 
            toolCalls?: ToolCall[],
            state?: any,
            handler?: (toolCall: ToolCall) => void,
            fromMessageId?: string | null, 
            sessionId?: string | null,
            files?: any
        ) => {
            try {
                setSending(true);
                

                const build_mock_message = (message: T | string) => {
                    let msg = {
                        // @ts-ignore
                            id: history && history.length > 0 ? history[0].id + 1 : 10000,
                            content: message,
                            role: "user",
                            choices: [],
                            tool_calls: [],
                            run_id: null,
                            score: -1,
                            // @ts-ignore
                            turn_id: history && history.length > 0 ? history[0].turn_id + 1 : 1,
                            // created_at: new Date().toISOString(),
                        }
                    if (typeof message === "string") {
                        msg.content = message
                    } else {
                        msg = {...msg, ...message}
                    }
                    return msg as T & BaseArtifactType;
                }

                const mock_message = build_mock_message(message)                
                
                const optimisticData = [mock_message, ...(history || [])];
                
                const sendMessageRequest = async (message: T, state: any, messageHistory: any[], files?: any) => {
                    const formData = new FormData();
                    formData.append("message_json", JSON.stringify(message));
                    formData.append("state_json", JSON.stringify(state || {}));
                    formData.append("tool_calls_json", JSON.stringify(toolCalls || []))
                    
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
                                    // handler && handler(tool_call)
                                    handlerRef.current && handlerRef.current(tool_call)
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
                        mock_message, 
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
            sending,
            registerHandler: (handler: (toolCall: ToolCall) => void) => {
                handlerRef.current = handler
            }
        }
    }
    

    function ChatProvider<T>({ 
        children,  
    }: ChatProviderProps<T>) {

        const [branchId, setBranchId] = useState<number>(1)
        const [turnId, setTurnId] = useState<number | undefined>(undefined)
        const [partitionId, setPartitionId] = useState<number | undefined>(undefined)

        const {
            data: messages,
            isLoading: loading,
            error: messagesError,
            mutate: mutateMessages
        } = useMessageList(branchId, turnId, partitionId)

        const { sendMessage, sending, registerHandler } = useSendMessage(messages || [] as any, mutateMessages, {
            branchId,
            turnId,
            partitionId,
        })


        const useToolCall = useCallback((handlerFunc: (toolCall: ToolCall) => void) => {
            registerHandler(handlerFunc)
        }, [registerHandler])

        return (
            <ChatContext.Provider value={{
                messages: messages || [],
                loading,
                error: messagesError,
                sending,
                sendMessage,
                useToolCall,
                mutate: mutateMessages,
                branchId,
                setBranchId,
                turnId,
                setTurnId,
                partitionId,
                setPartitionId,
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