//@ts-nocheck
import { useEffect, useState } from "react"
import { IParameter, PydanticV2BaseModel, useChatboardMetadata } from "../services/chatboard-service"








export interface IParameterConfig extends IParameter {
    isVisible: boolean
}


export type ClassParametersType = {
    [key: string]: IParameterConfig;
}



export interface ColumnMetadata {
    name: string
    type: string
    enum?: string[]
    index?: boolean
    isSortable: boolean
}


export const getTableColumns = (classParameters: ClassParametersType): ColumnMetadata[] => {
    const columns = Object.keys(classParameters).reduce((acc: any, field: string) => {
        if (classParameters[field].isVisible) {
            acc.push({
                name: field,
                type: classParameters[field].type,
                enum: classParameters[field].enum,
                index: classParameters[field].index,
                isSortable: classParameters[field].index ? true : false
            }

            )
        }
        return acc
    }, [])
    return columns
}





export const filterDocumentProperties = (documents: any[], classParameters: ClassParametersType) => {

    if (Object.entries(classParameters).length == 0) {
        return []
    }

    return documents.map((doc: any) => {
        return {
            ...doc,
            metadata: Object.keys(doc.metadata).reduce((acc: any, field: string) => {

                if (!classParameters[field]) {
                    throw new Error("field not found in classParameters");

                }
                if (classParameters[field].isVisible) {

                    if (classParameters[field].type == 'object' || classParameters[field].type == 'array') {
                        acc[field] = doc.metadata[field]
                    } else {
                        acc[field] = doc.metadata[field]
                    }

                }
                return acc
            }, {})
        }


    })
}


const useLocalStorage = (namespace: string) => {

    // const [mainKey, setMainKey] = useState(namespace)  

    // useEffect(()=>{
    //     setMainKey(namespace)
    // }, [namespace])


    return {
        // mainKey,
        getItem: (key: string) => {
            if (!namespace) {
                return
            }
            let localMetadata: any = localStorage.getItem(namespace)
            if (localMetadata == null) {
                localMetadata = {}
                localStorage.setItem(namespace, JSON.stringify(localMetadata))
            } else {
                localMetadata = JSON.parse(localMetadata)
            }
            if (!localMetadata[key]) {
                localMetadata[key] = {}
                localStorage.setItem(namespace, JSON.stringify(localMetadata))
            }
            return localMetadata[key]
        },
        setItem: (key: string, value: string) => {
            if (!namespace) {
                return
            }
            let localMetadata: any = localStorage.getItem(namespace)
            if (localMetadata) {
                localMetadata = JSON.parse(localMetadata)
                if (!localMetadata[key]) {
                    localMetadata[key] = {}
                }
                localMetadata[key] = value
                localStorage.setItem(namespace, JSON.stringify(localMetadata))
            }
        },
    }
}




export const processPydanticMetadata = (metadataClass, storage) => {
    const schema = metadataClass.schema
    const isArray = metadataClass.type === "array"
    let serverMetadata = undefined
    if (metadataClass.pydantic_version === "v2"){
        serverMetadata = Object.keys(schema.properties).reduce((acc: { [key: string]: IParameterConfig }, key: string) => {
            let prop = schema.properties[key]
            if (prop.$ref) {
                const ref_key = prop.$ref.split("/").slice(-1)[0]
                prop = schema.$defs[ref_key]
            } else if (prop.allOf){
                if (prop.allOf.length == 1 && prop.allOf[0].$ref){
                    const ref_key = prop.allOf[0].$ref.split("/").slice(-1)[0]
                    prop = schema.$defs[ref_key]
                } else {
                    throw new Error("allOf length is not 1")
                }
            }
            acc[key] = {
                // isVisible: localMetadata && localMetadata[key] ? localMetadata[key].isVisible : true,
                isVisible: storage.getItem(key)?.isVisible !== undefined ? storage.getItem(key).isVisible : true,
                ...prop
            }
            return acc
        }, {})
        
    } else {
        serverMetadata = Object.keys(schema.function.parameters.properties).reduce((acc: { [key: string]: IParameterConfig }, key: string) => {
            let prop = schema.function.parameters.properties[key];                    
            acc[key] = {
                // isVisible: localMetadata && localMetadata[key] ? localMetadata[key].isVisible : true,
                isVisible: storage.getItem(key)?.isVisible !== undefined ? storage.getItem(key).isVisible : true,
                ...prop
            }
            return acc
        }, {})
        
    }

    return {
        serverMetadata, 
        isArray
    }
}





export const useRagMetadataClass = (namespace: string) => {

    // const [ currMetadataClass, setCurrMetadata ] = useState<MetadataClass | undefined>()

    const {
        data: metadata
    } = useChatboardMetadata()

    const [classParameters, setCurrMetadata] = useState<{ [key: string]: IParameterConfig }>({})
    const [currNamespace, setCurrNamespace] = useState<string | null>()
    const [currPromptName, setCurrPromptName] = useState<string | null>()
    const [currPromptRagName, setCurrPromptRagName] = useState<string | null>()

    const storage = useLocalStorage(currNamespace)


    useEffect(() => {
        if (namespace && metadata?.rag_spaces.length) {
            const meta = metadata.rag_spaces.find(n => n.namespace == namespace)
            if (!meta) {
                throw new Error("metdata could not be found in response")
            }
            setCurrPromptName(meta.prompt_name)
            setCurrPromptRagName(meta.prompt_rag)
            const metadataClass = meta?.metadata_class
            const {serverMetadata, isArray} = processPydanticMetadata(metadataClass, storage)
            
            // const serverMetadata = Object.keys(metadataClass.properties || metadataClass.function.parameters.properties).reduce((acc: { [key: string]: IParameterConfig }, key: string) => {
            //     let prop = metadataClass.properties ? metadataClass.properties[key] : metadataClass.function.parameters.properties[key];
            //     if (prop.$ref) {
            //         const ref_key = prop.$ref.split("/").slice(-1)[0]
            //         prop = metadataClass.properties.$defs[ref_key]
            //     }
            //     acc[key] = {
            //         // isVisible: localMetadata && localMetadata[key] ? localMetadata[key].isVisible : true,
            //         isVisible: storage.getItem(key)?.isVisible !== undefined ? storage.getItem(key).isVisible : true,
            //         ...prop
            //     }
            //     return acc
            // }, {})
            setCurrNamespace(namespace)
            setCurrMetadata(serverMetadata)
        }
    }, [namespace, metadata])









    // let localMetadata: any = localStorage.getItem(namespace)
    // if (localMetadata == null){
    //     localMetadata = {}
    //     localStorage.setItem(namespace, JSON.stringify(localMetadata))
    // }
    // localMetadata = JSON.parse(localMetadata)        



    // const setMetadataClass = (namespace: string, metadataClass: MetadataClass) => {
    //     // let localMetadata: any = localStorage.getItem(namespace)
    //     // if (localMetadata == null){
    //     //     localMetadata = {}
    //     //     localStorage.setItem(namespace, JSON.stringify(localMetadata))
    //     // }
    //     // localMetadata = JSON.parse(localMetadata)        

    //     const serverMetadata = Object.keys(metadataClass.function.parameters.properties).reduce((acc: {[key: string]: IParameterConfig}, key: string)=>{
    //         const prop = metadataClass.function.parameters.properties[key];
    //         acc[key] = {
    //             // isVisible: localMetadata && localMetadata[key] ? localMetadata[key].isVisible : true,
    //             isVisible: storage.getItem(key)?.isVisible !== undefined ? storage.getItem(key).isVisible : true,
    //             ...prop
    //         }
    //         return acc
    //     }, {})
    //     setCurrNamespace(namespace)
    //     setCurrMetadata(serverMetadata)
    // }


    const setParameter = (key: string, isVisible: boolean) => {

        const tmpMeta = {
            ...classParameters
        }
        tmpMeta[key].isVisible = isVisible

        // if (currNamespace){
        //     let localMetadata: any = localStorage.getItem(currNamespace)
        //     if (localMetadata){
        //         localMetadata = JSON.parse(localMetadata)
        //         if (!localMetadata[key]){
        //             localMetadata[key] = {}
        //         }
        //         localMetadata[key]["isVisible"] = isVisible
        //         localStorage.setItem(currNamespace, JSON.stringify(localMetadata))
        //     }

        // }
        const field = storage.getItem(key)
        field.isVisible = isVisible
        storage.setItem(key, field)
        setCurrMetadata(tmpMeta)

    }



    return {
        // setMetadataClass,
        classParameters,
        setParameter,
        promptName: currPromptName,
        promptRagName: currPromptRagName,
    }
}








export const useRunMetadata = (runType: string, promptName: string) => {

    const {
        data: metadata,
        isLoading,
        error,
    } = useChatboardMetadata()

    const [metadataClass, setMetadataClass] = useState<PydanticV2BaseModel | null>(null)
    const [namespace, setNamespace] = useState<string | null>(null)
    const [isArray, setIsArray] = useState(false)

    const storage = useLocalStorage(promptName)

    useEffect(() => {
        if (metadata && promptName) {
            if (runType === 'prompt') {

                const promptMetadataRecord = metadata.prompts.find(p => p.name === promptName)

                if (!promptMetadataRecord) {
                    return
                    // throw new Error("prompt metadata could not be found in response")
                }


                setNamespace(promptMetadataRecord.namespace || promptName)

                const metadataClass = promptMetadataRecord.output_class
                const {serverMetadata, isArray} = processPydanticMetadata(metadataClass, storage)
                // const serverMetadata = Object.keys(metadataClass.properties?.properties).reduce((acc: { [key: string]: IParameterConfig }, key: string) => {
                //     let prop = metadataClass.properties.properties[key];
                //     if (prop.$ref) {
                //         const ref_key = prop.$ref.split("/").slice(-1)[0]
                //         prop = metadataClass.properties.$defs[ref_key]
                //     }

                //     acc[key] = {
                //         // isVisible: localMetadata && localMetadata[key] ? localMetadata[key].isVisible : true,
                //         isVisible: storage.getItem(key)?.isVisible !== undefined ? storage.getItem(key).isVisible : true,
                //         ...prop
                //     }
                //     return acc
                // }, {})

                setIsArray(isArray)
                setMetadataClass(serverMetadata)



            }
        }
    }, [metadata, promptName])


    return {
        isArray,
        namespace,
        metadataClass,
        error,
        loading: isLoading
    }

}






