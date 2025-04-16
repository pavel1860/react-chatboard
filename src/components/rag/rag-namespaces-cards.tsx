import { IRagSpaces } from "../../services/chatboard-service";
import Link from "next/link";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { ClassParametersType } from "../../../src/state/metadata-state";








interface RagNamespaceCardProps {
    namespace: IRagSpaces
}


// export const RagMetadataClass = ({metadataClass}: {metadataClass: MetadataClass}) => {

interface RagMetadataClassProps {
    classParameters: ClassParametersType
    setParameter: (key: string, isVisible: boolean) => void
}

export const RagMetadataClass = ({classParameters, setParameter}: RagMetadataClassProps) => {

    const selectedKeys = Object.keys(classParameters).reduce((acc: string[], key: string)=> classParameters[key].isVisible ? [...acc, key] : acc, [])

    return (
        <div>
            <Dropdown>
                <DropdownTrigger>
                    <Button 
                    variant="bordered" 
                    className="capitalize"
                    >
                    Columns
                    </Button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Multiple selection example"
                    variant="flat"
                    closeOnSelect={false}
                    disallowEmptySelection
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onAction={(key) => {
                        // @ts-ignore
                        setParameter(key, !classParameters[key].isVisible)
                    }}                    
                >
                    {classParameters && Object.keys(classParameters).map((key: string)=>{
                        const prop = classParameters[key]
                        return (
                            <DropdownItem key={key}>{key}</DropdownItem>
                        )
                    })}                    
                </DropdownMenu>
                </Dropdown>            
        </div>
    )
    

    console.log("#########", classParameters)
    return (
        <div>
            class parameters
            {/* <span>{metadataClass.function.name}</span> */}
            {classParameters && Object.keys(classParameters).map((key: string)=>{
                const prop = classParameters[key]
                return (
                    <div className="dark:text-white">
                        <input 
                            checked={prop.isVisible} 
                            id="vue-checkbox" 
                            type="checkbox" 
                            value="" 
                            onChange={(e)=> {
                                console.log("#######", e.target.checked)
                                setParameter(key, e.target.checked)
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        {/* @ts-ignore */}
                        <label for="vue-checkbox" className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {key}
                            {/* @ts-ignore */}
                            <span className="px-1 bg-red-300 border border-red-500 rounded-md">{prop.type}</span>
                        </label>
                    </div>
                )
            })}
        </div>
    )
}





export function RagNamespaceCard(props: RagNamespaceCardProps){


    return (
        <div className="relative rounded-lg border border-stone-200 pb-10 shadow-md transition-all hover:shadow-xl dark:border-stone-700 dark:hover:border-white">
            <Link
                href={`/rag/namespace/${props.namespace.namespace}`}
                className="flex flex-col overflow-hidden rounded-lg"
            >
            <div className="dark:text-white text-lg">{props.namespace.namespace}</div>
            </Link>
            {/* <RagMetadataClass metadataClass={props.namespace.metadata_class}/> */}
        </div>
    )
}