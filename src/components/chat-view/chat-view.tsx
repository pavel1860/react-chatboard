import { useState } from "react";
import createModelService from "../../services/model-service";
import { MessageBubble, MessageContent, MessageFooter, MessageText, MessageTime } from "./chat-message";
import InfiniteChat from "./infinite-chat"
import { z, ZodSchema } from "zod";
import { Button, Chip } from "@nextui-org/react";




// export function createChatHook<T>(model: string, schema: ZodSchema<T>) {

//     const chatHookd

// }





const MessageSchema = z.object({
    id: z.number(),
    content: z.string(),
    created_at: z.string(),
    role: z.enum(["user", "assistant"]),
})




type MessageType = z.infer<typeof MessageSchema>


const {
    useGetModelList,
    useGetModel,
    useCreateModel,
    useUpdateModel,
} = createModelService("Message", MessageSchema)


export const useChat = () => {

    const {
        data: messages,
        isLoading: messagesLoading,
        error: messagesError,
        mutate: mutateMessages
    } = useGetModelList()
    
    const [extraMessages, setExtraMessages] = useState<MessageType[]>([])

    return {
        messages,
        messagesLoading,
        messagesError,
        mutateMessages,
        extraMessages,
        addMessage: (messageList: MessageType[]) => {
            setExtraMessages([...messageList, ...extraMessages])
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
        addMessage
    } = useChat()


    return (
        <div>
            <Button onClick={() => addMessage([{
                id: (messages?.length || 0) + (extraMessages.length || 0) + 1000,
                content: "Hello",
                created_at: "2021-01-01",
                role: "user"
            }])}>Add</Button>
            <InfiniteChat
                messages={extraMessages.concat(messages || [])}
                // messageComp={(message: MessageType) => {
                //     return (
                //         <MessageBubble role={message.role}>
                //             <MessageContent>
                //                 <MessageText text={message.content}/>
                //             </MessageContent>
                //             <MessageFooter>
                //                 <MessageTime time={message.created_at}/>
                //             </MessageFooter>
                //         </MessageBubble>
                //     )
                // }}
                height="86vh"
                fetchMore={
                    () => {
                        // mutateMessages()
                    }
                }
            >
                {(message: MessageType) => {
                    return (
                        <MessageBubble role={message.role}>
                            <Chip color="primary">{message.id}</Chip>
                            <MessageContent>
                                <MessageText text={message.content}/>
                            </MessageContent>
                            <MessageFooter>
                                <MessageTime time={message.created_at}/>
                            </MessageFooter>
                        </MessageBubble>
                    )
                }}
            </InfiniteChat>
        </div>
    )
}