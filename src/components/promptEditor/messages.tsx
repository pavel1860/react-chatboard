import React, { useEffect, useState } from 'react';
import PromptTextEditor from './editors/promptTextEditor';
import { JSONTree } from 'react-json-tree';
// import { DagRouterProvider, DisplayType, SideViewType, useDagDisplayRouter } from './state/dagRouterContext';
import { DagRouterProvider, DisplayType, SideViewType, useDagDisplayRouter } from './state/dagRouterContext'
import { useExamples, useRunList, useRunState, useRunTree } from './state/runsContext';

import { JsonState } from './stateJsonView';
import { text } from 'aws-sdk/clients/customerprofiles';








export interface MessageType {
    id: string
    role: "system" | "user" | "assistant"
    content: string
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
}

export const Message = ({ message, isEditable, controls, isExpended, onChange }: MessageProps) => {

    const { role, content } = message


    const isExample = content.search("EXAMPLE") > -1

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




export const GeneratedMessage = ({ message, model, controls }: MessageProps & LlmOutputsProps) => {

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
            <PromptTextEditor paragraphLabel={role === "assistant" ? "editor-paragraph-output" : "editor-paragraph-input"} text={content} notEditable isCompact/>
            {toolCalls && toolCalls.map((tool: any, i: number) => {


                return (
                    <div key={i}>
                        <span className='p-1 px-2 border-1 rounded-lg border-slate-600 text-slate-600'>tool</span>
                        <JsonState data={tool.function}/>
                    </div>
                )
            })}
            <div className="w-full flex justify-end">
                {controls}                
            </div>
            
        </div>
    )
}


