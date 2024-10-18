import { useChatBot } from "../../hooks/chatbot-hook"
import { Button, Input, Spinner, Textarea } from "@nextui-org/react"
import { Bot, User } from "lucide-react"
import { useState } from "react"
import PromptTextEditor from "../promptEditor/editors/promptTextEditor"
import MessageCard, { TimeCard } from "../assets/custom-message-card"
import InfiniteChat from "./custom-chat-view"
import { IMessage } from "@/src/services/chatbot-service"
import { ChatInput } from "../editor/input"




function ChatMessageCard({ message }: any) {
    const [text, setText] = useState<string>(message.output)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    return (
        <div>
            {/* <p>{message.output}</p> */}
            <PromptTextEditor text={text} onChangeText={(text)=>setText(text)} notEditable={isEditing ? false : true}/>
            <TimeCard time={new Date(message.asset_output_date)} light={message.metadata.role !== "user"} />
        </div>
    )
}


function LeftIcon({message}: any){
    if (message.metadata.role === "user") {
        return undefined
    }
    return message.metadata.role === "assistant" ? <Bot className="stroke-blue-600 m-3" size={30}/> : <User className="stroke-blue-600 m-3" size={30}/>
}


interface DebugChatThreadProps {
    phoneNumber: string
    setRunId?: (runId: string) => void
}





export default function DebugChatThread({phoneNumber, setRunId}: DebugChatThreadProps) {

    const {
        messages,
        sendMessage,
        sending,
        fetchMore,
        refetch,
        loading,
    } = useChatBot(phoneNumber)


    const getMessageComp = (message: IMessage) => {

        if (message.metadata.role === "user") {
            return <MessageCard 
                message={message.output} 
                time={new Date(message.asset_output_date)} 
                role="output" 
                leftIcon={<User className="stroke-blue-600 m-3" size={30}/>}
            />
        } else {
            return <MessageCard
                message={message.output}
                time={new Date(message.asset_output_date)}
                role="input"
                leftIcon={<Bot className="stroke-blue-600 m-3" size={30} />}
                rightIcon={<Button size="sm" onClick={() => {
                    console.log("####", message)
                    setRunId && setRunId(message.metadata.run_id)
                }}>Run ID</Button>}
            />
        }
    }
    


    return (
        <div>
            <InfiniteChat
                messages={messages}
                messageComp={getMessageComp}                
                height="86vh"
                fetchMore={fetchMore}
            />
            <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-center">
                <div className="flex w-2/3  items-center">
                    <ChatInput 
                        placeholder="Type your message..."                        
                        onKeyPress={sendMessage}
                    />                    
                </div>
            </div>
        </div>
    )
}