import { Avatar, Input, Listbox, ListboxItem, Skeleton, Selection } from "@nextui-org/react"
import { Search } from "lucide-react"
import Link from 'next/link'
import React from "react"



export interface ListItemProps {
    key: string
    title: string
    value: string
    description?: string
    href?: string
}


export interface ListProps {
    loading: boolean
    error?: any
    items?: ListItemProps[]
    selected?: any
    onSelectionChange?: (item: any) => void
}


export default function List({items, selected, onSelectionChange, loading, error}: ListProps): React.ReactElement {

    const [selectedItem, setSelectedItem] = React.useState<any>(selected)
    
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
            {/* <h1>Clients</h1> */}
            {selectedItem}
            <Listbox
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={[selected]}
                topContent={<Input
                    label="Search"
                    isClearable
                    radius="lg"

                    startContent={
                        <Search color="gray" />
                    }

                />}
                classNames={{
                    base: "max-w-xs",
                    list: "max-h-[300px] overflow-scroll",
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
                        
                        // className={selectedItem === item.key ? "bg-slate-300" : ''} 
                        // classNames={selectedItem === item.key ?{
                        //     base: "bg-slate-300"
                        // }: {}}
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