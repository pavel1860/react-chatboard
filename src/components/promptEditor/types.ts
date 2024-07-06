




export interface RunType {
    id: string,
    run_type: string,
    name: string,
    inputs: any,
    outputs: any,
    error: any,
    tool: any,
    isFirst: boolean,
    isLast: boolean,
    examples: any,
    extra: {
        model: string,
        system_filename: string | undefined,
        user_filename: string | undefined
    }
    child_runs: RunType[],
   
}


export interface ExampleType {
    id: string
    key: {
        // dense: number[],
        // sparse: number[]
        messages: any[],
    },
    value: {
        feedback: string,
        messages: any[],
        actions: any[],
    },
    state: any
}






export interface RunProps {
    run: RunType
    parentRun?: RunType
}





export interface RunTreeProps {
    run: RunType
    parentRun?: RunType
    depth?: number
}

