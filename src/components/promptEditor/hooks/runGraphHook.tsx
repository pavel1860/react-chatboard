import React, { useEffect } from 'react';








export interface AgentStateType {
    // id: string,
    name: string,
    isFirst: boolean,
    isLast: boolean,
    input: string | undefined,
    output: string | undefined,
    inputs?: {[key:string]: any} | undefined,
    outputs?: {[key:string]: any} | undefined,
    examples: any[],
    run_type: string,
    chain: any,
    llm: any,    
    tool: {
        name: string | undefined,
        input: string | undefined,
        output: string | undefined,
    },
    returnValues: string | undefined,
}



const newState = (): AgentStateType => {

    return {
        // id: id,
        run_type: 'chain',
        name: '',
        isFirst: false,
        isLast: false,
        input: undefined,
        output: undefined,
        examples: [],
        chain: undefined,
        llm: undefined,
        tool: {
            name: undefined,
            input: undefined,
            output: undefined,
        },
        returnValues: undefined,
    }
}



export const useStateGraph = (run: any, data: any[]) => {

    const [ states, setStates ] = React.useState<AgentStateType[]>([])

    console.log('sadfsfs')

    React.useEffect(() => {
        if (data){
            const tmpStates = []
            console.log(run)
            let currState = newState()
            currState.input = run.inputs.input
            currState.isFirst = true
            for (let run of data){
                // if (run.run_type == 'tool'){
                //     tmpStates.push(currState)
                //     currState = newState()
                //     currState.input = run.outputs.output
                // } else if (run.run_type == 'prompt'){
                //     currState.examples = run.inputs.examples
                // } else if (run.run_type == 'llm'){
                //     currState.output = run.outputs.generations[0].text
                // } else if (run.run_type == 'parser'){
                //     if ('return_values' in run.outputs){
                //         currState.returnValues = run.outputs.kwargs.return_values
                //     } else {
                //         currState.tool.name = run.outputs.kwargs.tool
                //         currState.tool.input = run.outputs.kwargs.tool_input
                //     }
                // }
                if (run.run_type == 'tool'){
                    currState.tool.name = run.name
                    currState.tool.input = run.inputs.input
                    currState.tool.output = run.outputs.output
                    tmpStates.push(currState)
                    currState = newState()
                    currState.input = run.outputs.output
                } else if (run.run_type == 'prompt'){
                    currState.examples = run.inputs.examples
                } else if (run.run_type == 'llm'){
                    currState.output = run.outputs?.generations[0].text
                } else if (run.run_type == 'parser'){
                    if ('return_values' in run.outputs){
                        currState.returnValues = run.outputs.kwargs.return_values
                    } else {
                        currState.tool.name = run.outputs.kwargs.tool
                        currState.tool.input = run.outputs.kwargs.tool_input
                    }
                }
            }
            currState.output = run.outputs.output
            currState.isLast = true
            tmpStates.push(currState)
            
            setStates(tmpStates)
        }
    }, [data, run])

    return {
        states,
    }
}