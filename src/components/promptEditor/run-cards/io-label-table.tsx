import { ClassParametersType } from "../../../state/rag-state2";
import { IRagSpaces } from "../../../services/chatboard-service";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";

import { useRag } from "../../../state/rag-state";
import Link from "next/link";
import { JSONTree } from 'react-json-tree'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Skeleton, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useRunRagListExample } from "../exampleHook";



interface RagDocumentTableProps {
    ragNamespace: string
    promptName: string
    inputField: string
    getItemId?: (item: any, idx: number) => string
    getItemMetadata?: (item: any, key: string, idx: number) => any
    onClick?: (e: any) => void
    onSave?: (data: any, error: any) => void
    exampleId?: string
    renderInput?: (data: any) => any
    renderOutput?: (data: any) => any

    // onChange?: (column: string, row: number, value: string) => void
}




const EnumDropDown = ({ value, enumValues, onChange }: { value: string, enumValues: string[], onChange?: (e: any) => void }) => {

    return (
        <Dropdown            
        >
            <DropdownTrigger>
                <Button
                    variant="light"
                >
                    {value}
                </Button>
            </DropdownTrigger>
            <DropdownMenu 
                variant="faded" 
                aria-label="Dropdown menu with icons"
                onAction={(e) => {
                    onChange && onChange(e)
                }}
            >
                {enumValues.map((item: string) => (
                    <DropdownItem
                        key={item}
                    >
                        {item}
                    </DropdownItem>
                ))}                
            </DropdownMenu>
        </Dropdown>
    );
}



const getTableDataComponent = (value: any, type: string, enumValues?: string[], onChange?: (e: any) => void) => {

    if (type == 'object' || type == 'array') {
        return <JSONTree data={value} />
    }
    if (enumValues) {
        return <EnumDropDown value={value} enumValues={enumValues} onChange={onChange}/>
    }
    return value

}



const tableSkeleton = (rows: number, columns: number) => {

    const skeleton = []
    for (let i = 0; i < rows; i++){
        const row = []
        for (let j = 0; j < columns; j++){
            row.push(
                <Skeleton className="h-10 w-1/5 rounded-lg m-4"/>
            )
        }
        skeleton.push(<div className="flex">{row}</div>)
    }
    return skeleton

}


export default function IOLabelTable({ 
        promptName, 
        ragNamespace, 
        onClick, 
        getItemId, 
        getItemMetadata, 
        exampleId,
        inputField, 
        renderOutput,
        renderInput,
        onSave
    }: RagDocumentTableProps) {

    const [isLoading, setIsLoading] = React.useState(true);
    const [hasMore, setHasMore] = React.useState(false);


    const {
        data,
        columns,
        onChange,
        addRag,
        saving,
        loading,
        error,
    } = useRunRagListExample(promptName, ragNamespace, inputField, onSave, exampleId, renderInput, renderOutput)


    if (loading) {
        <div> <Spinner label="Loading..." /> </div>
    }


    if (columns.length == 0) {
        return (
            <div className="flex w-full h-full justify-center items-center"> <Spinner label="Loading Columns..." /> </div>
            
            // <div className="pt-20">
            // <div className="w-full flex">                 
            //     <Skeleton className="h-10 w-1/5 rounded-lg m-4"/>
            //     <Skeleton className="h-10 w-2/5 rounded-lg m-4"/>
            //     <Skeleton className="h-10 w-2/5 rounded-lg m-4"/>
            // </div>
            // <div className="w-full flex">                 
            //     <Skeleton className="h-14 w-1/5 rounded-lg m-4"/>
            //     <Skeleton className="h-14 w-2/5 rounded-lg m-4"/>
            //     <Skeleton className="h-14 w-2/5 rounded-lg m-4"/>
            // </div>
            // <div className="w-full flex">                 
            //     <Skeleton className="h-14 w-1/5 rounded-lg m-4"/>
            //     <Skeleton className="h-14 w-2/5 rounded-lg m-4"/>
            //     <Skeleton className="h-14 w-2/5 rounded-lg m-4"/>
            // </div>
            // <div className="w-full flex">                 
            //     <Skeleton className="h-14 w-1/5 rounded-lg m-4"/>
            //     <Skeleton className="h-14 w-2/5 rounded-lg m-4"/>
            //     <Skeleton className="h-14 w-2/5 rounded-lg m-4"/>
            // </div>
            // </div>
        )
    }

    return (
        <div>
        <Button onClick={()=>addRag()} isLoading={saving}>Save</Button>
        <Table
            isHeaderSticky
            aria-label="Example table with infinite pagination"
            selectionMode="single"
            // baseRef={scrollerRef}
            // bottomContent={
            //     hasMore ? (
            //         <div className="flex w-full justify-center">
            //             <Spinner ref={loaderRef} color="white" />
            //         </div>
            //     ) : null
            // }
            classNames={{
                base: "max-h-[820px] overflow-scroll",
                table: "min-h-[800px]",
            }}
        >
            <TableHeader>
                {columns.map((column) => (
                    <TableColumn key={column.name}>{column.name}</TableColumn>
                ))}
                
            </TableHeader>
            <TableBody isLoading={loading || saving} loadingContent={<Spinner label="Loading..." />}>
                {data.map((item: any, idx: number) => (
                    <TableRow key={getItemId ? getItemId(item, idx) : item.id} onClick={() => {
                        if (onClick) {
                            onClick(item)
                        }
                    }}>
                        {columns.map((column, colIdx: number) => {
                            // console.log("column", column, getKeyValue(item.metadata, column.name))
                            return (
                                <TableCell key={column.name}>
                                    {getTableDataComponent(
                                        getKeyValue(item, column.name), 
                                        column.type, 
                                        column.enum, 
                                        (e)=> {
                                            onChange(column.name, idx, e)
                                        })}
                                </TableCell>

                            )
                        }
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    )

}