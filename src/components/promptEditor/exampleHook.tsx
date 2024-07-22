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



export const useRunRagListExample = (promptName: string, ragNamespace: string, inputField: string) => {

    const { run, error, loading } = useRunTree()

    const [inputs, setInputs] = useState([])
    const [outputs, setOutputs] = useState([])
    const [data, setData] = useState([])

    const [columns, setColumns] = useState<ColumnMetadata[]>([])

    const {
        addDocument,
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

    return {
        data,
        columns,
        classParameters,
        addDocument,
        onChange
    }
}