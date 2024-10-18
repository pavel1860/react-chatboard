import { Button } from "@nextui-org/react"
import { useRunState } from "../state/runsContext"
import { RunProps } from "../types"
import { ErrorPopup } from "../stateJsonView"
import { GeneratedMessage, Message, MessageType } from "../messages"
import { ExampleKeyButton, ExampleValueButton } from "../examplesView"





interface LlmRunProps extends RunProps {
    name: string
}


export const LlmRun = ({run, name}: LlmRunProps ) => {

    const {
        isHistoryHidden,
        toggleHistory
     } = useRunState(run.id)



    const inLen = run.inputs.messages.length
    // const outMessages = run.outputs?.generations?.map((g: any, idx: number) => ({
    //     id: `${run.id}_gen_${idx}`,
    //     role: g.message.data.role,
    //     content: g.message.data.content,
    //     toolCalls: g.message.data.additional_kwargs?.tool_calls
    // })) || run.outputs?.messages?.map((m: any, idx: number) => ({
    //     id: `${run.id}_input_${idx}`,
    //     ...m
    // })) || run.outputs?.content && [{
    //     id: `${run.id}_output`,
    //     role: 'output',
    //     content: run.outputs.content    
    // }] || []

    return (
    <div className='w-full flex flex-col items-center '>  
        {
            <Button 
                variant="flat" 
                size='sm'
                onPress={()=>{toggleHistory()}}
                >
                    {/* <IconCtx size={20} color='gray'><FaCommentDots /></IconCtx> <span className='text-gray-400'>{isHistoryHidden ? "show " : "hide "}{inLen-1}</span> */}
            </Button>}
            <ErrorPopup error={run.error}/>
        {run.inputMessages.map((m: any, idx: number) => ({
                        id: `${run.id}_input_${idx}`,
                        role: m.role,
                        content: m.content,
                    })
            ).map((message: MessageType, idx: number) => (
                ((!isHistoryHidden) || (idx == inLen - 1)) && 
                <div key={`input-msg-${idx}`} className='w-full p-2 py-1'>
                    <Message message={message}
                        controls={[
                            <ExampleKeyButton key={"ex-key-btn"} message={message} namespace={name}/>,
                            <ExampleValueButton key={"ex-val-btn"} message={message} namespace={name}/>
                        ]}
                        />
                </div>))
        }
        
        <div className="w-full p-2 bg-slate-100">
            <h1 className='text-lg text-slate-500'>Generation</h1>
            {run.outputMessages.map((message: MessageType, idx: number) => (
            <div key={`output-msg-${idx}`} className='w-full py-3'>
                <GeneratedMessage message={message}
                    model={run.model} 
                    modelType={run.modelType}
                    controls={[
                        <ExampleKeyButton key={"ex-key-btn"} message={message} namespace={name}/>,
                        <ExampleValueButton key={"ex-val-btn"} message={message} namespace={name}/>
                    ]}
                />
            </div>)
        )}
        </div>
    </div>
    )
}

