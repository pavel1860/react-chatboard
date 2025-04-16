//@ts-nocheck
import { IRagSpaces } from "../../services/chatboard-service";
import { JSONTree } from 'react-json-tree'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@heroui/react";
import React, { useEffect } from "react";
import { ClassParametersType } from "../../../src/state/metadata-state";



interface RagDocumentTableProps {
    namespace: IRagSpaces
    metadata: any
    classParameters: ClassParametersType
    getItemId?: (item: any, idx: number) => string
    getItemMetadata?: (item: any, key: string, idx: number) => any
    data: any
    onClick?: (e: any) => void
}




const EnumDropDown = ({ value, enumValues }: { value: string, enumValues: string[] }) => {

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="light"
                >
                    {value}
                </Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
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



const getTableDataComponent = (value: any, type: string, enumValues?: string[]) => {

    if (type == 'object' || type == 'array') {
        return <JSONTree data={value} />
    }
    if (enumValues) {
        return <EnumDropDown value={value} enumValues={enumValues} />
    }
    return value

}



export default function RagDocumentTable({ namespace, metadata, classParameters, data, onClick, getItemId, getItemMetadata }: RagDocumentTableProps) {

    const [isLoading, setIsLoading] = React.useState(true);
    const [hasMore, setHasMore] = React.useState(false);

    const getTableColumns = (classParameters: ClassParametersType) => {
        const columns = Object.keys(classParameters).reduce((acc: any, field: string) => {
            if (classParameters[field].isVisible) {
                acc.push({
                    name: field,
                    type: classParameters[field].type,
                    enum: classParameters[field].enum
                }

                )
            }
            return acc
        }, [])
        return columns
    }


    const [columns, setColumns] = React.useState<{ name: string, type: string }[]>(() => getTableColumns(classParameters));


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
                                <TableCell key={column.name}>{
                                    getTableDataComponent(
                                        getItemMetadata ? getItemMetadata(item, column.name, colIdx) : getKeyValue(item.metadata, column.name), column.type, column.enum)
                                }
                                </TableCell>

                            )
                        }
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