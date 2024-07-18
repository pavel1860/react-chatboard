import { ClassParametersType } from "@/src/state/rag-state2";
import { IRagSpaces } from "../../services/chatboard-service";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import {useAsyncList} from "@react-stately/data";

import { useRag } from "../../state/rag-state";
import Link from "next/link";
import { JSONTree } from 'react-json-tree'
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import React, { useEffect } from "react";



interface RagDocumentTableProps {
    namespace: IRagSpaces
    metadata: any
    classParameters: ClassParametersType
    data: any
    onClick?: (e: any) => void
}



const getTableDataComponent = (value: any, type: string) => {

    if (type == 'object' || type == 'array'){
        return <JSONTree data={value} />
    }
    return value

}



export default function RagDocumentTable({ namespace, metadata, classParameters, data, onClick }: RagDocumentTableProps) {

    const [isLoading, setIsLoading] = React.useState(true);
    const [hasMore, setHasMore] = React.useState(false);

    const getTableColumns = (classParameters: ClassParametersType) => {
        const columns = Object.keys(classParameters).reduce((acc: any, field: string) => {
            if (classParameters[field].isVisible){
                acc.push({
                    name: field,
                    type: classParameters[field].type
                }
                    
                )
            }
            return acc
        }, [])
        return columns
    }
    
    
    const [columns, setColumns] = React.useState<{name: string, type: string}[]>(() => getTableColumns(classParameters));


    useEffect(() => {
        const newColumns = getTableColumns(classParameters)
        setColumns(newColumns)
    }, [classParameters])


    // let list = useAsyncList({
    //     async load({ signal, cursor }) {

    //         if (cursor) {
    //             setIsLoading(false);
    //         }

    //         // If no cursor is available, then we're loading the first page.
    //         // Otherwise, the cursor is the next URL to load, as returned from the previous page.
    //         const res = await fetch(cursor || "https://swapi.py4e.com/api/people/?search=", { signal });
    //         let json = await res.json();

    //         setHasMore(json.next !== null);

    //         return {
    //             items: json.results,
    //             cursor: json.next,
    //         };
    //     },
    // });

    // const [loaderRef, scrollerRef] = useInfiniteScroll({ hasMore, onLoadMore: list.loadMore });

    
    if (columns.length == 0){
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
                base: "max-h-[520px] overflow-scroll",
                table: "min-h-[400px]",
            }}
        >
            <TableHeader>
                {columns.map((column) => (
                    <TableColumn key={column.name}>{column.name}</TableColumn>
                ))}
                {/* <TableColumn key="name">Name</TableColumn>
                <TableColumn key="height">Height</TableColumn>
                <TableColumn key="mass">Mass</TableColumn>
                <TableColumn key="birth_year">Birth year</TableColumn> */}
            </TableHeader>
            <TableBody>
                {data.map((item: any) => (
                    <TableRow key={item.id} onClick={()=>{
                        if (onClick){
                            onClick(item)
                        }
                    }}>
                        {columns.map((column) => {
                            // console.log("column", column, getKeyValue(item.metadata, column.name))
                            return (
                                <TableCell key={column.name}>{getTableDataComponent(getKeyValue(item.metadata, column.name), column.type)}</TableCell>
                                
                        )}
                    )}
                </TableRow>                    
                ))}
            </TableBody>

            {/* <TableBody
                isLoading={isLoading}
                items={list.items}
                loadingContent={<Spinner color="white" />}
            >
                {(item) => (
                    <TableRow key={item.name}>
                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody> */}
        </Table>

    )

}