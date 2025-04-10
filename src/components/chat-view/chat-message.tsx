import PromptTextEditor from "../promptEditor/editors/promptTextEditor";
import { Bot,  User } from "lucide-react"





function formatDateTime(date: Date) {
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return date.toLocaleDateString('en-US', options as any);
}





export interface MessageBubbleProps {
    children: React.ReactNode   
    role: "user" | "assistant"
    userColor?: string
    assistantColor?: string
    width?: string
    padding?: string
}


export function MessageBubble({ children, role, userColor="#3b82f6", assistantColor="#e5e7eb", width = "auto", padding = "5px" }: MessageBubbleProps) {

    if (role === "assistant") {
        return (
            <div className="flex">                
                <div className="p-3">
                    <Bot color="blue"/>   
                </div>
                <div 
                    className="max-w-lg  text-gray-900 rounded-2xl rounded-tl-md shadow-sm"
                    style={{ backgroundColor: assistantColor, width: width, padding: padding}}
                >
                    {children}
                </div>
                
            </div>
        )
    } else if (role === "user") {
        return (
            <div className="flex justify-end">
                
                <div 
                    className="max-w-lg text-white rounded-2xl rounded-tr-md shadow-sm"
                    style={{ backgroundColor: userColor, width: width, padding: padding }}
                >
                    {children}
                </div>
                <div className="p-3 ">                    
                    <User color="blue" />
                </div>
            </div>
        )
    } else {
        return (
            <div>
                {children}
            </div>
        )
    }
}




export function MessageContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col w-full max-w-[700px] leading-1.5 px-3 py-2 rounded-xl ">
            {children}
        </div>
    )
}



export function MessageText({ text, isEditing, setText }: { text: string, isEditing?: boolean, setText?: (text: string) => void }) {
    return (
    
        <PromptTextEditor text={text} onChangeText={(text) => setText?.(text)} notEditable={isEditing ? false : true} />
    
    )
}


export function MessageFooter({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-end px-3">
            {children}
        </div>
    )
}


export function MessageTime({ time }: { time: string }) {
    return (
        <span className="text-xs text-gray-300">{formatDateTime(new Date(time))}</span>
    )
}



export function ToolCall({ tool_call }: { tool_call: any }) {
    return (
        <div>
            {tool_call.name}
        </div>
    )
}



export function Message({ children, role, created_at, width }: { children?: React.ReactNode, role: "user" | "assistant", created_at?: string, width?: string }){
    return (
        <MessageBubble role={role} assistantColor="#FFFFFF" width={width}>
            {/* <Chip color="primary">{message.id}</Chip> */}
            <MessageContent>
                {children}
                {/* <MessageText text={message.content}/> */}
                {/* <div className="text-sm">{content}</div> */}
            </MessageContent>
            <MessageFooter>
                {created_at && <MessageTime time={created_at} />}
            </MessageFooter>
        </MessageBubble>
    )
}
