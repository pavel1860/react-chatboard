import { useRunTree } from "./state/runsContext"
import { ErrorPopup, InputPopup, OutputPopup, RunJsonPopup } from "./stateJsonView"
import { ScoreComponent } from "./statsViews"
import { TimelineView } from "./timelineView"
import { RunProps } from "./types"




export const ChainRun = ({run}: RunProps ) => {

    const {
        isShowPreview,
    } = useRunTree()

    return (
        <div className='p-1  border-1 border-purple-200 rounded-lg'>
            <RunJsonPopup run={run}>
                <span className='p-1 px-2  shadow-sm border-1 rounded-lg bg-purple-600 text-slate-50'>agent</span> 
            </RunJsonPopup>
            <span>{run.name}</span>
            <span className='ml-5 text-xs text-gray-400'>{run.id}</span>
            <div className='mx-5 flex'>
                <span>Input</span>
                <InputPopup inputs={run.inputs}/>
                <OutputPopup outputs={run.outputs}/>
                {/* <JsonState data={run.inputs}/> */}
                {/* {run.error && <JsonState data={run.error}/>} */}
                {/* {run.error && <PromptTextEditor paragraphLabel={"editor-paragraph-input"} text={run.error} notEditable isCompact/>} */}
                <ErrorPopup error={run.error}/>
                {run.outputs?.state && isShowPreview && 
                    <TimelineView state={run.outputs.state} />
                }
                {
                    run.outputs?.score !== undefined && <ScoreComponent score={run.outputs.score}/>
                }
            </div>
        </div>
    )
}
