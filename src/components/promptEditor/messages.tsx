import React from 'react';
import PromptTextEditor from './editors/promptTextEditor';
import { useDagDisplayRouter } from './state/dagRouterContext'
import { JsonState } from './stateJsonView';
import { ModelType } from '@/src/types/run-tree';




export interface MessageType {
    id: string
    role: "system" | "user" | "assistant"
    content: string | any[]
    toolCalls?: any
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

export const Message = ({ message, isEditable, controls, isExpended, onChange }: MessageProps) => {
    const { role, content } = message


    const isExample = content ? content.search("EXAMPLE") > -1 : false

    return (
        <div className='w-full p-2  hover:bg-slate-50 rounded-lg border-1'>
            <span className={`p-1 px-2 border-1 rounded-lg ${role == "system" ? "bg-orange-400" : role == "user" ? "bg-blue-400" : "bg-red-400"} text-stone-50`}>
                {role}
            </span>
            {isExample && <span className='p-1 px-2 shadow-sm border-1 rounded-lg bg-purple-600 text-slate-50' >Example</span>}
            
            <PromptTextEditor 
                paragraphLabel={role === "assistant" ? "editor-paragraph-output" : "editor-paragraph-input"} 
                text={content} 
                notEditable={!isEditable} 
                isCompact={!isExpended}
                onChangeText={onChange}
            />
            <div className="w-full flex justify-end">
                {controls}
                {/* <ExampleKeyButton message={message}/>
                <ExampleValueButton message={message}/> */}
            </div>
        </div>
    )
}




const GeneratedMessageContent = ({message, modelType}: {message: MessageType, modelType: ModelType}) => {

    const { role, content, toolCalls } = message

    if (modelType === "anthropic") {
        const blocks = []
        for (const block of content){
            if (block.type === "text"){
                blocks.push(
                    <div>
                        <PromptTextEditor paragraphLabel={role === "assistant" ? "editor-paragraph-output" : "editor-paragraph-input"} text={block.text} notEditable isCompact/>                        
                    </div>
                )
            }
        }
        return blocks
    } else if (modelType === "openai") {
        return <PromptTextEditor paragraphLabel={role === "assistant" ? "editor-paragraph-output" : "editor-paragraph-input"} text={content} notEditable isCompact/>
    } else {
        throw new Error("unknown model type");
    }
    return "unknown model type"
}



const GeneratedMessageTools = ({message, modelType}: {message: MessageType, modelType: ModelType}) => {

    const { role, content, toolCalls } = message

    if (modelType === "anthropic") {
        //@ts-ignore
        return content.map((block: any, i: number) => {
            if (block.type === "tool_use"){
                return (
                    <div key={i}>
                        <span className='p-1 px-2 border-1 rounded-lg border-slate-600 text-slate-600'>tool</span>
                        <JsonState data={block}/>
                    </div>
                )
            }
        })
    } else if (modelType === "openai") {
        if (!toolCalls) return null
        return toolCalls.map((tool: any, i: number) => {
            return (
                <div key={i}>
                    <span className='p-1 px-2 border-1 rounded-lg border-slate-600 text-slate-600'>tool</span>
                    <JsonState data={tool.function}/>
                </div>
            )
        })
    } else {
        throw new Error("unknown model type");
    }
}

export const GeneratedMessage = ({ message, model, modelType, controls }: MessageProps & LlmOutputsProps) => {

    const { role, content, toolCalls } = message

    

    const { currentDisplay, setCurrentDisplay, editExample } = useDagDisplayRouter()

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


