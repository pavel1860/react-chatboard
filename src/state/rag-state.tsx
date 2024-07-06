"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useChatboard } from "./chatboard-state";
import { MetadataClass, IParameter } from "@/services/chatboard-service";




// interface MetadataProperty {
//     name: string
//     type: string
//     isVisible: boolean
// }


interface IParameterConfig extends IParameter{
    isVisible: boolean
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
            if (localMetadata == null){
                localMetadata = {}
                localStorage.setItem(namespace, JSON.stringify(localMetadata))
            } else {
                localMetadata = JSON.parse(localMetadata)
            }            
            if (!localMetadata[key]){
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
            if (localMetadata){
                localMetadata = JSON.parse(localMetadata)
                if (!localMetadata[key]){
                    localMetadata[key] = {}
                }
                localMetadata[key] = value
                localStorage.setItem(namespace, JSON.stringify(localMetadata))
            }
        },
    }
}




const useMetadataClass = () => {

    // const [ currMetadataClass, setCurrMetadata ] = useState<MetadataClass | undefined>()

    const [classParameters, setCurrMetadata]  = useState<{[key: string]: IParameterConfig}>({})
    const [currNamespace, setCurrNamespace] = useState<string | null>()

    const storage = useLocalStorage(currNamespace)

    const setMetadataClass = (namespace: string, metadataClass: MetadataClass) => {
        // let localMetadata: any = localStorage.getItem(namespace)
        // if (localMetadata == null){
        //     localMetadata = {}
        //     localStorage.setItem(namespace, JSON.stringify(localMetadata))
        // }
        // localMetadata = JSON.parse(localMetadata)        

        const serverMetadata = Object.keys(metadataClass.function.parameters.properties).reduce((acc: {[key: string]: IParameterConfig}, key: string)=>{
            const prop = metadataClass.function.parameters.properties[key];
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
        setMetadataClass,
        classParameters,
        setParameter,
    }
}


const RagContext = createContext<{
    classParameters: {[key: string]: IParameterConfig}
    setParameter: (key: string, isVisible: boolean) => void
}>({} as any)


export function RagContextProvider({children, namespace}: {children: any, namespace: string}){

    const {
        getRagDocuments,
        metadata
    } = useChatboard()

    // const [ currMetadataClass, setCurrMetadata ] = useState<MetadataClass | undefined>()
    const {
        classParameters,
        setMetadataClass,
        setParameter
    } = useMetadataClass()


    useEffect(()=>{
        if (namespace && metadata.rag_spaces.length){
            const meta = metadata.rag_spaces.find(n => n.namespace == namespace)
            if (!meta){
                throw new Error("metdata could not be found in response")
            }
            setMetadataClass(namespace, meta?.metadata_class)
        //     getRagDocuments(namespace)
        }        
    }, [namespace, metadata])

    // useEffect(()=>{
    //     console.log("dasdjdff;lkasj", currMetadataClass)
    // }, [currMetadataClass])
    useEffect(()=>{
        getRagDocuments(namespace)
    }, [namespace])

    return (
        <RagContext.Provider value={{
            classParameters,
            setParameter
        }}>
            {children}
        </RagContext.Provider>
    )
}


export const useRag = () => {
    return useContext(RagContext)
}

