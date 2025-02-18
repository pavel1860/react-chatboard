import { useState } from "react";
import createModelService from "../../services/model-service";
import { MessageBubble, MessageContent, MessageFooter, MessageText, MessageTime } from "./chat-message";
import InfiniteChat from "./infinite-chat"
import { z, ZodSchema } from "zod";
import { Button, Chip } from "@nextui-org/react";
import { ChatInput } from "../editor/input";




// export function createChatHook<T>(model: string, schema: ZodSchema<T>) {

//     const chatHookd

// }

const BaseModel = z.object({
    id: z.number(),
    score: z.number(),
    turn_id: z.number(),
    created_at: z.string(),
    // updated_at: z.string(),
})



const MessageSchema = BaseModel.extend({
    content: z.string(),
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

            
        <div className="sticky bottom-0 ">
            
            <InfiniteChat
                messages={extraMessages.concat(messages || [])}
                // height="86vh"
                height="800px"
                fetchMore={
                    () => {
                        // mutateMessages()
                    }
                }
            >
                {(message: MessageType) => {
                    return (
                        <MessageBubble role={message.role}>
                            {/* <Chip color="primary">{message.id}</Chip> */}
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
            <ChatInput
                        placeholder="Type your message..."
                        // onKeyPress={sendMessage}
                        onKeyPress={(editorState: any) => {
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