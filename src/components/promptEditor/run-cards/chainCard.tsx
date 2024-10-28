import { useRunTree } from "../state/runsContext"
import { ErrorPopup, InputPopup, OutputPopup, RunJsonPopup } from "../stateJsonView"
import { ScoreComponent } from "../statsViews"
import { TimelineView } from "../timelineView"
import { RunProps } from "../types"
import { RunCard, RunCardHeader, RunTypeTag } from "./base-card"




export const ChainRun = ({run}: RunProps ) => {

    const {
        isShowPreview,
    } = useRunTree()

    return (
        // <div className='p-1  border-1 border-purple-200 rounded-lg'>
        <RunCard color="green">
            <RunCardHeader run={run}/>
            
            <div className='mx-5 flex'>                
                <ErrorPopup error={run.error}/>
                {run.outputs?.state && isShowPreview && 
                    <TimelineView state={run.outputs.state} />
                }
                {
                    run.outputs?.score !== undefined && <ScoreComponent score={run.outputs.score}/>
                }
            </div>
        </RunCard>
    )
}
