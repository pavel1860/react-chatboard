import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import React, { useEffect, useState } from 'react';
import { JSONTree } from 'react-json-tree';
import PromptTextEditor from './editors/promptTextEditor';




export const JsonState = ({ data }: any) => {    
    const theme = {
        scheme: 'monokai',
        author: 'wimer hazenberg (http://www.monokai.nl)',
        base00: '#272822',
        base01: '#383830',
        base02: '#49483e',
        base03: '#75715e',
        base04: '#a59f85',
        base05: '#f8f8f2',
        base06: '#f5f4f1',
        base07: '#f9f8f5',
        base08: '#f92672',
        base09: '#fd971f',
        base0A: '#f4bf75',
        base0B: '#a6e22e',
        base0C: '#a1efe4',
        base0D: '#66d9ef',
        base0E: '#ae81ff',
        base0F: '#cc6633',
      };
      
    return (
        // <div className='rounded-lg px-1 bg-[rgb(255,255,250)] border-2 border-purple-700'>
        <div className='rounded-lg px-1 bg-[rgb(255,255,250)]'>
            <JSONTree data={data} theme={theme} hideRoot invertTheme={true} getItemString={(type, data: any, itemType, itemString, keyPath) => {
                if (type == 'Object'){
                    return <span> {itemString}</span>
                }                
                return <span>{itemType} {itemString}</span>
            }}/>
        </div>
    )
}



export const EditableJsonState = ({ data, onChange }: any) => {    
    const theme = {
        scheme: 'monokai',
        author: 'wimer hazenberg (http://www.monokai.nl)',
        base00: '#272822',
        base01: '#383830',
        base02: '#49483e',
        base03: '#75715e',
        base04: '#a59f85',
        base05: '#f8f8f2',
        base06: '#f5f4f1',
        base07: '#f9f8f5',
        base08: '#f92672',
        base09: '#fd971f',
        base0A: '#f4bf75',
        base0B: '#a6e22e',
        base0C: '#a1efe4',
        base0D: '#66d9ef',
        base0E: '#ae81ff',
        base0F: '#cc6633',
      };
      
    return (
        // <div className='rounded-lg px-1 bg-[rgb(255,255,250)] border-2 border-purple-700'>
        <div className='rounded-lg px-1 bg-[rgb(255,255,250)]'>
            <JSONTree data={data} theme={theme} hideRoot invertTheme={true} getItemString={(type, data: any, itemType, itemString, keyPath) => {
                if (type == 'Object'){
                    return <span> {itemString}</span>
                }                
                return <span>{itemType} {itemString}</span>
            }}
            // valueRenderer={(raw, value, ...keyPath) => {
            //     console.log(keyPath)
            //     return <em><input value={raw} onChange={(e)=> {onChange(e.target.value, keyPath)}} /></em>}}
            />
        </div>
    )
}









export const RunJsonPopup = ({ children, run }: {children: any, run: any}) => {
    if (!run) return null

    return (
        <Popover size='lg' placement="bottom" showArrow={true}>
            <PopoverTrigger>
                {/* <Button size="sm" variant="ghost" color='primary' isIconOnly><BsTerminal /></Button> */}
                {children}
            </PopoverTrigger>
            <PopoverContent>
            <JsonState data={run}/>
            </PopoverContent>
        </Popover>
        
    )
}




export const InputPopup = ({ inputs }: {inputs: any}) => {
    if (!inputs) return null

    return (
        <Popover size='lg' placement="bottom" showArrow={true}>
            <PopoverTrigger>
                <Button size="sm" variant="light" color='primary'>Inputs</Button>
            </PopoverTrigger>
            <PopoverContent>
            <JsonState data={inputs}/>
            </PopoverContent>
        </Popover>
        
    )
}


export const OutputPopup = ({ outputs }: {outputs: any}) => {
    if (!outputs) return null

    return (
        <Popover size='lg' placement="bottom" showArrow={true}>
            <PopoverTrigger>
                <Button size="sm" variant="light" color='primary'>Output</Button>
            </PopoverTrigger>
            <PopoverContent>
            <JsonState data={outputs}/>
            </PopoverContent>
        </Popover>
        
    )
}



export const ErrorPopup = ({ error }: {error: any}) => {
    if (!error) return null

    return (
        <Popover size='lg' placement="bottom" showArrow={true}>
            <PopoverTrigger>
                <Button size="sm" color='danger'>Error</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PromptTextEditor paragraphLabel={"editor-paragraph-input"} text={error} notEditable/>
            </PopoverContent>
        </Popover>
        
    )

}

