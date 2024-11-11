import { Button, Chip, Spacer } from "@nextui-org/react"
import { useRunTree } from "../state/runsContext"
import { ErrorPopup, InputPopup, OutputPopup, RunJsonPopup } from "../stateJsonView"
import { RunProps } from "../types"
import { TimelineView } from "../timelineView"
import { ScoreComponent } from "../statsViews"
import { ExampleStateButton } from "../examplesView"
import { EditExampleForm } from "../editExampleForm"
import { useState } from "react"
import { RunCard, RunCardHeader } from "./base-card"
import { BrainCircuit } from "lucide-react"



const sanitizeFilename = (filename: string) => {
    return filename.replace('.jinja2', '').replace('.jinja', '')
}



const PromptInputs = ({ inputs }: { inputs: any }) => {
    if (typeof inputs !== 'object') return null
    console.log(typeof inputs)
    return (
        <div>
            obj
        </div>
    )
}


export const PromptRun = ({ run, parentRun }: RunProps) => {

    const {
        isShowPreview,
    } = useRunTree()


    const toolRuns = run.child_runs?.find((r: any) => r.run_type === 'tool')

    const [isEditOpen, setIsEditOpen] = useState(false)

    let modelComp = null
    if (run.child_runs && run.child_runs[0].run_type === 'llm') {
        modelComp = <Chip
            startContent={<BrainCircuit size={15} />}
            color="danger"
            size="sm"
            radius="sm"
            variant = "bordered"
        >
            {run.child_runs[0].model}
        </Chip>
    }


    return (
        <RunCard color="green">
            <RunCardHeader run={run}>
                {modelComp}
            </RunCardHeader>
            {toolRuns && <span className='p-1 px-2 shadow-sm border-1 rounded-lg bg-slate-800 text-slate-50'>{toolRuns.name}</span>}
            <ErrorPopup error={run.error} />
            {run.outputs?.state && isShowPreview &&
                <TimelineView state={run.outputs.state} />
            }
            {run.outputs?.score !== undefined && <ScoreComponent score={run.outputs.score} />}
            <div className="flex w-full justify-end">
                {/* @ts-ignore */}
                {parentRun && <ExampleStateButton run={run} namespace={run.name} parentRun={parentRun} />}
            </div>
            {/* </div> */}
        </RunCard>
    )

    return (
        <div className='p-1 border-2 border-blue-100 rounded-lg relative'>

            <div className="flex items-center">
                {/* <RunJsonPopup run={run}> */}
                <span className='p-1 px-2 shadow-sm border-1 rounded-lg bg-blue-600 text-slate-50' >{run.run_type}</span>
                {/* </RunJsonPopup> */}
                <span>{run.name}</span>
                <Button size="sm" onClick={() => setIsEditOpen(true)}>Edit</Button>
                {isEditOpen && <div><EditExampleForm example={{
                    input: run.inputs.input,
                    output: run.outputs.output.output,
                }} onClose={() => { setIsEditOpen(false) }} /></div>}
                {/* <div> */}
                <Spacer x={2} />

                {run.extra &&
                    <>
                        {run.extra.system_filename &&
                            <span className='p-1 px-2 shadow-sm border-1 rounded-lg bg-orange-100' >
                                {/* @ts-ignore */}
                                <span className='text-sm'></span> {sanitizeFilename(run.extra.system_filename)}
                            </span>}
                        {run.extra.user_filename &&
                            <span className='p-1 px-2 shadow-sm border-1 rounded-lg bg-blue-100 ' >
                                {/* @ts-ignore */}
                                <span className='text-xs'></span>{sanitizeFilename(run.extra.user_filename)}
                            </span>}
                    </>
                }
            </div>
            {/* <JsonState data={run.inputs}/> */}
            <InputPopup inputs={run.inputs} />
            <OutputPopup outputs={run.outputs} />
            {/* @ts-ignore */}
            {toolRuns && <span className='p-1 px-2 shadow-sm border-1 rounded-lg bg-slate-800 text-slate-50'>{toolRuns.name}</span>}
            <ErrorPopup error={run.error} />
            {run.outputs?.state && isShowPreview &&
                <TimelineView state={run.outputs.state} />
            }
            {run.outputs?.score !== undefined && <ScoreComponent score={run.outputs.score} />}
            <div className="flex w-full justify-end">
                {/* @ts-ignore */}
                {parentRun && <ExampleStateButton run={run} namespace={run.name} parentRun={parentRun} />}
            </div>
            <PromptInputs inputs={run.inputs} />
            {/* </div> */}
        </div>
    )
}






