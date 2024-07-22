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
import { 
    useRagMetadataClass, 
    filterDocumentProperties,
    IParameterConfig,
    useRunMetadata,
} from "./metadata-state";



// interface MetadataProperty {
//     name: string
//     type: string
//     isVisible: boolean
// }



const RagContext = createContext<{
    classParameters: { [key: string]: IParameterConfig }
    setParameter: (key: string, isVisible: boolean) => void
    page: number,
    setPage: (page: number) => void
    documents: any
    loading: boolean
    error: any
}>({} as any)


export function RagContextProvider({ children, namespace }: { children: any, namespace: string | null }) {

    // const {
    //     // getRagDocuments,
    //     metadata
    // } = useChatboard()



    // const [ currMetadataClass, setCurrMetadata ] = useState<MetadataClass | undefined>()
    const {
        classParameters,
        // setMetadataClass,
        setParameter
    } = useRagMetadataClass(namespace)


    const {
        data,
        isLoading,
        error,
        page,
        setPage,
    } = useRagDocumentsEndpoint(namespace)


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
            // documents: ragDocumentService.data || [],
            // loading: ragDocumentService.isLoading,
            // error: ragDocumentService.error,
            documents: (classParameters && data && filterDocumentProperties(data, classParameters)) || [],
            page,
            setPage,
            loading: isLoading,
            error: error,
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













export function useRagDocuments(namespace: string) {

    // const {
    //     classParameters,
    //     // setMetadataClass,
    //     setParameter
    // } = useRunMetadata("prompt", promptName)
    const {
        classParameters,
        setParameter,
        promptName,
        promptRagName,
    } = useRagMetadataClass(namespace)

    const addDocument = (inputs: any, metadata: any) => {

    }


    const {
        data,
        isLoading,
        error,
        // page,
        // setPage
    } = useRagDocumentsEndpoint(namespace)


    return {
        documents: (classParameters && data && filterDocumentProperties(data, classParameters)) || [],
        addDocument,
        // page,
        // setPage,
        loading: isLoading,
        error: error,
        classParameters,
        setParameter
    }
}
