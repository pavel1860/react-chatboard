import React, { useEffect, useState } from "react";
import { AssetItem, IAssetClass, MetadataClass } from "../../services/chatboard-service";
import { useAsset } from "../../state/asset-state";
import { JsonState } from "../promptEditor/stateJsonView";
import { RunView } from "../promptEditor/runView";
import { RunsContextProvider } from "../promptEditor/state/runsContext";
import { DagRouterProvider } from "../promptEditor/state/dagRouterContext";
import { Bug } from "lucide-react";

function formatDateTime(date: Date) {
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    };
    return date.toLocaleDateString('en-US', options as any);
}



export const useAssetItemMetadata = (metadata: MetadataClass | null | undefined) => {

    const [fieldLookup, setFieldLookup] = useState<any>({})
    

    useEffect(()=>{
        
        if (metadata){
            const className = metadata.function.name
            const parameters = metadata.function.parameters
            const properties = parameters.properties
            if (!properties){
                return
            }

            const parameterLookup = Object.keys(properties).reduce((acc: any, field: any)=>{
                const prop = properties[field]
                acc[field] = prop
                return acc
            }, {})
            setFieldLookup(parameterLookup)
            // if (parameters.type == 'object'){
            //     parameterLookup[]
            // }
        }
    }, [metadata])


    return {
        fieldLookup
    }
}




export const getFieldComps = (data: any, fieldLookup: any) => {
    const fieldsComps = Object.keys(data).reduce((acc: any, field: string) => {        
    // if (typeof props.metadata[field] == 'object'){
        if (!fieldLookup[field]){
            throw new Error(`Field ${field} not found in metadata `);
        }
            
        if ((fieldLookup[field].type == 'object') || (fieldLookup[field].type == 'array')){
            acc.push(
                <div><span className="px-1 bg-red-300 border border-red-500 rounded-md">{field}</span><JsonState data={data[field]} /></div>
            )    
        } else {
            acc.push(
                <div><span className="px-1 bg-red-300 border border-red-500 rounded-md">{field}</span>{data[field]}</div>        
            )
        }
        return acc        
    },[])
    return fieldsComps
}



export const InputCard = ({input, metadata}: {input: any, metadata: any}) => {
    const {
        metadata: classMetadata
    } = useAsset()
    const {
        fieldLookup
    } = useAssetItemMetadata(classMetadata?.asset_class.input_class)

    
    const inputTime = new Date(metadata.asset_input_date)
    return (
        <div className="w-[700px] bg-blue-500 text-white p-3 rounded-lg ml-auto">
            {Object.keys(fieldLookup).length && getFieldComps(input, fieldLookup)}
            <span className="text-xs text-gray-300">{formatDateTime(new Date(metadata.asset_output_date))}</span>
        </div>
    )

}


export const OutputCard = ({output, metadata}: {output: any, metadata: any}) => {

    const {
        metadata: classMetadata
    } = useAsset()
    const {
        fieldLookup
    } = useAssetItemMetadata(classMetadata?.asset_class.output_class)

    return (
        <div className="w-[700px] bg-gray-200 text-gray-900 p-3 rounded-lg">
            {Object.keys(fieldLookup).length && getFieldComps(output, fieldLookup)}
            <span className="text-xs text-gray-500">{formatDateTime(new Date(metadata.asset_output_date))}</span>
        </div>
    )

}




interface TimeCardProps {
    time: Date
    light: boolean
}

export const TimeCard = ({time, light}: TimeCardProps) => {
    const color = light ? "text-gray-300" : "text-gray-500"
    return (        
        <span className={`text-xs ${color}`}>{formatDateTime(time)}</span>
    )
}



interface MessageCardProps <I,O,M> {
    message: AssetItem<I, O, M>
    inputMessageComp: (input: I, metadata: M) => React.ReactNode
    outputMessageComp: (output: O, metadata: M) => React.ReactNode


}


export default function MessageCard<I,O,M>({message, inputMessageComp, outputMessageComp}: MessageCardProps <I,O,M>){


    const [isTraceOpen, setIsTraceOpen] = useState(false)

    console.log("fdsf")
    return (
        <div className="w-full mx-auto p-4">
            <div className="flex mb-4">
            <div className="w-[700px] bg-gray-200 text-gray-900 p-3 rounded-lg">
                {message.input ? inputMessageComp(message.input, message.metadata) :
                    // <div className="w-[700px] bg-blue-500 text-white p-3 rounded-lg ml-auto flex">
                        <><Bug /> <span className="px-2">No Input</span></>
                    // </div>
                }
                </div>
            </div>
            <div className="flex">
            <button onClick={()=>setIsTraceOpen(!isTraceOpen)} className="border-1 text-gray-400 px-2 rounded-lg mb-2 ml-auto">{isTraceOpen ? "Close Trace" : "Open Trace"}</button>
            </div>
            {isTraceOpen && 
                <div className="bg-slate-100">
                <RunsContextProvider id={message.id}>
                    <DagRouterProvider>
                        <RunView runId={message.id}/>
                    </DagRouterProvider>
                </RunsContextProvider>
                </div>
                }
            
                <div className="flex mb-4">
                {
                    message.output ?
                        
                        <div className="w-[700px] bg-blue-500 text-white p-3 rounded-lg ml-auto">
                            {outputMessageComp(message.output, message.metadata)}
                        </div> : <><Bug/> <span className="px-2">No Input</span></>}
                </div>    
                
                
                    
                
        </div>
    )
    
    
}