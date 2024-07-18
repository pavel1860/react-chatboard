//@ts-nocheck
import { IRagSpaces } from "../../services/chatboard-service";
import { useRag } from "../../state/rag-state";
import Link from "next/link";
import { JSONTree } from 'react-json-tree'
import { ClassParametersType } from "@/src/state/rag-state2";


interface RagDocumentCardProps {
    namespace: IRagSpaces
    metadata: any
    classParameters: ClassParametersType
}







export default function RagDocumentCard({ metadata, classParameters, }: RagDocumentCardProps){


    // const {
    //     classParameters
    // } = useRag()    

    console.log("#######", classParameters)

    const fieldsComps = Object.keys(metadata).reduce((acc: any, field: string) => {
        console.log("field", field)
        if (classParameters[field].isVisible){
            
            if (classParameters[field].type == 'object' || classParameters[field].type == 'array'){
                acc.push(
                    <div><span className="px-1 bg-red-300 border border-red-500 rounded-md">{field}</span><JSONTree data={metadata[field]} /></div>
                )    
            } else {
                acc.push(
                    <div><span className="px-1 bg-red-300 border border-red-500 rounded-md">{field}</span>{metadata[field]}</div>        
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