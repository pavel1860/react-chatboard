import { Avatar, Input, Listbox, ListboxItem, Skeleton, Selection, Button } from "@nextui-org/react"
import { Search } from "lucide-react"
import Link from 'next/link'
import React, { use, useEffect } from "react"
import cc from "classcat"

// import { type li} from "@nextui-org/listbox";

export interface ListItemProps {
    key: string
    title: string | React.ReactNode
    value: string 
    description?: string | React.ReactNode
    href?: string
}


export interface ListProps<T> {
    loading: boolean
    error?: any
    items?: T[]
    selected?: any
    fullHeight?: boolean
    height?: string
    onSelectionChange?: (item: any) => void
    onAddItem?: () => void
    addItemLabel?: string
    selectionStyle?: string
    children?: (item: T, idx: number) => React.ReactNode
    ariaLabel?: string
}


export default function List<T>({ items, fullHeight, height, selected, onSelectionChange, addItemLabel, onAddItem, loading, error, selectionStyle, children, ariaLabel = "List" }: ListProps<T>): React.ReactElement {

    const [selectedItem, setSelectedItem] = React.useState<any>(selected)
    const [currSelectionStyle, setCurrSelectionStyle] = React.useState<string>(selectionStyle || "bg-slate-300")

    useEffect(() => {
        setCurrSelectionStyle(selectionStyle || "bg-slate-300")
    }, [selectionStyle])

    useEffect(() => {
        setSelectedItem(selected)
    }, [selected])

    if (loading || !items) {
        return (<Skeleton className="flex rounded-full w-12 h-12">
            <div className="h-24 rounded-lg bg-secondary"></div>
        </Skeleton>
        )
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }



    return (
        <div>
            <Listbox
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={[selected]}
                aria-label={ariaLabel}
                topContent={
                    <div className="">
                        {onAddItem && 
                            <Button 
                                variant="ghost" 
                                color="primary" 
                                size="sm" 
                                onClick={()=>{
                                    onAddItem()
                                }}
                            > {addItemLabel || "Add"}</Button>}
                        <Input
                            label="Search"
                            isClearable
                            radius="lg"

                            startContent={
                                <Search color="gray" />
                            }

                        />
                        
                    </div>
                }


                onSelectionChange={(key: Selection) => {
                    //@ts-ignore
                    onSelectionChange && onSelectionChange(key.currentKey)
                    //@ts-ignore
                    setSelectedItem(key)
                }}
                variant="flat"
            >
                {items?.map((item: T, idx: number) => (
                    children?.(item, idx)
                ))}
            </Listbox>
        </div>
    )
}