import { RunTreeContext } from "../../../types/run-tree"
import { Chip } from "@heroui/react"
import { Bot, BrainCircuit, Route, SquareTerminal, Timer } from "lucide-react"
import { ErrorPopup, InputPopup, OutputPopup, RunJsonPopup } from "../stateJsonView"




interface RunTypeTagProps {
    runType: string
}

export const RunTypeTag = ({runType}: RunTypeTagProps) => {

    // const variant = "flat"
    const variant = "bordered"
    const radius="sm"
    const iconSize = 17
    const size = "sm"

    if (runType === "chain") {
        return (
            <Chip
                // startContent={<Bot size={iconSize} />}
                startContent={<Route size={iconSize}/>}
                // variant="flat"
                variant={variant}
                radius={radius}
                color="secondary"
                size={size}
            >
                Agent
            </Chip>
        )
    } else if (runType === "prompt") {
        return (
            <Chip
                // startContent={<SquareTerminal size={iconSize}/>}
                startContent={<BrainCircuit size={iconSize} />}
                variant={variant}
                radius={radius}
                color="primary"
                size={size}
            >
                Prompt
            </Chip>
        )
    } else if (runType === "llm"){
        return (
            <Chip
                startContent={<Bot size={iconSize}/>}
                variant={variant}
                radius={radius}
                color="warning"
                size={size}
            >
                Chip
            </Chip>
        )
    }
    
}


export const RunDuration = ({run}: {run: RunTreeContext}) => {
    let color = "green-500"
    if (run.duration() > 2) {
        color = "yellow-500"
    } else if (run.duration() > 5) {
        color = "red-500"
    }
    return (
        <div className={`flex items-center gap-2 text-slate-500`}>
            <Timer size={17}/>
            {run.duration(2)}
        </div>
    )
}


interface RunCardHeaderProps {
    run: RunTreeContext
    children?: any
}

export const RunCardHeader = ({run, children}: RunCardHeaderProps) => {
    
    return (
        <div className="flex items-center justify-between">            
            <div className="flex items-center gap-2">
                <RunJsonPopup run={run}>
                    <span className="cursor-pointer"><RunTypeTag runType={run.run_type}/></span>
                </RunJsonPopup>            
                <span className="">{run.name}</span>
            </div>
            <ErrorPopup error={run.error}/>
            <RunDuration run={run}/>
            {/* <div className="flex items-center gap-2">
                <Timer size={17}/>
                {run.duration(2)}
            </div> */}
            {children}            
            <div>
                <InputPopup inputs={run.inputs}/>
                <OutputPopup outputs={run.outputs}/>
            </div>
            {/* <span className='ml-5 text-xs text-gray-400'>{run.id}</span> */}
        </div>
    )
}





interface RunCardProps {
    children?: any
    color?: string
}


export const RunCard = ({children, color}: RunCardProps) => {

    return (
        // <div className="p-3 rounded-lg border-1 border-red-500 ">
        <div className={`py-1 px-3 rounded-lg border-1 border-${color || 'gray'}-300 `}>
            {children}
        </div>
    )

}