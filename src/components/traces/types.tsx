



export interface LsRunBase {
    id: string
    name: string
    run_type: string
    inputs: any
    metadata: any
    start_time: string
    end_time: string
    error?: string | null
}



export interface RetrieverRun extends LsRunBase {
    documents: {id: string, score: number}[]
}



export interface LsRun extends LsRunBase {
    children: (LsRun | RetrieverRun)[]
}



export function RunContainer({children, onClick}: {children: any, onClick?: any}) {

    return (
        <div 
            className="p-3 rounded-lg border-1 border-slate-400 bg-gray-50 hover:bg-gray-100 cursor-pointer"
            onClick={onClick}
        >
            {children}
        </div>
    )
}
