// @ts-nocheck TODO - Fix the types
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useChatboard } from "./chatboard-state";
import { MetadataClass, IParameter } from "../services/chatboard-service";
import { useRagDocumentsEndpoint } from "../services/rag-service";
import { 
    IMetadataResponse, 
    getRagDocumentsApi, 
    useChatboardMetadata, 
    useProfileService
  } from '../services/chatboard-service'



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




export const useMetadataClass = (namespace: string) => {

    // const [ currMetadataClass, setCurrMetadata ] = useState<MetadataClass | undefined>()

    const {
        data: metadata
    } = useChatboardMetadata()

    const [classParameters, setCurrMetadata]  = useState<{[key: string]: IParameterConfig}>({})
    const [currNamespace, setCurrNamespace] = useState<string | null>()

    const storage = useLocalStorage(currNamespace)


    useEffect(()=>{
        if (namespace && metadata?.rag_spaces.length){
            const meta = metadata.rag_spaces.find(n => n.namespace == namespace)
            if (!meta){
                throw new Error("metdata could not be found in response")
            }
            const metadataClass = meta?.metadata_class
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
    }, [namespace, metadata])


    const setParameter = (key: string, isVisible: boolean) => {
        
        const tmpMeta = {
            ...classParameters
        }
        tmpMeta[key].isVisible = isVisible

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


const RagContext = createContext<{
    classParameters: {[key: string]: IParameterConfig}
    setParameter: (key: string, isVisible: boolean) => void
    documents: any
    loading: boolean
    error: any
}>({} as any)


export function RagContextProvider({children, namespace}: {children: any, namespace: string | null}){

    // const {
    //     // getRagDocuments,
    //     metadata
    // } = useChatboard()

    

    // const [ currMetadataClass, setCurrMetadata ] = useState<MetadataClass | undefined>()
    const {
        classParameters,
        // setMetadataClass,
        setParameter
    } = useMetadataClass(namespace)


    const ragDocumentService = useRagDocumentsEndpoint(namespace)


    // useEffect(()=>{
    //     if (namespace && metadata?.rag_spaces.length){
    //         const meta = metadata.rag_spaces.find(n => n.namespace == namespace)
    //         if (!meta){
    //             throw new Error("metdata could not be found in response")
    //         }
    //         setMetadataClass(namespace, meta?.metadata_class)
    //     //     getRagDocuments(namespace)
    //     }        
    // }, [namespace, metadata])

    // useEffect(()=>{
    //     console.log("dasdjdff;lkasj", currMetadataClass)
    // }, [currMetadataClass])
    // useEffect(()=>{
    //     getRagDocuments(namespace)
    // }, [namespace])

    return (
        <RagContext.Provider value={{
            documents: ragDocumentService.data || [],
            loading: ragDocumentService.isLoading,
            error: ragDocumentService.error,
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

