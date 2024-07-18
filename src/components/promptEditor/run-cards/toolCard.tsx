import { ErrorPopup, InputPopup, RunJsonPopup } from "../stateJsonView"
import { RunProps } from "../types"




export const ToolRun = ({run}: RunProps ) => {

    return (
        <div className='w-full p-1 bg-gray-200 border-2 border-slate-700 rounded-lg'>
            <RunJsonPopup run={run}>
                <span className='p-1 px-2 shadow-sm border-1 rounded-lg bg-slate-800 text-slate-50' >{run.run_type}</span> 
            </RunJsonPopup>
            <span>{run.name}</span>
                <div className='mx-5 flex'>
                    <span>Input</span>
                    <InputPopup inputs={run.inputs.tool}/>
                {/* <JsonState data={run.inputs.tool}/> */}
                <ErrorPopup error={run.error}/>
            </div>
        </div>
    )
}
