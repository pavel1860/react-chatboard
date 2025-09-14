import { useStore } from "../store/useStore";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "../model/services/model-context";
import { Ctx, useCtx } from "../providers/ctx-provider";
import { MessagePayloadType, MessageType, TurnType, useTurnMessages, useTurnBlocks } from "../services/turnService";
import { ToolCall } from "../components/chat/schema";
import { buildNestedUrl } from "../hooks/modelHooks";
import { useStream, useStreamStore } from "../services/streamStore";
import { useSession } from "next-auth/react";





function uuidv4() {
    return 'temp-uuid-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}




export interface ChatContextType {
    turns: TurnType[];
    fetchMore: () => void;
    loading: boolean;
    // initialized: boolean;
    error: Error | null;
    sending: boolean;
    sendMessage: (
        content: string,
        toolCalls?: ToolCall[],
        state?: any,
        fromTurnId?: number | null,
        addBranch?: boolean,
        files?: any,
        role?: string
    ) => Promise<void>;
    mutate: () => void;
    // useToolCall: (handlerFunc: (toolCall: ToolCall) => void) => void;
    // ctx: ArtifactCtxType;
    // setCtx: (branchId: number, conversationId: number) => void;
}


function findObjectIndexById(arr: any[], id: number) {
    for (let row = 0; row < arr.length; row++) {
        for (let col = 0; col < arr[row].length; col++) {
            if (arr[row][col].id === id) {
                return [row, col]; // return as [rowIndex, colIndex]
            }
        }
    }
    return null; // not found
}


function getItemsRelativeToIndex(arr: any[], row: number, col: number, mode = 'after', includeSelf = false) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            const isBefore = (i < row) || (i === row && j < col);
            const isAfter = (i > row) || (i === row && j > col);
            const isSelf = (i === row && j === col);

            if (mode === 'before' && (isBefore || (includeSelf && isSelf))) {
                result.push(arr[i][j]);
            }
            if (mode === 'after' && (isAfter || (includeSelf && isSelf))) {
                result.push(arr[i][j]);
            }
        }
    }
    return result;
}


function buildRequest(message: MessagePayloadType, addBranch: boolean | undefined, fromTurnId: number | null | undefined, files: any, ctx: Ctx) {
    const formData = new FormData();
    formData.append("message", JSON.stringify(convertKeysToSnakeCase(message)));
    formData.append("config", JSON.stringify(convertKeysToSnakeCase({
        addBranch: addBranch,
        fromTurnId: fromTurnId,        
    })));

    if (files) {
        formData.append('file', files);
    }
    if (!ctx.partitionId) {
        throw new Error("Partition ID is required");
    }
    const urlParams = new URLSearchParams()
    if (ctx) {
        Object.entries(ctx)
            .filter(([_, value]) => value != null)
            .forEach(([key, value]) => {
                urlParams.set("ctx." + key, String(value));
            });
    }

    return {
        formData,
        urlParams,
    }
}



interface MessageStatus {
    isStreaming?: boolean
}


const buildMessage = (message?: Partial<MessageType>, isStreaming: boolean=false): (MessageType & MessageStatus) => ({
    meta: {
        isStreaming: isStreaming,
    },
    id: 0,
    branchId: 0,
    // createdAt: new Date().toISOString(),
    turnId: 0,    
    content: "",
    choices: {
        task: null,
        choices: [],
    },
    state: {},
    role: "assistant",
    toolCalls: [],
    runId: null,
    ...message
})



function buildOptimisticTurn<T extends TurnType>(
    history: T[],
    content: string,
    state: any,
    toolCalls: ToolCall[] | undefined,
    fromTurnId: number | null | undefined,
    role: "user" | "assistant" | "tool",
) {
    const message = {
        content: content,
        choices: undefined,
        state: state,
        role: role,
        toolCalls: toolCalls,
        runId: null,
    }


    if (fromTurnId) {
        const pos = findObjectIndexById(history, fromTurnId)
        if (pos) {
            history = getItemsRelativeToIndex(history, pos[0], pos[1], 'after', true)
        }

    }

    const turnId = history && history.length > 0 && history[0].length > 0 ? history[0][0].id + 1 : 10000

    // const messageMock = {
    //     ...message,
    //     id: history && history.length > 0 ? history[0].id + 1 : 10000,
    //     createdAt: new Date().toISOString(),
    //     turnId: turnId,
    // }

    const messageMock = buildMessage(message)
    

    const turnMock = {
        messages: [messageMock],
        id: turnId,
        createdAt: new Date().toISOString(),
        status: "streaming",
        endedAt: undefined,
        forkedBranches: [],
        span: {
            id: "fake-span-id",
            name: "streaming-span",
            parentSpanId: undefined,
            turnId: turnId,
            branchId: undefined,
            startTime: new Date().toISOString(),
            endTime: undefined,
            metadata: {},
            status: "streaming",
        },
    }
    return {
        message,
        // optimisticData: [turnMock, ...(history || [])]
        history: [...(history || [])],
        turn: turnMock
    }
}


async function sendRequest(url: string, formData: FormData) {
    const res = await fetch(url, {
        method: "POST",
        body: formData,
        // headers: headers,
    });
    if (res.ok) {
        const response = await res.json();

        // const responseMessages = response.messages.map((m: any) => MessageSchema.parse(convertKeysToCamelCase(m)))
        const responseTurn = convertKeysToCamelCase(response.turn)
        return { response: responseTurn, events: response.events }
    } else {
        throw new Error("Failed to send message.", { cause: res.statusText });
    }
}

export interface ChatOptions {
    completeUrl: string
}


function useSendMessage(
    history: TurnType[],
    mutate: (data?: any, options?: any) => Promise<any>,
    ctx: Ctx,
    setBranchId: (branchId: number) => void,
    onEvent?: (event: any) => void,
    options: ChatOptions = {
        completeUrl: "/api/ai/complete"
    }
) {

    const { data: session } = useSession()

    const [sending, setSending] = useState(false);
    const handlerRef = useRef<((toolCall: ToolCall) => void) | undefined>(undefined)

    const { startStream, isStreaming, clearStream } = useStreamStore();


    const historyRef = useRef<TurnType[]>(history)

    useEffect(() => {
        historyRef.current = history
    }, [history])





    // const sendMessage = useCallback(async (
    //     content: string,
    //     toolCalls?: ToolCall[],
    //     state?: any,
    //     fromTurnId?: number | null,
    //     addBranch?: boolean,
    //     files?: any,
    //     role: string = "user"
    // ) => {
    //     try {
    //         if (sending) {
    //             return;
    //         }
    //         setSending(true);

    //         const { message, optimisticData } = buildMessage(history, content, state, toolCalls, fromTurnId, role)

    //         const sendMessageRequest = async (message: MessagePayloadType, messageHistory: TurnType[], files?: any) => {
    //             const { formData, urlParams } = buildRequest(message, addBranch, fromTurnId, files, ctx)
    //             // const url = `${options.completeUrl}?${urlParams.toString()}`
    //             const url = buildNestedUrl(options.completeUrl, {
    //                 ctx: convertKeysToSnakeCase(ctx),
    //             })
    //             const { response, events } = await sendRequest(url, formData)
    //             for (const event of events) {
    //                 onEvent && onEvent(event)
    //             }
    //             if (ctx.branchId !== response.branchId) {
    //                 setBranchId(response.branchId)
    //             }
    //             return [response, ...messageHistory];
    //         };


    //         await mutate(
    //             sendMessageRequest(
    //                 // @ts-ignore
    //                 message,
    //                 history || [],
    //                 files
    //             ),
    //             {
    //                 optimisticData,
    //                 rollbackOnError: true,
    //                 populateCache: true,
    //                 revalidate: false
    //             }
    //         );
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setSending(false);
    //     }
    // }, [ctx, history, mutate, sending]);
    const sendMessage = useCallback(
        async (
            content: string,
            toolCalls?: ToolCall[],
            state?: any,
            fromTurnId?: number | null,
            addBranch?: boolean,
            files?: any,
            role: string = "user"
        ) => {
            if (sending) return;
            setSending(true);

            try {

                if (isStreaming) {
                    return;
                }
                clearStream();


                if (!session?.user?.id) {
                    throw new Error("User ID is required");
                }

                const { message, turn, history: mockHistory } = buildOptimisticTurn(history, content, state, toolCalls, fromTurnId, role)

                const { formData, urlParams } = buildRequest(message, addBranch, fromTurnId, files, ctx)

                // const url = buildNestedUrl(options.completeUrl, {
                //     ctx: convertKeysToSnakeCase(ctx),
                // })
                const baseUrl = process.env.NEXT_PUBLIC_BOT_API_BASE_URL

                const url = buildNestedUrl(`${baseUrl}/api/complete`, {
                    ctx: convertKeysToSnakeCase(ctx),
                })


                // historyRef.current = [[turn], ...mockHistory]


                // await mutate(
                //     [[turn], ...mockHistory],
                //     {
                //         rollbackOnError: true,
                //         populateCache: true,
                //         revalidate: false,
                //     }
                // );

                // startStream({ url, formData, userId: session.user.auth_user_id.toString()})

                const callStartStream = async (url: string, formData: FormData, userId: string) =>{
                    const res = await startStream({ url, formData, userId})                    
                    return [...mockHistory]
                }

                await mutate(
                    callStartStream(url, formData, session.user.auth_user_id.toString()),
                    {
                        optimisticData: [[turn], ...mockHistory],
                        rollbackOnError: true,
                        populateCache: true,
                        revalidate: false,
                    }
                );

                

            } catch (error) {
                console.error("Send message error", error);
            } finally {
                setSending(false);
                mutate()
            }
        },
        [sending, ctx, history, mutate, session]
    );





    return {
        sendMessage,
        sending: isStreaming,
        registerHandler: (handler: (toolCall: ToolCall) => void) => {
            handlerRef.current = handler
        }
    }
}





const ChatContext = createContext<ChatContextType | undefined>(undefined)



const useHistory = (partitionId: string | undefined, branchId: number, pendingMessage: MessageType | undefined) => {
    const { events, pullEvents, consumed } = useStream();

    
    const optimisticDataRef = useRef<TurnType | undefined>(undefined)

    // const {
    //     data,
    //     items: turns,
    //     isLoading: loading,
    //     error,
    //     mutate,
    //     setSize,
    //     size,
    // } = useTurnMessages({
    //     limit: 10,
    // }, { keepPreviousData: !pendingMessage && !!partitionId, isDisabled: !partitionId })

    const {
        data,
        items: turns,
        isLoading: loading,
        error,
        mutate,
        setSize,
        size,
    } = useTurnBlocks({
        limit: 10,
    }, { 
        keepPreviousData: !pendingMessage && !!partitionId, 
        isDisabled: !partitionId, 
        // lazy: true 
    })


    


    const dataRef = useRef<TurnType[]>(data || [])

    useEffect(()=>{
        dataRef.current = data
    }, [data])




    useEffect(() => {
        const newEvents = pullEvents();
        if (newEvents.length === 0 || !dataRef.current) return;
        let needToMutate = false; 
        let needToRefetch = false;     
        for (const event of newEvents) {
            // if (event.type === "user_message") {
            //     const [turnHistory, ...mockHistory] = dataRef.current
            //     const turn = turnHistory[0]
            //     const turnUpdated = {...turn, messages: [event.payload]}
            //     dataRef.current = [[turnUpdated], ...mockHistory]
            //     needToMutate = true;

            // } else if (event.type === "stream_start") {
            //     const [turnHistory, ...mockHistory] = dataRef.current
            //     const turn = turnHistory[0]
            //     const assistantMessage = buildMessage({
            //         id: 0,
            //         role: "assistant",
            //     }, true)
            //     // console.log("assistant message", assistantMessage)
            //     const turnUpdated = {...turn, messages: [...turn.messages,  assistantMessage]}
            //     // console.log("turn updated", turnUpdated)
            //     // console.log("new history", [[turnUpdated], ...mockHistory])
            //     dataRef.current = [[turnUpdated], ...mockHistory]
            //     needToMutate = true;
            // } else if (event.type === "assistant_message") {
            //     needToRefetch = true;
            // }
        }
        // if (needToMutate) {
        //     mutate(
        //         dataRef.current,
        //         {
        //             rollbackOnError: true,
        //             populateCache: true,
        //             revalidate: false,
        //         }
        //     );
        // }
        // if (needToRefetch) {
        //     mutate()
        // }
        consumed(newEvents)
    }, [events, mutate])
    


    return {
        data,
        items: turns,
        isLoading: loading,
        error,
        mutate,
        setSize,
        size,
    }
}


function ChatProvider({ children }: { children: React.ReactNode }) {

    const currSize = useRef(1)


    const {
        partitionId,
        setConversationId,
        branchId,
        setBranchId,
    } = useCtx()


    const {
        stateUpdateMessageId,
        setStateUpdateMessageId,
        pendingMessage,
        setPendingMessage,
        artifactView,
        setArtifactView,
        filters,
        setFilters,
        handleSearchQuery,
        setIsArtifactViewOpen,
        isArtifactViewOpen,
    } = useStore()

    const [isSending, setIsSending] = useState(false)

    // const {
    //     data,
    //     items: turns,
    //     isLoading: loading,
    //     error: messagesError,
    //     mutate: mutateMessages,
    //     setSize,
    //     size,
    // } = useTurnMessages({
    //     limit: 10,
    // }, { keepPreviousData: !pendingMessage && !!partitionId, isDisabled: !partitionId })
    const { 
        data, 
        items: turns, 
        isLoading: loading, 
        error: messagesError, 
        mutate: mutateMessages, 
        setSize, 
        size 
    } = useHistory(partitionId, branchId, pendingMessage)

    const { sendMessage, sending, registerHandler } = useSendMessage(
        // turns || [] as any,
        data || [] as any,
        mutateMessages,
        {
            partitionId: partitionId,
            branchId: branchId,
        },
        setBranchId,
        (event) => {

        })


    
    useEffect(() => {
        setIsSending(sending)
    }, [sending])

    useEffect(() => {
        if (pendingMessage && partitionId == pendingMessage.conversationId) {
            sendMessage(pendingMessage.message.content, pendingMessage.message.toolCalls, pendingMessage.message.state)
            setPendingMessage(undefined)
        }
    }, [pendingMessage, partitionId, sendMessage])



    const fetchMore = useCallback(() => {
        currSize.current = currSize.current + 1
        setSize(currSize.current)
    }, [setSize])

    // useEffect(() => {
    //     if (turns && turns.length > 0) {
    //         const lastTurn = turns[0]
    //         const lastMessage = lastTurn.messages[lastTurn.messages.length - 1]

    //         if (lastMessage?.role === "assistant" && lastMessage?.state && lastMessage.id !== stateUpdateMessageId) {
    //             const { filters: stateFilters, artifactView: messageArtifactView } = lastMessage.state
    //             if (messageArtifactView !== artifactView) {
    //                 setArtifactView(messageArtifactView)
    //             }
    //             if (stateFilters) {
    //                 const filtersToSet: Partial<Filters> = {}
    //                 if (stateFilters.minPrice !== filters.minPrice) {
    //                     filtersToSet.minPrice = stateFilters.minPrice
    //                 }
    //                 if (stateFilters.maxPrice !== filters.maxPrice) {
    //                     filtersToSet.maxPrice = stateFilters.maxPrice
    //                 }
    //                 if (stateFilters.bedrooms !== filters.bedrooms) {
    //                     filtersToSet.bedrooms = stateFilters.bedrooms
    //                 }
    //                 if (stateFilters.bathrooms !== filters.bathrooms) {
    //                     filtersToSet.bathrooms = stateFilters.bathrooms
    //                 }
    //                 if (JSON.stringify(stateFilters.homeTypes) !== JSON.stringify(filters.homeTypes)) {
    //                     filtersToSet.homeTypes = stateFilters.homeTypes
    //                 }
    //                 if (stateFilters.location !== undefined) {
    //                     handleSearchQuery(stateFilters.location)
    //                 }
    //                 if (Object.keys(filtersToSet).length > 0) {
    //                     setFilters(filtersToSet)
    //                 }
    //             }
    //             if (messageArtifactView && !isArtifactViewOpen) {
    //                 setIsArtifactViewOpen(true)
    //             }
    //             setStateUpdateMessageId(lastMessage.id)
    //         }

    //     }
    // }, [turns, isArtifactViewOpen, setIsArtifactViewOpen])


    return (
        <ChatContext.Provider value={{
            turns: turns?.flat() || [],
            fetchMore,
            loading: loading,
            error: messagesError,
            sending,
            sendMessage,
            mutate: mutateMessages,
        }}>
            {children}
        </ChatContext.Provider>
    )
}



const useChat = () => {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider")
    }
    return context
}

export {
    ChatProvider,
    useChat,
}