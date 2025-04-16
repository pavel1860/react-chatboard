import { Avatar, Input, Listbox, ListboxItem, Skeleton, Selection, Button } from "@heroui/react"
import { Search } from "lucide-react"
import Link from 'next/link'
import React, { use, useEffect } from "react"
import cc from "classcat"



export interface ListItemProps {
    key: string
    title: string | React.ReactNode
    value: string 
    description?: string | React.ReactNode
    href?: string
}


export interface ListProps {
    loading: boolean
    error?: any
    items?: ListItemProps[]
    selected?: any
    fullHeight?: boolean
    height?: string
    onSelectionChange?: (item: any) => void
    onAddItem?: () => void
    addItemLabel?: string
    selectionStyle?: string
}


export default function List({ items, fullHeight, height, selected, onSelectionChange, addItemLabel, onAddItem, loading, error, selectionStyle }: ListProps): React.ReactElement {

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
                classNames={{
                    base: "max-w-xs",
                    // list: "max-h-[300px] overflow-scroll",
                    list: fullHeight ? "h-full overflow-scroll" : height ? `max-h-[${height}px] overflow-scroll` : "max-h-[300px] overflow-scroll",
                }}

                onSelectionChange={(keys: Selection) => {
                    //@ts-ignore
                    onSelectionChange && onSelectionChange(keys.currentKey)
                    //@ts-ignore
                    setSelectedItem(keys.currentKey)
                }}
                items={items}
                variant="flat"
            // selectionMode="single"
            >
                {(item) => (
                    <ListboxItem
                        key={item.key}
                        href={item.href}
                        title={item.title}
                        description={item.description}   
                        classNames={{
                            base: cc({
                                [currSelectionStyle]: selectedItem === item.key
                            })
                        }}
                        showDivider
                    // shouldHighlightOnFocus
                    >
                        <span className="text-small">{item.value}</span>
                    </ListboxItem>
                )}
            </Listbox>
        </div>
    )
}