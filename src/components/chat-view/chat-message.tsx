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
}


export function MessageBubble({ children, role, userColor="#3b82f6", assistantColor="#e5e7eb" }: MessageBubbleProps) {

    if (role === "assistant") {
        return (
            <div className="flex">                
                <div 
                    className="max-w-lg  text-gray-900 p-3 rounded-lg shadow-sm"
                    style={{ backgroundColor: assistantColor }}
                >
                    {children}
                </div>
                <div className="p-3">
                    <Bot color="blue"/>   
                </div>
            </div>
        )
    } else if (role === "user") {
        return (
            <div className="flex justify-end">
                <div className="p-3 ">
                    
                    <User color="blue" />
                </div>
                <div 
                    className="max-w-lg text-white p-3 rounded-lg shadow-sm"
                    style={{ backgroundColor: userColor }}
                >
                    {children}
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
        <div className="flex justify-end">
            {children}
        </div>
    )
}


export function MessageTime({ time }: { time: string }) {
    return (
        <span className="text-xs text-gray-300">{formatDateTime(new Date(time))}</span>
    )
}