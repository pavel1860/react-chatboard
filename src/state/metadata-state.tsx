import { useEffect, useState } from "react"
import { IParameter, PydanticV2BaseModel, useChatboardMetadata } from "../services/chatboard-service"








export interface IParameterConfig extends IParameter {
    isVisible: boolean
}


export type ClassParametersType = {
    [key: string]: IParameterConfig;
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




export const useRagMetadataClass = (namespace: string) => {

    // const [ currMetadataClass, setCurrMetadata ] = useState<MetadataClass | undefined>()

    const {
        data: metadata
    } = useChatboardMetadata()

    const [classParameters, setCurrMetadata] = useState<{ [key: string]: IParameterConfig }>({})
    const [currNamespace, setCurrNamespace] = useState<string | null>()

    const storage = useLocalStorage(currNamespace)


    useEffect(() => {
        if (namespace && metadata?.rag_spaces.length) {
            const meta = metadata.rag_spaces.find(n => n.namespace == namespace)
            if (!meta) {
                throw new Error("metdata could not be found in response")
            }
            const metadataClass = meta?.metadata_class
            const serverMetadata = Object.keys(metadataClass.properties).reduce((acc: { [key: string]: IParameterConfig }, key: string) => {
                const prop = metadataClass.properties[key];
                acc[key] = {
                    // isVisible: localMetadata && localMetadata[key] ? localMetadata[key].isVisible : true,
                    isVisible: storage.getItem(key)?.isVisible !== undefined ? storage.getItem(key).isVisible : true,
                    ...prop
                }
                return acc
            }, {})
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
    }
}








export const useRunMetadata = (runType: string, promptName: string) => {
    
    const {
        data: metadata,
        isLoading,
        error,
    } = useChatboardMetadata()

    const [metadataClass, setMetadataClass] = useState<PydanticV2BaseModel | null>(null)
    const [isArray, setIsArray] = useState(false)

    const storage = useLocalStorage(promptName)

    useEffect(() => {
        if (metadata) {
            if (runType === 'prompt') {

                const promptMetadataRecord = metadata.prompts.find(p => p.name === promptName)

                if (!promptMetadataRecord) {
                    throw new Error("prompt metadata could not be found in response")
                }

                const metadataClass = promptMetadataRecord.output_class
                const serverMetadata = Object.keys(metadataClass.properties.properties).reduce((acc: { [key: string]: IParameterConfig }, key: string) => {
                    let prop = metadataClass.properties.properties[key];
                    if (prop.$ref){
                        const ref_key = prop.$ref.split("/").slice(-1)[0]
                        prop = metadataClass.properties.$defs[ref_key]
                    }

                    acc[key] = {
                        // isVisible: localMetadata && localMetadata[key] ? localMetadata[key].isVisible : true,
                        isVisible: storage.getItem(key)?.isVisible !== undefined ? storage.getItem(key).isVisible : true,
                        ...prop
                    }
                    return acc
                }, {})

                setIsArray(promptMetadataRecord.output_class?.type === "array")
                setMetadataClass(serverMetadata)



            }
        }
    }, [metadata])


    return {
        isArray,
        metadataClass,
        error,
        loading: isLoading
    }

}