import { ClassParametersType } from "../../../state/rag-state2";
import { IRagSpaces } from "../../../services/chatboard-service";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";

import { useRag } from "../../../state/rag-state";
import Link from "next/link";
import { JSONTree } from 'react-json-tree'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useRunRagListExample } from "../exampleHook";



interface RagDocumentTableProps {
    ragNamespace: string
    promptName: string
    inputField: string
    getItemId?: (item: any, idx: number) => string
    getItemMetadata?: (item: any, key: string, idx: number) => any
    onClick?: (e: any) => void
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



export default function IOLabelTable({ promptName, ragNamespace, onClick, getItemId, getItemMetadata, inputField }: RagDocumentTableProps) {

    const [isLoading, setIsLoading] = React.useState(true);
    const [hasMore, setHasMore] = React.useState(false);


    const {
        data,
        columns,
        onChange,
    } = useRunRagListExample(promptName, ragNamespace, inputField)


    if (columns.length == 0) {
        return (
            <div>No columns to display</div>
        )
    }

    return (
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
            <TableBody>
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

    )

}