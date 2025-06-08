import PromptTextEditor from "../promptEditor/editors/promptTextEditor";






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
    icon?: React.ReactNode
    // userColor?: string
    // assistantColor?: string
    color?: string
    width?: string
    padding?: string
    radius?: string
}

// userColor="#3b82f6", assistantColor="#e5e7eb"
export function MessageBubble({ children, role, icon, color="#FFFFFF", width = "auto", padding = "5px", radius="5px" }: MessageBubbleProps) {

    if (role === "assistant") {
        return (
            <div className="flex">                
                {icon && <div className="p-3">
                    {icon}   
                </div>}
                <div 
                    // className="max-w-lg  text-gray-900 rounded-2xl rounded-tl-md shadow-sm"
                    className="max-w-lg  text-gray-900 shadow-sm"
                    style={{ backgroundColor: color, width: width, padding: padding, borderRadius: radius}}
                >
                    {children}
                </div>
                
            </div>
        )
    } else if (role === "user") {
        return (
            <div className="flex justify-end">
                
                <div 
                    className="max-w-lg text-white shadow-sm"
                    style={{ backgroundColor: color, width: width, padding: padding, borderRadius: radius }}
                >
                    {children}
                </div>
                {icon && <div className="p-3 ">                    
                    {icon}
                </div>}
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



interface MessageProps {
    children?: React.ReactNode
    role: "user" | "assistant"
    created_at?: string
    width?: string
    icon?: React.ReactNode
    color?: string
    radius?: string
}


export function Message({ children, role, created_at, width, icon, color="#FFFFFF", radius="5px" }: MessageProps){
    return (
        <MessageBubble role={role} assistantColor={color} width={width} icon={icon} radius={radius}>
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
