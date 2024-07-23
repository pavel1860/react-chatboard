import { useEffect, useState } from "react"
import { useRunTree } from "./state/runsContext"
import { useRagDocuments } from "../../state/rag-state2"
import { ClassParametersType, ColumnMetadata, getTableColumns, useRunMetadata } from "../../state/metadata-state"









// const getTableColumns = (classParameters: ClassParametersType) => {
//     const columns = Object.keys(classParameters).reduce((acc: any, field: string) => {
//         if (classParameters[field].isVisible) {
//             acc.push({
//                 name: field,
//                 type: classParameters[field].type,
//                 enum: classParameters[field].enum
//             }

//             )
//         }
//         return acc
//     }, [])
//     return columns
// }



export const useRunRagListExample = (
        promptName: string, 
        ragNamespace: string,        
        inputField: string,
        onSave?: (data: any, error: any) => void, 
        exampleId?: string, 
        renderInput?: (data: any) => any, 
        renderOutput?: (data: any)=>any
    ) => {

    const { run, error, loading } = useRunTree()

    const [inputs, setInputs] = useState([])
    const [outputs, setOutputs] = useState([])
    const [data, setData] = useState([])

    const [columns, setColumns] = useState<ColumnMetadata[]>([])

    const {
        addDocument,
        saving,
        savingError,
        // classParameters,
    } = useRagDocuments(ragNamespace) // for the rag documents, (key value)

    const {
        metadataClass: classParameters, // for the run output (index, referenceStatus, requirmentCategory)
        // setMetadataClass,
        // setParameter
    } = useRunMetadata("prompt", promptName)
    

    useEffect(() => {
        if (run && classParameters && run.inputs?.input && run.outputs?.output?.output){
            // const inputField = 'rows'
            const input = run.inputs.input[inputField]
            const tempData = []
            for (let i = 0; i < input.length; i++){
                tempData.push({
                    input: input[i],
                    ...run.outputs.output.output[i]
                })
            }
            setData(tempData)
            const columns = getTableColumns(classParameters)
            columns.unshift({
                name: 'input',
                type: 'string',
                enum: undefined
            })
            setColumns(columns)
        }
    }, [run, classParameters])

    const onChange = (column: string, index: number, value: any) => {
        const tempData = [...data]
        tempData[index][column] = value
        setData(tempData)
    }

    const addRag = () => {
        if (data){
            const inputs: any = []
            const outputs = []
            for (let i = 0; i < data.length; i++){
                const { input, ...output } = data[i]
                inputs.push(input)                
                outputs.push(output)
            }
            if (renderInput){
                
            }
            
            const inputsArg = renderInput ? renderInput(inputs) : {[inputField]: inputs}    
            const outputArg = renderOutput ? renderOutput(outputs) : outputs
            addDocument(inputsArg, outputArg, exampleId, onSave)
            // addDocument(JSON.stringify(inputs), JSON.stringify(outputs))            
        }
        
    }

    return {
        data,
        columns,
        classParameters,
        addDocument,
        onChange,
        addRag,
        loading,
        error,
        saving,
        savingError
    }
}