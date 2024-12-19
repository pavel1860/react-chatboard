import { useChatBot } from "../../hooks/chatbot-hook"
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react"
import { Bot, Ellipsis, SquareChevronRight, User } from "lucide-react"
import { useCallback, useState } from "react"
import PromptTextEditor from "../promptEditor/editors/promptTextEditor"
import MessageCard, { TimeCard } from "../assets/custom-message-card"
import InfiniteChat from "./custom-chat-view"
import { IMessage } from "../../services/types"
import { ChatInput } from "../editor/input"
import { send } from "process"





function ChatMessageCard({ message }: any) {
    const [text, setText] = useState<string>(message.output)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    return (
        <div>
            {/* <p>{message.output}</p> */}
            <PromptTextEditor text={text} onChangeText={(text) => setText(text)} notEditable={isEditing ? false : true} />
            <TimeCard time={new Date(message.asset_output_date)} light={message.metadata.role !== "user"} />
        </div>
    )
}


function LeftIcon({ message }: any) {
    if (message.metadata.role === "user") {
        return undefined
    }
    return message.metadata.role === "assistant" ? <Bot className="stroke-blue-600 m-3" size={30} /> : <User className="stroke-blue-600 m-3" size={30} />
}


interface DebugChatThreadProps {
    phoneNumber: string
    disabled: boolean
    setRunId?: (runId: string) => void
}



interface MessageMenuProps {
    message: IMessage
    setRunId?: (runId: string) => void
    deleteMessage: (id: string) => void
    resendMessage?: (id: string, content: string) => void
}


const MessageMenu = ({ message, setRunId, deleteMessage, resendMessage }: any) => {

    return (
        <div>
            {setRunId && <Button 
                size="sm" 
                isIconOnly 
                variant="light"
                onClick={() => {
                    console.log("$$$$", message.metadata.run_id)
                    setRunId && setRunId(message.metadata.run_id)
                }}>
                <SquareChevronRight color="#bdbdbd" />
            </Button>}
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        variant="light"
                        isIconOnly
                        
                    >
                        <Ellipsis color="#bdbdbd" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Static Actions"
                    onAction={(key) => {
                        if (key === "delete") {
                            deleteMessage(message.id)
                        } else if (key === "resend") {
                            if (message.metadata.role === "user") {
                                resendMessage && resendMessage(message.id, message.output)
                            }
                        }
                    }}
                >
                    {resendMessage && <DropdownItem key="resend" className="text-danger" color="danger">
                        Resend
                    </DropdownItem>}
                    <DropdownItem key="delete" className="text-danger" color="danger">
                        Delete
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    )
}



export default function DebugChatThread({ phoneNumber, setRunId, disabled }: DebugChatThreadProps) {

    const {
        messages,
        sendMessage,
        deleteMessage,
        sending,
        fetchMore,
        refetch,
        loading,
    } = useChatBot(phoneNumber)


    const handleSetRunId = useCallback((rid: string) => {
        console.log(">>>", rid, setRunId);
        setRunId && setRunId(rid);  // Always updates to the latest state
    }, []);

    const resendMessage = useCallback(async (id: string, content: string) => {
        try {
            sendMessage({"text": content}, id)
        } catch (error) {
            console.error(error)
            // setSending(false)
        }
    }, [messages, phoneNumber])



    const getMessageComp = (message: IMessage) => {

        if (message.role === "user") {
            return <MessageCard
                message={message.content}
                time={new Date(message.created_at)}
                role="output"
                leftIcon={<User className="stroke-blue-600 m-3" size={30} />}
                rightIcon={<MessageMenu message={message} deleteMessage={deleteMessage} resendMessage={resendMessage}/>}
            />
        } else { //? assistant
            return <MessageCard
                message={message.content}
                time={new Date(message.created_at)}
                role="input"
                leftIcon={<Bot className="stroke-blue-600 m-3" size={30} />}
                rightIcon={<MessageMenu message={message} setRunId={handleSetRunId} deleteMessage={deleteMessage}/>}
                // rightIcon={<Button size="sm" onClick={() => {
                //     console.log("####", message)
                //     setRunId && setRunId(message.metadata.run_id)
                // }}>Run ID</Button>}
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
            <div className="fixed bottom-0 left-0 w-1/2 bg-white border-t flex justify-center">

                <div className="flex w-11/12 items-center">
                    {!disabled && <ChatInput
                        placeholder="Type your message..."
                        onKeyPress={sendMessage}
                    />}
                </div>
            </div>
        </div>
    )
}