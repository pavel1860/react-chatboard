//@ts-nocheck
import React, { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation'

import PromptTextEditor from './editors/promptTextEditor';
import { JSONTree } from 'react-json-tree';
// import { DagRouterProvider, DisplayType, SideViewType, useDagDisplayRouter } from './state/dagRouterContext';
import {  DisplayType,  useDagDisplayRouter } from './state/dagRouterContext'
// import { MdOutlineTextSnippet } from "react-icons/md";
// import { LuBrainCircuit } from "react-icons/lu";


import { useExamples, useRunList, useRunState, useRunTree } from './state/runsContext';
// import axios from 'axios';
// import { IconCtx } from '../components/aux/icons';
// import { useQuery } from '@apollo/client';
// import { GET_RUN_TREE } from '../../graphql/runQueries';
import { Button, Chip, Spacer, Popover, PopoverTrigger, PopoverContent, Accordion, AccordionItem, Input, Spinner} from '@nextui-org/react';
// import { TbDots } from 'react-icons/tb';
// import { FaCommentDots } from 'react-icons/fa';
import { GeneratedMessage, Message, MessageType } from './messages';
import { ErrorPopup, InputPopup, JsonState, OutputPopup, RunJsonPopup } from './stateJsonView';
import { ExampleKeyButton, ExampleStateButton, ExampleValueButton } from './examplesView';
// import { BsTerminal } from 'react-icons/bs';
import { RunProps, RunTreeProps, RunType } from './types';
import { ChainRun } from './run-cards/chainCard';
import { PromptRun } from './run-cards/promptCard';
import { LlmRun } from './run-cards/llmRun';
import { ToolRun } from './run-cards/toolCard';
import { EditExampleForm } from './editExampleForm';
import { InputCard, OutputCard } from './run-cards/io-cards';
import { useRunMetadata } from '../../state/chatboard-state';
// import { roundTo } from '../utils/math';
import { Hammer, RotateCcw } from 'lucide-react';




async function addExample(url: string, { arg }: { arg: { key: string, example: string, namespace: string }}) {
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ key: arg.key, example: arg.example, namespace: arg.namespace }),
        headers: {
            'Content-Type': 'application/json'
        },
        })
    }


export const AddExampleForm = () => {

    const { currentState, setCurrentState, clearExample } = useDagDisplayRouter()

    const [ currentKey, setCurrentKey ] = useState<string>('')
    const [ currentExample, setCurrentExample ] = useState<string>('')

    const { trigger, isMutating, error } = useSWRMutation('/ai/add_example', addExample)

    return (
        <div>
            {isMutating && <div>Adding example...</div>}
            {error && <div>Failed to add example</div>}
            <div className='flex justify-between'>
                <button
                    className={`bg-green-500 hover:bg-green-400 text-white py-0 px-2 rounded-full`}
                    onClick={()=>{trigger({
                            key: currentKey,
                            example: currentExample,
                            namespace: 'scrapper_examples'
                    })}}>Save Example</button>

                <button
                    className={`bg-rose-500 hover:bg-rose-300 text-white py-0 px-2 rounded-full`}
                    onClick={()=>{clearExample()}}>X</button>
            </div>
            <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg items-center space-x-4">
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">key</span>
                <div className="bg-neutral-200 rounded-sm max-h-72 overflow-scroll">
                    <PromptTextEditor 
                        text={currentState?.input} 
                        onChangeText={(text: string)=>{setCurrentKey(text)}}
                        paragraphLabel={'editor-paragraph-input'} 
                    />
                </div>
                    {/* </div> */}
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Metadata</span>


                    {/* <p className="bg-gray-400 rounded-sm">
                        {state.output}
                    </p> */}
                <div className="bg-neutral-200 rounded-sm max-h-72 overflow-scroll">
                    <PromptTextEditor 
                        text={currentState?.output} 
                        onChangeText={(text: string)=>{setCurrentExample(text)}}
                        paragraphLabel={'editor-paragraph-output'}/>
                </div>
            </div>
        </div>
    )


}


// const StateExampleComponent = ({ example }: {example: any}) => {

//     const [isOpen, setIsOpen] = useState(false)

//     if (!isOpen){
//         return (
//             <div className='bg-purple-300 rounded-xl'>
//                 {example.example.slice(0,30)}...
//             </div>
//         )
//     }

//     return (
//         <TextEditor text={example.example} paragraphLabel={'editor-paragraph-examples'} notEditable isCompact/>
//     )


// }


const Arrow = ({ direction }: {direction: "up" | "down" | "left" | "right"}) => {
    // Define the base class for the arrow
    const baseClass = "inline-block w-6 h-6";
  
    // Define specific classes for each direction
    const directionClass = {
      down: "border-b-2 border-r-2 rotate-45 border-gray-500 m-2",
      left: "border-t-2 border-l-2 -rotate-45 border-gray-500 m-2",
      up: "border-t-2 border-r-2 -rotate-45 border-gray-500 m-2",
      right: "border-b-2 border-l-2 rotate-45 border-gray-500 m-2",
    };
  
    // Combine the base class with the direction-specific class
    const arrowClass = `${baseClass} ${directionClass[direction]}`;
  
    return <div className={arrowClass}></div>;
  };
  

// const StateExampleComponent = ({ example }: {example: any}) => {

//     const [isOpen, setIsOpen] = useState(false)

    
//     return (        
//         <div>        
//         <Popover
//             isOpen={isOpen}
//             padding={10}
//             positions={['right']} // preferred positions by priority
            
//             content={({ position, childRect, popoverRect }) => (
//                 <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
//                     position={position}
//                     childRect={childRect}
//                     popoverRect={popoverRect}
//                     arrowColor={'indigo'}
//                     arrowSize={10}
//                     arrowStyle={{ opacity: 0.7 }}
//                     className='popover-arrow-container '
//                     arrowClassName='popover-arrow'
//                     >
//                 {/* <div className='bg-purple-300 rounded-xl px-1 py-1 w-8/12'> */}
//                 <div className='bg-indigo-400 rounded-xl px-1 py-1 w-8/12'>
//                     <PromptTextEditor text={example.example} paragraphLabel={'editor-paragraph-examples'} notEditable/>
//                 </div>
//                 </ArrowContainer>)}
//             >
//             <div className='bg-indigo-400 rounded-xl cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
//                 {example.example.slice(0,50)}...
//             </div>
//         </Popover>

//         </div>
//     )

// }


const OutputComponent = ({ output }: {output: any}) => {

    return (
        <>
    <div className='bg-slate-400 w-2 h-10'>&nbsp;</div> 
    <div className="h-0 w-0 border-x-8 border-x-transparent border-b-[16px] border-b-slate-400 rotate-180 scale-150"></div>
    <div className='bg-green-500 rounded-lg px-3 p-y2 mb-10'>
        {output}
    </div>
    
    
    </>)
}


const InputComponent = ({ input }: {input: any}) => {

    return (
        <>
            <div className='bg-green-500 rounded-lg px-3 p-y2 mt-5'>
                {input}
            </div>
            <div className='bg-slate-400 w-2 h-10'>&nbsp;</div> 
            <div className="h-0 w-0 border-x-8 border-x-transparent border-b-[16px] border-b-slate-400 rotate-180 scale-150"></div>        
        </>)
}



const ActionComponent = ({ action }: {action: any}) => {



    return (
        <>
            <div className='bg-slate-400 w-2 h-10'>&nbsp;</div> 
            <div className="max-w-sm bg-purple-200 rounded-xl shadow-xl items-center space-y-2 px-3 py-1">
                    <div className='flex space-x-5'>
                        <span 
                            className="inline-flex items-center rounded-md bg-purple-300 px-2 py-1 text-xs font-medium text-purple-800 ring-1 ring-inset ring-yellow-600/20"
                        >Action</span>
                        <div className=''>{action.name}</div>
                    </div>
                    <div className='flex space-x-5'>
                        <span 
                                className="inline-flex items-center rounded-md bg-purple-200 px-2 py-1 text-xs font-medium text-purple-800 ring-1 ring-inset ring-yellow-600/20"
                        >Input</span>
                        <div>{JSON.stringify(action.input)}</div>                        
                    </div>
                    <div className='flex space-x-5'>
                        <span 
                                className="inline-flex items-center rounded-md bg-purple-200 px-2 py-1 text-xs font-medium text-purple-800 ring-1 ring-inset ring-yellow-600/20"
                        >Output</span>
                        {/* <div>{JSON.stringify(action.output)}</div> */}
                        <PromptTextEditor text={action.output} paragraphLabel={'editor-paragraph-input'} notEditable isCompact/>
                    </div>
                    
            </div>
            <div className='bg-slate-400 w-2 h-10'>&nbsp;</div>
            <div className="h-0 w-0 border-x-8 border-x-transparent border-b-[16px] border-b-slate-400 rotate-180 scale-150"></div>
        </>
    )

}




const StateOutput = ({ outputs }: {outputs: any}) => {

    let outputComps = null


    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg items-center space-x-4">
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Output</span>
            
            {/* {state.outputs?.output && <PromptTextEditor text={state.outputs.output.content} paragraphLabel={'editor-paragraph-output'} notEditable/>} */}
            {outputComps}
        </div>
    )

}




const ToolCallChip = ({ toolCall }: {toolCall: any}) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
        <Popover
            isOpen={isOpen}
            padding={10}
            positions={['right']} // preferred positions by priority
        >
            <PopoverTrigger>
                <Button size="md" startContent={<Hammer />} variant="bordered" color="default" onClick={() => setIsOpen(!isOpen)}>{toolCall.name}</Button>
            </PopoverTrigger>
            <PopoverContent>
                <JSONTree data={toolCall} />
                {/* <TimelineView state={toolCall} /> */}
            </PopoverContent>
        </Popover>
        </>
    )
}


const RunTree = ({ run, depth, parentRun, index }: RunTreeProps) => {

    const {
        collapsed,
        toggleCollapse,
    } = useRunState(run.id)   
    
    const [horizontal, setHorizontal] = useState(false)

    depth = depth || 0
    // const {states} = useStateGraph(run, data.states)
    let comp = null
    let numChildren = run._child_runs.length
    if (run.run_type === 'chain'){
        comp = <ChainRun run={run} parentRun={parentRun}/>
    }    
    else if (run.run_type === 'prompt'){
        if (run.child_runs && run.child_runs[0].run_type === 'llm'){
            numChildren = run.child_runs[0].inputMessages.length + run.child_runs[0].outputMessages.length
        }        
        comp = <PromptRun run={run} parentRun={parentRun}/>
    } else if (run.run_type === 'llm'){
        comp = parentRun && <LlmRun run={run} name={parentRun.name} parentRun={parentRun}/>
        if (index > 0){
            comp = <div>
                <div className='w-full flex justify-center'>
                    <Chip size="md" startContent={<RotateCcw />} variant="bordered" color="warning">Retry {index}</Chip>
                </div>                
                {comp}
            </div>
        }
    } else if (run.run_type === 'tool'){
        comp = <ToolRun run={run} parentRun={parentRun}/>
    }
    
    
    return (
        <div             
            // style={{paddingLeft: (depth) * 10, marginBottom: 10}}
            style={{marginBottom: 10}}
            >
            {comp}
            { run.run_type == "chain" &&
                <Button variant="light" className="text-nowrap" size="sm" color="default" onClick={() => setHorizontal(!horizontal)}>{horizontal ? "vertical" : "horizontal"}</Button>
            }
            {/* {run.inputs?.input && <div>
                <InputCard input={run.inputs.input} />
            </div>} */}
            <div className="flex h-full" >            
                {run.child_runs && <div 
                    // className="w-4 ml-3 bg-slate-300 cursor-pointer min-h-full hover:bg-slate-400 shadow-sm"
                    className={"w-4 ml-3  cursor-pointer min-h-full  shadow-sm " + (collapsed ? "bg-slate-300 hover:bg-slate-200" : "bg-slate-200 hover:bg-slate-300")}
                    onClick={()=>{toggleCollapse()}}
                >&nbsp;</div>}
                {collapsed && <Button variant="light" className="text-nowrap" size="sm" color="default" onClick={() => toggleCollapse()}>
                            <span className="text-slate-400">{numChildren == 1 ? `${numChildren} item` : `${numChildren} items`}</span>
                        </Button>}
                <div className='w-full' style={{display: horizontal ? "flex" : "block"}}>
                    {!collapsed && run.child_runs?.map((chiledRun: any, i: number) => <RunTree key={i} index={i} run={chiledRun} depth={depth || 1} parentRun={run}/>)}
                </div>
            </div>
            {/* {run.outputs?.output?.output && <div>
                <OutputCard output={run.outputs.output} runName={run.name} runType={run.run_type} />
            </div>} */}
            {run.outputs?.response && <div>
                {run.outputs.response.tool_calls && run.outputs.response.tool_calls.map((toolCall: any, i: number) => 
                    <div key={i}>
                        <ToolCallChip toolCall={toolCall} />
                        
                        {/* <span>{toolCall.input}</span> */}
                        {/* <span>{toolCall.output}</span> */}
                    </div>
                
                )}
            </div>}
        </div>
    )
}


const RunJsonView = ({ run, data }: any) => {    
    return (
        <div>
            <JSONTree data={run} invertTheme={true} getItemString={(type, data: any, itemType, itemString, keyPath) => {
                if (type == 'Object' && data?.run_type){
                    return <span> {data?.run_type} {data?.execution_order} - {itemString}</span>
                }                
                return <span>{itemType} {itemString}</span>
            }}/>
        </div>
    )
}







export const RunViewToolbar = ({ runId }: any) => {
    const { 
        run, 
        error, 
        loading,
        runTreeState,
        hideHistory,
        collapse,
        isShowPreview,
        setIsShowPreview,
    } = useRunTree()


    const {
        openExamples,
    } = useExamples()

    const { currentDisplay, setCurrentDisplay } = useDagDisplayRouter()

    return (
        <div className="w-full bg-slate-300 flex justify-between">
            <div>

                <button 
                    className={`${currentDisplay == DisplayType.STATES ?'bg-blue-300':'bg-blue-700'} hover:bg-blue-300 text-white py-0 px-2`}
                    onClick={()=>{setCurrentDisplay(DisplayType.STATES)}}>States
                </button>
                <button 
                    className={`bg-blue-500 hover:${currentDisplay == DisplayType.JSON ?'bg-blue-300':'bg-blue-700'} text-white py-0 px-2`}
                    onClick={()=>{setCurrentDisplay(DisplayType.JSON)}}>JSON
                </button>
                <button 
                    className={`bg-blue-500 hover:${currentDisplay == DisplayType.JSON ?'bg-blue-300':'bg-blue-700'} text-white py-0 px-2`}
                    onClick={()=>{collapse(true, undefined, 1)}}>collapse
                </button>
                <button 
                    className={`bg-blue-500 hover:${currentDisplay == DisplayType.JSON ?'bg-blue-300':'bg-blue-700'} text-white py-0 px-2`}
                    onClick={()=>{collapse(false, undefined, undefined)}}>expend
                </button>
                <button 
                    className={`bg-blue-500 hover:${currentDisplay == DisplayType.JSON ?'bg-blue-300':'bg-blue-700'} text-white py-0 px-2`}
                    onClick={()=>{hideHistory(true, undefined)}}>hide history
                </button>
                <button 
                    className={`bg-blue-500 hover:${currentDisplay == DisplayType.JSON ?'bg-blue-300':'bg-blue-700'} text-white py-0 px-2`}
                    onClick={()=>{hideHistory(false, undefined)}}>show history
                </button>
                <button 
                    className={`${isShowPreview ? "bg-blue-400" : "bg-blue-500"} hover:bg-blue-300} text-white py-0 px-2`}
                    onClick={()=>{setIsShowPreview(!isShowPreview)}}>toggle preview
                </button>
            </div>
            <button 
                className={`bg-purple-500 hover:${currentDisplay == DisplayType.JSON ?'bg-red-300':'bg-red-700'} text-white py-0 px-2`}
                onClick={()=>{openExamples(run.name)}}>Examples
            </button>
        </div>
    )

}



export const RunView = ({ runId }: any) => {

    const { currentDisplay, setCurrentDisplay } = useDagDisplayRouter()
    const { run, error, loading } = useRunTree()

    if (loading || !run){
        return <div className="flex w-full justify-center"> <Spinner label="Loading" color="primary" labelColor="foreground"/></div>
    }
    let comp = null
    if (currentDisplay == DisplayType.STATES){
        comp = <RunTree run={run} />
    } else if (currentDisplay == DisplayType.JSON){
        comp = <RunJsonView run={run}/>
    }
    // console.log("$$$$$$$$$$$$", currentDisplay, setCurrentDisplay)
    return (
        <div>
            <RunViewToolbar />
                
            <div style={{
                // height: "calc(100vh - 40px)",
                overflow: "scroll",
            }}>
                {/* <div><EditExampleForm example={{
                    // input: run.inputs.input,
                    // output: run.outputs.output.output,
                }} onClose = {()=>{}}/></div> */}
            {comp}
            
            </div>
        </div>
    )    
}

