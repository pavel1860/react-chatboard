import createModelService from "../../services/model-service";
import { MessageBubble, MessageContent, MessageFooter, MessageText, MessageTime } from "./chat-message";
import InfiniteChat from "./infinite-chat"
import { z, ZodSchema } from "zod";




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
    


    return {
        messages,
        messagesLoading,
        messagesError,
        mutateMessages
    }
}

export default function ChatView() {

    const {
        messages,
        messagesLoading,
        messagesError,
        mutateMessages
    } = useChat()


    return (
        <div>
            <InfiniteChat
                messages={messages || []}
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