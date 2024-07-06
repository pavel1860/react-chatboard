import { IRagSpaces, MetadataClass } from "@/services/metadata-service"
import { useRag } from "@/state/rag-state";
import Link from "next/link";
import { JSONTree } from 'react-json-tree'



interface RagDocumentCardProps {
    namespace: IRagSpaces
    metadata: any
}







export default function RagDocumentCard(props: RagDocumentCardProps){


    const {
        classParameters
    } = useRag()    

    const fieldsComps = Object.keys(props.metadata).reduce((acc: any, field: string) => {
        if (classParameters[field].isVisible){
            // if (typeof props.metadata[field] == 'object'){
            if (classParameters[field].type == 'object' || classParameters[field].type == 'array'){
                acc.push(
                    <div><span className="px-1 bg-red-300 border border-red-500 rounded-md">{field}</span><JSONTree data={props.metadata[field]} /></div>
                )    
            } else {
                acc.push(
                    <div><span className="px-1 bg-red-300 border border-red-500 rounded-md">{field}</span>{props.metadata[field]}</div>        
                )
            }
            
        }            
            
        return acc        
    },[])


    return (
        <div className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
            {/* <JSONTree data={props.metadata} /> */}
            {fieldsComps}
        </div>
    )
}