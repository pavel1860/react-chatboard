//@ts-nocheck
import { BrainCircuit, FileText, LibraryBig } from "lucide-react"
import { useState } from "react"
import { LsRun, RetrieverRun, RunContainer } from "./types"
import { RetrieverCard } from "./retriever-card"











export function PromptRunCard({run}: {run: LsRun}) {

    const [isExpanded, setIsExpanded] = useState(false)

    console.log("sadf")
    return (
        <RunContainer onClick={()=>setIsExpanded(!isExpanded)}>
            <div className="flex">
                <BrainCircuit />
                {run.name} <span className="text-xs rounded-sm bg-pink-300 px-1">{run.run_type}</span>
            </div>
            {isExpanded && run.children && run.children.map((child)=>(
                <div>
                    {child.messages && child.messages.map((message)=>(<div>{message.role}</div>))}
                </div>))}
            {run.messages && run.children.map((message)=>
            <div className="mr-5">{message.content}</div>)}
        </RunContainer>
    )
}





interface RunProps {
    run: LsRun
}


export function RunCard({run}: RunProps) {

    if (run.run_type === "retriever") {
        return <RetrieverCard run={run as RetrieverRun} />
    } else if (run.run_type === "prompt") {
        return <PromptRunCard run={run} />
    } 

    return (
        <div className="p-3 rounded-lg border-1 border-red-500 ">
            {run.name} <span className="text-xs rounded-sm bg-pink-300 px-1">{run.run_type}</span>
            {run.children && run.children.map((child)=>
            <div className="mr-5"><MainRunCard run={child} /></div>)}
        </div>
    )
}



export function RunPipe({run}: RunProps) {

    return (
        <div className="p-3 rounded-lg border-1 border-red-500 ">
            {run.name} <span className="text-xs rounded-sm bg-pink-300 px-1">{run.run_type}</span>
            <div className="flex items-center">
                {run.children && run.children.map((child)=><><div className=""><RunCard run={child} /></div><div className="bg-black h-1 w-10">&nbsp;</div></>)}
            </div>
        </div>
    )
}



// interface RunProps {
//     run: LsRun
// }

export function MainRunCard({run}: RunProps) {



    return (
        <div className="p-3 rounded-lg border-1 border-red-500 ">
            {run.name}
            <div className="">
                {run.children && run.children.map((child)=><RunPipe run={child} />)}
            </div>
            
        </div>
    )


}