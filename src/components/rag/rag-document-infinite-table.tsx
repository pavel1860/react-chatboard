import { ClassParametersType } from "../../state/rag-state2";
import { IRagSpaces } from "../../services/chatboard-service";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";

import { useRag } from "../../state/rag-state";
import Link from "next/link";
import { JSONTree } from 'react-json-tree'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import React, { useEffect } from "react";
import { getRagDocumentsApi } from "../../services/rag-service";
import { getTableColumns } from "../../state/metadata-state";



interface RagDocumentTableProps {
    namespace: IRagSpaces
    // metadata: any
    classParameters: ClassParametersType
    pageSize?: number
    sortBy?: string
    // getItemId?: (item: any, idx: number) => string
    // getItemMetadata?: (item: any, key: string, idx: number) => any
    // data: any
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


interface TableColumnType {
    name: string
    type: string
    enum?: string[]
    isSortable?: boolean
    index?: string
}

function TableControls({ columns }: { columns: TableColumnType[] }) {

    const filters = columns.reduce((acc: any, column: TableColumnType) => {
        if (column.index && column.enum) {
            acc.push(
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
                        // selectedKeys={selectedKeys}
                        onAction={(key) => {
                            // @ts-ignore
                            // setParameter(key, !classParameters[key].isVisible)
                        }}
                    >
                        {column.enum.map((item: string) => {
                            return (
                                <DropdownItem key={item}>{item}</DropdownItem>
                            )
                        })}
                    </DropdownMenu>
                </Dropdown>
            )
        }
        return acc

    }, [])


    return (
        <div>
            {filters}
        </div>
    )

}
export default function RagDocumentTable({ namespace, classParameters, onClick, pageSize, sortBy }: RagDocumentTableProps) {

        const [isLoading, setIsLoading] = React.useState(true);
        const [hasMore, setHasMore] = React.useState(false);
        const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({ column: sortBy, direction: "ascending" });

        pageSize = pageSize || 100

        // const getTableColumns = (classParameters: ClassParametersType) => {
        //     const columns = Object.keys(classParameters).reduce((acc: any, field: string) => {
        //         if (classParameters[field].isVisible) {
        //             acc.push({
        //                 name: field,
        //                 type: classParameters[field].type,
        //                 enum: classParameters[field].enum
        //             }

        //             )
        //         }
        //         return acc
        //     }, [])
        //     return columns
        // }

        const [currentPage, setCurrentPage] = React.useState(0);
        const [columns, setColumns] = React.useState<{ name: string, type: string }[]>(() => getTableColumns(classParameters));


        useEffect(() => {
            const newColumns = getTableColumns(classParameters)
            setColumns(newColumns)
        }, [classParameters])


        let list = useAsyncList({
            async load({ signal, cursor, sortDescriptor }) {
                if (cursor) {
                    setIsLoading(false);
                }
                // If no cursor is available, then we're loading the first page.
                // Otherwise, the cursor is the next URL to load, as returned from the previous page.
                // const res = await fetch(cursor || "https://swapi.py4e.com/api/people/?search=", { signal });
                const direction = sortDescriptor ? sortDescriptor.direction === "ascending" ? "asc" : "desc" : undefined;
                const column = sortDescriptor ? sortDescriptor.column : undefined;
                let json = await getRagDocumentsApi(namespace, cursor || 0, pageSize, column, direction);
                setCurrentPage(currentPage + 1);
                setHasMore(json.length !== 0);
                return {
                    items: json,
                    cursor: cursor ? cursor + 1 : 1,
                };
            },
            initialSortDescriptor: sortDescriptor,
        });

        const [loaderRef, scrollerRef] = useInfiniteScroll({ hasMore, onLoadMore: list.loadMore });


        if (columns.length == 0) {
            return (
                <div>No columns to display</div>
            )
        }

        return (
            <div>
                <TableControls columns={columns} />
            
            <Table
                isHeaderSticky
                aria-label="Example table with infinite pagination"
                selectionMode="single"
                sortDescriptor={list.sortDescriptor}
                onSortChange={(sortDescriptor) => {
                    setSortDescriptor(sortDescriptor)
                }}
                baseRef={scrollerRef}
                bottomContent={
                    hasMore ? (
                        <div className="flex w-full justify-center">
                            <Spinner ref={loaderRef} color="white" />
                        </div>
                    ) : null
                }
                classNames={{
                    base: "max-h-[820px] overflow-scroll",
                    table: "min-h-[800px]",
                }}
            >
                <TableHeader>
                    {columns.map((column) => (
                        <TableColumn key={column.name} allowsSorting={column.isSortable}>{column.name}</TableColumn>
                    ))}

                </TableHeader>
                {/* <TableBody>
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
            </TableBody> */}

                <TableBody
                    isLoading={isLoading}
                    items={list.items}
                    loadingContent={<Spinner color="white" />}
                >
                    {(item) => (
                        // <TableRow key={item.name}>
                        //     {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        // </TableRow>
                        <TableRow key={item.id} onClick={() => {
                            if (onClick) {
                                onClick(item)
                            }
                        }}>
                            {columns.map((column, colIdx: number) => {
                                // console.log("column", column, getKeyValue(item.metadata, column.name))
                                return (
                                    <TableCell key={column.name}>{
                                        getTableDataComponent(
                                            getKeyValue(item.metadata, column.name), column.type, column.enum)
                                    }
                                    </TableCell>

                                )
                            }
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
        )

    }