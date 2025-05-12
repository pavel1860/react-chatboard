import { createContext, useContext, ReactNode, useState, useCallback, useRef } from "react";
import { AnyZodObject, z, ZodSchema } from "zod";
// import createArtifactService, { BaseArtifactType } from "../model/services/artifact-service";
import createModelService from "../model/services/model-service2";
import { buildHeaders } from "../services/utils";
import { buildModelContextHeaders, convertKeysToSnakeCase } from "../model/services/model-context";



export interface ToolCall {
    name: string;
    payload: any;
}


export interface ChatContextType<Ctx, T> {
    messages: T[];
    loading: boolean;
    error: Error | null;
    sending: boolean;
    sendMessage: (
        content: string, 
        toolCalls?: ToolCall[], 
        state?: any, 
        fromMessageId?: string | null, 
        sessionId?: string | null, 
        files?: any
    ) => Promise<void>;
    mutate: () => void;
    useToolCall: (handlerFunc: (toolCall: ToolCall) => void) => void;
    ctx: Ctx;
    setCtx: (ctx: Ctx) => void;
}




export interface ChatOptions {
    completeUrl: string
}





export const createChatProvider = <ID, Ctx, Payload, Message>(
    messageName: string, 
    messageSchema: ZodSchema<Message>,
    defualtCtx: Ctx       
    // handler?: (
    //     toolCall: any, 
    // ) => void
) => {

    
    const {
        useModelList: useMessageList,
        useModel: useMessage,
        useCreateModel: useCreateMessage,
        useUpdateModel: useUpdateMessage,
    } = createModelService<ID, Ctx, Payload, Message>(messageName, messageSchema)

    const ChatContext = createContext<ChatContextType<Ctx, Message>>({} as ChatContextType<Ctx, Message>);

    interface ChatProviderProps<Message> {
        children: ReactNode;
        defaultCtx: Ctx;
    }

    function useSendMessage(
        history: Message[], 
        mutate: (data: any, options?: any) => Promise<any>,
        ctx: Ctx,
        options: ChatOptions = {
            completeUrl: "/api/ai/complete"
        }
    ) {

        const [sending, setSending] = useState(false);
        const handlerRef = useRef<((toolCall: ToolCall) => void) | undefined>(undefined)


    
        const sendMessage = useCallback(async (
            content: string, 
            toolCalls?: ToolCall[],
            state?: any,
            fromMessageId?: string | null, 
            sessionId?: string | null,
            files?: any
        ) => {
            try {
                setSending(true);
                
                const message = {
                    content: content,
                    choices: [],
                    state: state,
                    role: "user",
                    toolCalls: toolCalls,
                    runId: null,
                }

                const messageMock = {
                    ...message,
                    id: history && history.length > 0 ? history[0].id + 1 : 10000,
                    turnId: history && history.length > 0 ? history[0].turnId + 1 : 1,
                    createdAt: new Date().toISOString(),
                }
                const optimisticData = [messageMock, ...(history || [])];
                
                const sendMessageRequest = async (message: Payload, messageHistory: any[], files?: any) => {
                    const formData = new FormData();
                    formData.append("message", JSON.stringify(convertKeysToSnakeCase(message)));                    
                    if (files) {
                        formData.append('file', files);
                    }                    
                    const headers = buildModelContextHeaders<Ctx>(ctx)
                    
                    const res = await fetch(options.completeUrl, {
                        method: "POST",
                        body: formData,
                        headers: headers,
                    });
                    if (res.ok) {
                        const responseMessages = await res.json();
                        // console.log("### responseMessages", responseMessages)
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
                        message, 
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
        }, [ctx, history, mutate]);
    
    
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
        defaultCtx 
    }: ChatProviderProps<T>) {

        const [ctx, setCtx] = useState<Ctx>(defaultCtx as Ctx)

        const {
            data: messages,
            isLoading: loading,
            error: messagesError,
            mutate: mutateMessages
        } = useMessageList<Ctx, Message>(ctx)

        const { sendMessage, sending, registerHandler } = useSendMessage(messages || [] as any, mutateMessages, ctx)

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
                ctx,
                setCtx,
            }}>
                {children}
            </ChatContext.Provider>
        );
    }

    function useChat<Ctx, Message>() {
        return useContext(ChatContext) as ChatContextType<Ctx, Message>;
    }



    return {
        ChatProvider,
        useChat,
        useMessageList,
        useMessage,
        useCreateMessage,
        useUpdateMessage,        
    }
}

