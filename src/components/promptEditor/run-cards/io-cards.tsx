//@ts-nocheck
import { useRunMetadata } from "../../../state/metadata-state"
import { JSONTree } from "react-json-tree"
import RagDocumentTable from "../../rag/rag-document-infinite-table"




interface InputCardProps {
    input: any
}

export function InputCard({input} : InputCardProps){


    return (
        <div>
            <JSONTree data={input} />
        </div>
    )

}



interface AIMessageType {
    content: string
    is_example: boolean
    is_history: boolean
    output: any
    role: string
    run_id: string
}

interface OutputCardProps {
    output: AIMessageType
    // metadata: any
    runName: string
    runType: string
}


export function OutputCard({output, runName, runType} : OutputCardProps){

    const {
        metadataClass,
        loading,
        isArray,
        error,
    } = useRunMetadata(runType, runName)


    if (loading ){
        return <div>Loading...</div>
    }

    if (!metadataClass){
        return <div>No metadata found</div>
    }

    if (isArray){

        return (
            
            <RagDocumentTable
                classParameters={metadataClass}
                //@ts-ignore
                data={output.output}
                onClick={(item)=>{
                    console.log("Open Drawer:", item)
                }}
                getItemId={(item: any, idx: number) => `${idx}`}
                getItemMetadata={(item: any, key: string, idx: number) => item[key]}
            />)
        return <div>{output.output.map((item: any) => <div>output item</div>)}</div>
    }

    return (
        <div>
            is array: {isArray}
            <JSONTree data={metadataClass} />
            <JSONTree data={output.output} />
        </div>
    )
}