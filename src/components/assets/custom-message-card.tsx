import React, { useEffect, useState } from "react";
import { AssetItem, IAssetClass, MetadataClass } from "../../services/chatboard-service";
import { useAsset } from "../../state/asset-state";
import { JsonState } from "../promptEditor/stateJsonView";
import { RunView } from "../promptEditor/runView";
import { RunsContextProvider } from "../promptEditor/state/runsContext";
import { DagRouterProvider } from "../promptEditor/state/dagRouterContext";
import { Bug } from "lucide-react";
import PromptTextEditor from "../promptEditor/editors/promptTextEditor";

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


    useEffect(() => {

        if (metadata) {
            const className = metadata.function.name
            const parameters = metadata.function.parameters
            const properties = parameters.properties
            if (!properties) {
                return
            }

            const parameterLookup = Object.keys(properties).reduce((acc: any, field: any) => {
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
        if (!fieldLookup[field]) {
            throw new Error(`Field ${field} not found in metadata `);
        }

        if ((fieldLookup[field].type == 'object') || (fieldLookup[field].type == 'array')) {
            acc.push(
                <div><span className="px-1 bg-red-300 border border-red-500 rounded-md">{field}</span><JsonState data={data[field]} /></div>
            )
        } else {
            acc.push(
                <div><span className="px-1 bg-red-300 border border-red-500 rounded-md">{field}</span>{data[field]}</div>
            )
        }
        return acc
    }, [])
    return fieldsComps
}



export const InputCard = ({ input, metadata }: { input: any, metadata: any }) => {
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


export const OutputCard = ({ output, metadata }: { output: any, metadata: any }) => {

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

export const TimeCard = ({ time, light }: TimeCardProps) => {
    const color = light ? "text-gray-300" : "text-gray-500"
    return (
        <span className={`text-xs ${color}`}>{formatDateTime(time)}</span>
    )
}




interface MessageCardProps<I, O, M> {
    message: string
    time: Date
    role: "input" | "output"
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    // messageComp: (message: AssetItem<I, O, M>) => React.ReactNode
    // leftIconComp?: (message: AssetItem<I, O, M>) => React.ReactNode

}


export default function MessageCard<I, O, M>({ message, role, leftIcon, rightIcon, time }: MessageCardProps<I, O, M>) {


    const [isTraceOpen, setIsTraceOpen] = useState(false)
    const [text, setText] = useState<string>(message)
    const [isEditing, setIsEditing] = useState<boolean>(false)


    const wrapperClassName = role === "input" ? "flex" : "flex ml-auto"
    const cardClassName = role === "input" ?  "flex flex-col w-full max-w-[700px] leading-1.5 px-3 py-2 border-gray-200 bg-gray-100 rounded-xl " : "flex flex-col w-full max-w-[700px] leading-1.5 px-3 py-2 border-gray-200 bg-blue-500 text-white rounded-xl "

    return (
        <div className="w-full mx-auto p-4">
            <div className="flex mb-4">
                <div className={wrapperClassName}>
                    {leftIcon}
                    <div className={cardClassName}>
                        <PromptTextEditor text={text} onChangeText={(text) => setText(text)} notEditable={isEditing ? false : true} />
                        <TimeCard time={new Date(time)} light={role === "output"} />
                    </div>
                    {rightIcon}
                </div>
            </div>
        </div>
    )
}





// interface MessageCardProps <I,O,M> {
//     message: AssetItem<I, O, M>
//     role: "input" | "output"
//     // inputMessageComp: (input: I, metadata: M) => React.ReactNode
//     // outputMessageComp: (output: O, metadata: M) => React.ReactNode
//     messageComp: (message: AssetItem<I, O, M>) => React.ReactNode
//     leftIconComp?: (message: AssetItem<I, O, M>) => React.ReactNode
// }


// export default function MessageCard<I,O,M>({message, messageComp, role, leftIconComp}: MessageCardProps <I,O,M>){


//     const [isTraceOpen, setIsTraceOpen] = useState(false)

//     let comp = undefined
//     if (role == "input"){
//         comp = <div className="flex">
//                     {leftIconComp && leftIconComp(message)}
//                     <div className="flex flex-col w-full max-w-[700px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-xl ">
//                         {messageComp(message) }            
//                     </div>
//                 </div>
//     } else {
//         comp = <div className="flex ml-auto">
//                     {leftIconComp && leftIconComp(message)}
//                     <div className="flex flex-col w-full max-w-[700px] leading-1.5 p-4 border-gray-200 bg-blue-500 text-white rounded-xl ">
//                         {messageComp(message)}
//                     </div>
//                 </div>
//     }

//     return (
//         <div className="w-full mx-auto p-4">
//             <div className="flex mb-4">
//                 {comp}
//             </div>    
//         </div>
//     )   
// }