import { useCallback, useState } from "react";
import createModelService from "../../services/model-service";
import { MessageBubble, MessageContent, MessageFooter, MessageText, MessageTime } from "./chat-message";
import InfiniteChat from "./infinite-chat"
import { z, ZodSchema } from "zod";
import { Button, Chip } from "@nextui-org/react";
import { ChatInput } from "../editor/input";
import { EditorValue } from "../editor/util";
import { useHeadEnv } from "../../hooks/artifact-log-hook";
import { useBranchFromTurn } from "../../services/artifact-log-service";




// export function createChatHook<T>(model: string, schema: ZodSchema<T>) {

//     const chatHookd

// }

// const BaseArtifact = z.object({
//     id: z.number(),
//     score: z.number(),
//     turn_id: z.number(),
//     created_at: z.string(),
//     // updated_at: z.string(),
// })



// const MessageSchema = BaseModel.extend({
//     content: z.string(),
//     role: z.enum(["user", "assistant"]),
// })
const MessageSchema = z.object({
    content: z.string(),
    role: z.enum(["user", "assistant"]),
})

// const MessageArtifactSchema = BaseArtifact.merge(MessageSchema)


type MessageType = z.infer<typeof MessageSchema>


function TurnChip({turn_id}: {turn_id: number}) {    
    const [isHovered, setIsHovered] = useState(false);
    const { trigger: branchFromTurn, data: branch, error: branchError, isMutating: branchLoading } = useBranchFromTurn()
    return (
        <div
                className="flex w-full items-center h-10"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}    
            >
            <span className="text-xs text-gray-500">End of Turn {turn_id}</span>
            <div className="mx-4">
                <Button
                    size="sm"
                    variant="light"
                    isDisabled={!isHovered}
                    onClick={() => branchFromTurn({turn_id})}
                >Branch from</Button>
            </div>
            </div>
    )
}


const {
    ModelArtifactSchema: MessageArtifactSchema,
    useGetModelList,
    useGetModel,
    useCreateModel,
    useUpdateModel,
} = createModelService<MessageType>("Message", MessageSchema, { isArtifact: true})

type MessageArtifactType = z.infer<typeof MessageArtifactSchema>


export const useChat = () => {

    const {
        data: messages,
        isLoading: messagesLoading,
        error: messagesError,
        mutate: mutateMessages
    } = useGetModelList(10, 0)
    
    const [extraMessages, setExtraMessages] = useState<MessageType[]>([])

    const env = useHeadEnv();
    
    const sendMessageRequest = async (message: MessageType, message_history: MessageType[], files?: any): Promise<MessageArtifactType[]> => {
        // const send_time = new Date().toISOString()
        // const mockFetch = async (message: MessageType, data: MessageType[], files?: any) => {
        //     return new Promise((resolve, reject) => {
        //         setTimeout(() => {
        //             const id = data && data.length > 0 ? (data[0] as any).id + 1 : 10000
        //             const turn_id = data && data.length > 0 ? (data[0] as any).turn_id + 1 : 1
        //             const response_time = new Date().toISOString()
        //             const user_message = {id: id, score: 0.9, turn_id: turn_id, created_at: send_time, ...message}
        //             const response = {id: id + 1, score: 0.9, turn_id: turn_id, created_at: response_time, content: "Hello", role: "assistant"}
        //             resolve([response, user_message])
        //         }, 1000)
        //     })
        // }
        // const response_messages = await mockFetch(message, data, files)
        // return [...response_messages, ...data]


        console.log("################ content", message)
        if (!message) {
            throw new Error("Message content is empty.");

        }

        const formData = new FormData();
        formData.append("message_json", JSON.stringify(message));        
        if (files) {
            formData.append('file', files); // Append the file only if it exists
        }
        const headers: any = {
            // "Content-Type": "multipart/form-data",
            "head_id": env.headId,            
        }
        if (env.branchId) {
            headers["branch_id"] = env.branchId;
        }
        const res = await fetch(`/api/ai/chat`, {
            method: "POST",
            body: formData,
            headers: headers,
        })        
        if (res.ok) {
            const response_messages = await res.json()
            const newThread = [...response_messages, ...message_history]
            console.log("######new thread", newThread)
            return newThread
        } else {
            throw new Error("Failed to send message.", { cause: res.statusText });

        }
    }  
    
    
    const sendMessage = useCallback(async (message: MessageType, fromMessageId?: string | null, sessionid?: string | null, files?: any) => {
        try {
            const mock_message: MessageArtifactType = {
                id: messages && messages.length > 0 ? (messages[0] as any).id + 1 : 10000,
                score: -1,
                turn_id: messages && messages.length > 0 ? (messages[0] as any).turn_id + 1 : 1,
                created_at: new Date().toISOString(),                
                ...message,
            }
            const optimisticData = [mock_message, ...messages]
            console.log("###### optimisticData", optimisticData)
            await mutateMessages(sendMessageRequest(message, messages, fromMessageId, sessionid, files), {
                optimisticData: optimisticData,
                rollbackOnError: true,
                // populateCache: true,
                // revalidate: false
            });
        } catch (error) {
            console.error(error)
        }
    }, [messages])

    return {
        messages,
        messagesLoading,
        messagesError,
        mutateMessages,
        extraMessages,
        sendMessage,
        addMessage: (messageList: MessageType[]) => {
            setExtraMessages([...messageList, ...extraMessages])
            setTimeout(() => {
                setExtraMessages([...messageList, ...extraMessages])
            }, 1000)
        }
    }
}

export default function ChatView() {

    const {
        messages,
        messagesLoading,
        messagesError,
        mutateMessages,
        extraMessages,
        addMessage,
        sendMessage
    } = useChat()

    return (

            
        <div className="sticky bottom-0">
            
            <InfiniteChat
                messages={messages || []}
                // messages={extraMessages || []}
                // height="86vh"
                height="800px"
                fetchMore={
                    () => {
                        // mutateMessages()
                    }
                }
            >
                {(message: MessageArtifactType, idx: number, prevMessage?: MessageArtifactType) => {
                    return (
                        <>
                        <MessageBubble role={message.role} assistantColor="#FFFFFF">
                            {/* <Chip color="primary">{message.id}</Chip> */}
                            <MessageContent>
                                {/* <MessageText text={message.content}/> */}
                                <div className="text-sm">{message.content}</div>
                            </MessageContent>
                            <MessageFooter>
                                <MessageTime time={message.created_at}/>
                            </MessageFooter>
                        </MessageBubble>
                        {prevMessage && prevMessage.turn_id !== message.turn_id && <TurnChip turn_id={message.turn_id} />}
                        </>
                    )
                }}
            </InfiniteChat>
            <ChatInput
                        placeholder="Type your message..."
                        // onKeyPress={sendMessage}
                        onKeyPress={(editorState: any) => {
                            sendMessage({content: editorState.text, role: "user"})
                            // console.log("### sending", sessionIdRef.current)
                            // sendMessage(editorState, undefined, sessionIdRef.current)
                        }}
                    />
            {/* <Button onClick={() => addMessage([{
                id: (messages?.length || 0) + (extraMessages.length || 0) + 1000,
                content: "Hello",
                created_at: "2021-01-01",
                role: "user"
            }])}>Add</Button> */}
        </div>
    )
}