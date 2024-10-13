import { useChatBot } from "../../hooks/chatbot-hook"
import { Button, Input, Spinner, Textarea } from "@nextui-org/react"
import { Bot, User } from "lucide-react"
import { useState } from "react"
import PromptTextEditor from "../promptEditor/editors/promptTextEditor"
import { TimeCard } from "../assets/custom-message-card"
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
}

export default function DebugChatThread({phoneNumber}: DebugChatThreadProps) {

    const {
        messages,
        sendMessage,
        sending,
        fetchMore,
        refetch,
        loading,
    } = useChatBot(phoneNumber)


    return (
        <div>
            <InfiniteChat
                messages={messages}
                messageComp={(message: IMessage) => (<ChatMessageCard message={message} />)}
                isInputCheck={(message: IMessage) => message.metadata.role === "user"}
                leftIconComp={(message: IMessage) => <LeftIcon message={message} />}
                height="86vh"
                fetchMore={fetchMore}
            />
            <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-center">
                <div className="flex w-2/3  items-center">
                    <ChatInput 
                        // onChange={(e) => {
                        //     // console.log("### e", e)
                        //     // setInput(e.text)
                        // }}
                        placeholder="Type your message..."
                        onKeyPress={(value) => {
                            sendMessage(value.text)
                        }}
                    />                    
                </div>
            </div>
            
            {/* <footer className="sticky bottom-0 flex px-3">
                
                <Textarea
                    value={inputMessage}
                    placeholder="Enter your Message"
                    onChange={(e) => setInputMessage(e.target.value)}
                    endContent={<Button isLoading={sending} onClick={() => {
                        sendMessage(inputMessage)
                        setInputMessage("")
                    }}>Send</Button>}
                    minRows={1}
                    size="lg"
                />
            </footer> */}
        </div>
    )
}