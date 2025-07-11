import React, { useEffect, useState } from 'react';
import MarkdownEditor from './editors/markdownEditor';
import { useDagDisplayRouter } from './state/dagRouterContext'
import { JsonState } from './stateJsonView';
import { ModelType } from '../../types/run-tree';
import { Button, Card, CardBody, CardHeader, Chip, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { Bot, BrainCircuit, ChevronsDownUp, ChevronsRightLeft, Copy, CopyCheck, Expand, Hammer, Settings, User } from 'lucide-react';
import { useCopyToClipboard } from '../../util/clipboard';



interface MessageContentProps {
    message: MessageType    
    onChange?: (text: string) => void
    notEditable?: boolean
    isCompact?: boolean
}

function MessageContent({message, onChange, notEditable, isCompact}: MessageContentProps) {
    const isExpended = !isCompact

    return (
        <div key={`${message.id}-${isExpended}`}>            
            <MarkdownEditor text={message.content as string} onChange={onChange} notEditable={notEditable} />
        </div>
    )
}




export interface MessageType {
    id: string
    role: "system" | "user" | "assistant"
    content: string | any[]
    tool_calls?: any
    tool_call_id?: string
}



export interface MessageProps {
    // role: "system" | "user" | "assistant"
    // content: string
    // toolCalls?: any
    message: MessageType
    addAsExampleKey?: (message: MessageType) => void
    addAsExampleValue?: (message: MessageType) => void
    onChange?: (text: string) => void
    isEditable?: boolean
    isExpended?: boolean
    controls?: React.ReactNode[]
}


export interface LlmOutputsProps {
    model: string
    modelType: ModelType
}



export const MessageRoleTag = ({role}: {role: string}) => {
    const variant = "bordered"
    const radius="sm"
    const iconSize = 13
    const textClass = "text-xs"
    const size = "sm"

    if (role === "assistant") {
        return (
            <Chip
                startContent={<Bot size={iconSize}/>}
                variant={variant}
                radius={radius}
                color="danger"
                size={size}
            >
                <span className={textClass} >Assistant</span>
            </Chip>
        )
    } else if (role === "system") {
        
        return (
            <Chip
                startContent={<Settings size={iconSize}/>}
                variant={variant}
                radius={radius}
                color="warning"
                size={size}
            >
                <span className={textClass} >System</span>
            </Chip>
        )
    } else if (role === "user") {
        return (
            <Chip
                startContent={<User size={iconSize}/>}
                variant={variant}
                radius={radius}
                color="primary"
                size={size}
            >
                <span className={textClass} >User</span>
            </Chip>
        )
        
    } else if (role === "tool") {
        return (
            <Chip
                startContent={<Hammer size={iconSize}/>}
                variant={variant}
                radius={radius}
                color="success"
                size={size}
            >
                <span className={textClass} >Tool</span>
            </Chip>
        )        
    } else {

    }
}



interface MessageHeaderProps {
    children?: React.ReactNode
}


// export const MessageHeader = ({message, children}: MessageHeaderProps) => {

//     return (
//         <div className="flex gap-2 items-center">
//             <MessageRoleTag role={message.role}/>
//         </div>
//     )
// }

export const MessageHeader = ({children}: MessageHeaderProps) => {

    return (
        <div className="flex gap-2 items-center">
            {children}
        </div>
    )
}



export const MessageCard = ({children}: {children: React.ReactNode}) => {

    return (
        <div className='w-full p-2  hover:bg-slate-50 rounded-lg border-1'>
            {children}
        </div>
    )
}




const ClipboardButton = ({ copyText }: { copyText: string }) => {
    const { copied, handleCopy } = useCopyToClipboard(copyText);
    return (
        <Button 
            color="primary" 
            radius="full" 
            size='sm' 
            onPress={handleCopy} 
            isIconOnly 
            startContent={copied ? <CopyCheck size={15} /> : <Copy size={15}/>} 
            variant="light"
        />
    )
}


export const Message = ({ message, isEditable, controls, isExpended, onChange }: MessageProps) => {
    const { role, content } = message

    const [expended, setExpended] = useState(isExpended || false)

    useEffect(() => {
        setExpended(isExpended || false)
    }, [isExpended])


    // const isExample = content ? content.search("EXAMPLE") > -1 : false
    console.log(message,"fd")

    return (
        <Card shadow="sm" isPressable={expended == false} onPress={() => setExpended(true)} fullWidth>        
            {/* <span className={`p-1 px-2 border-1 rounded-lg ${role == "system" ? "bg-orange-400" : role == "user" ? "bg-blue-400" : "bg-red-400"} text-stone-50`}>
                {role}
            </span>
            {isExample && <span className='p-1 px-2 shadow-sm border-1 rounded-lg bg-purple-600 text-slate-50' >Example</span>} */}
            <CardHeader>
                <MessageRoleTag role={role}/>
                {message.tool_call_id && <Chip size="sm" startContent={<Hammer size={15} />} variant="bordered" color="default">{message.tool_call_id}</Chip>}
                {expended && <Button isIconOnly variant="light" color='primary' startContent={<ChevronsDownUp size={15}  />} onPress={() => setExpended(false)} />}
                <ClipboardButton  copyText={message.content as string} />
                {/* {expended ? <span>Expended</span> : <span>Compact</span>} */}
            </CardHeader>
            <CardBody>
            
            {expended && <MessageContent
                message={message} 
                notEditable={!isEditable} 
                isCompact={!expended}
                onChange={onChange}
            />}
            {message.tool_calls?.length > 0 && <div className='w-full flex'>
                {/* <JSONTree data={message.tool_calls} /> */}
                {message.tool_calls.map((tool_call: any, index: number) => (
                    <div key={index}>
                        <Popover showArrow offset={20} placement="bottom">
                            <PopoverTrigger>
                                <Chip size="sm" startContent={<Hammer size={15} />} variant="bordered" color="default">{tool_call.id}</Chip>
                            </PopoverTrigger>
                            <PopoverContent>
                                <JsonState data={tool_call} />
                            </PopoverContent>
                        </Popover>
                    </div>
                ))}
            </div>}
            <div className="w-full flex justify-end">
                {controls}
                {/* <ExampleKeyButton message={message}/>
                <ExampleValueButton message={message}/> */}
            </div>
            </CardBody>
        </Card>
    )
}




const GeneratedMessageContent = ({message, modelType}: {message: MessageType, modelType: ModelType}) => {

    const { role, content, tool_calls } = message

    if (modelType === "anthropic") {
        const blocks = []
        for (const block of content){
            if (block.type === "text"){
                blocks.push(
                    <div>
                        <MessageContent message={message} notEditable isCompact/>                        
                    </div>
                )
            }
        }
        return blocks
    } else if (modelType === "openai") {
        return <MessageContent message={message} notEditable isCompact/>
    } else {
        throw new Error("unknown model type");
    }
    return "unknown model type"
}



const GeneratedMessageTools = ({message, modelType}: {message: MessageType, modelType: ModelType}) => {

    const { role, content, tool_calls } = message

    if (modelType === "anthropic") {
        //@ts-ignore
        return content.map((block: any, i: number) => {
            if (block.type === "tool_use"){
                return (
                    <div key={i}>
                        {/* <span className='p-1 px-2 border-1 rounded-lg border-slate-600 text-slate-600'>tool</span> */}
                        <MessageRoleTag role={"tool"}/>
                        <JsonState data={block}/>
                    </div>
                )
            }
        })
    } else if (modelType === "openai") {
        if (!tool_calls) return null
        return tool_calls.map((tool: any, i: number) => {
            return (
                <div key={i}>
                    {/* <span className='p-1 px-2 border-1 rounded-lg border-slate-600 text-slate-600'>tool</span> */}
                    <div className="flex gap-2 items-center">
                        <MessageRoleTag role={"tool"}/>
                        {/* <JsonState data={tool.function}/> */}
                        <span>{tool.function.name}</span>
                    </div>
                    <JsonState data={JSON.parse(tool.function.arguments)}/>
                </div>
            )
        })
    } else {
        throw new Error("unknown model type");
    }
}

export const GeneratedMessage = ({ message, model, modelType, controls }: MessageProps & LlmOutputsProps) => {

    const { role, content, tool_calls } = message

    const { currentDisplay, setCurrentDisplay, editExample } = useDagDisplayRouter()

    return (
        <Card shadow="sm" fullWidth>
            <CardHeader>
                <MessageRoleTag role={"assistant"}/>
                <Chip
                    variant="light"
                    startContent={<BrainCircuit size={20} />}
                    color="danger"
                >
                    {model}
                </Chip>
                <ClipboardButton  copyText={message.content as string} />
            </CardHeader>
            <CardBody>
                <GeneratedMessageContent message={message} modelType={modelType}/>
                <GeneratedMessageTools message={message} modelType={modelType}/>
            </CardBody>
        </Card>
    )

    return (
        <div className='w-full p-2 bg-slate-50 hover:bg-slate-50 rounded-lg border-1'>
            <div className='flex justify-between'>
                <span className={`p-1 px-2 border-1 rounded-lg ${role == "system" ? "bg-orange-400" : role == "user" ? "bg-blue-400" : "bg-red-400"} text-stone-50`}>
                    {role}
                </span>
                <div className="flex">
                    <span className='p-1 px-2 border-1 rounded-lg border-red-600 text-red-600'>{model}</span>
                    
                </div>
                
            </div>
            <GeneratedMessageContent message={message} modelType={modelType}/>
            <GeneratedMessageTools message={message} modelType={modelType}/>
            {/* <PromptTextEditor paragraphLabel={role === "assistant" ? "editor-paragraph-output" : "editor-paragraph-input"} text={content} notEditable isCompact/> */}
            {/* {toolCalls && toolCalls.map((tool: any, i: number) => {


                return (
                    <div key={i}>
                        <span className='p-1 px-2 border-1 rounded-lg border-slate-600 text-slate-600'>tool</span>
                        <JsonState data={tool.function}/>
                    </div>
                )
            })} */}
            <div className="w-full flex justify-end">
                {controls}                
            </div>
            
        </div>
    )
}


