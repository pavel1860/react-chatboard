import { formatDateTime } from "../../util/time"
import { Avatar, Input, Listbox, ListboxItem, Skeleton, Selection, Badge, Link, Tabs, Tab, Button } from "@heroui/react"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"



export interface ListItem {
    datetime: Date
    key: string
    text: string
}



function useAssetList<T extends ListItem>(items: T[]) {

    // const {
    //     clientService
    // } = useBotApi()

    const [limit, setLimit] = useState<number>(50)
    const [offset, setOffset] = useState<number>(0)
    const [orderBy, setOrderBy] = useState("last")
    const [search, setSearch] = useState<string>("")

    

    // const [items, setClients] = useState<ClientType[]>([])

    const sortingFunc = (a: T, b: T) => {
        console.log("ORDER BY", orderBy)
        if (!a.datetime ){
            return 1
        } 
        if (!b.datetime){
            return -1
        }
        if (orderBy === "last") {            
            return b.datetime.getTime() - a.datetime.getTime()
        } else if (orderBy === "oldest") {
            return a.datetime.getTime() - b.datetime.getTime()
        } else {
            return b.datetime.getTime() - a.datetime.getTime()
        }        
    }

    const filterFunc = (client: T) => {
        if (search === "") {
            return true
        }
        return client.key.toLowerCase().includes(search.toLowerCase())
    }


    return {
        itemList: items.sort(sortingFunc).filter(filterFunc),
        search,
        setSearch,
        orderBy,
        setOrderBy,        
    }

}





interface AssetListProps<T extends ListItem> {
    items: T[]
    loading: boolean
    error?: any
    itemComponent: (item: T) => React.ReactElement
    onAddItem?: () => void
    isSearchable?: boolean
    onSelectionChange?: (key: string) => void
    selectionMode?: "none" | "single" | "multiple"
    selectedKey?: string | null
}


export default function AssetList<T extends ListItem>({ items, isSearchable, onAddItem: onNewItem, loading, error, itemComponent, onSelectionChange, selectedKey, selectionMode }: AssetListProps<T>): React.ReactElement {

    const {
        itemList,
        search,
        setSearch,
        orderBy,
        setOrderBy,
    } = useAssetList(items)

    const [selectedItem, setSelectedItem] = useState<T | null>(null)

    if (loading) {
        return (<Skeleton className="flex rounded-full w-12 h-12">
            <div className="h-24 rounded-lg bg-secondary"></div>
        </Skeleton>
        )
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <Listbox
            topContent={
                <div>
                    <div className="flex gap-2 items-center">
                        {isSearchable && 
                                <Input
                                    // label="Search"
                                    placeholder="Search"
                                    isClearable
                                    radius="sm"
                                    value={search}
                                    onChange={(e) => {
                                        console.log(e.target.value)
                                        setSearch(e.target.value)
                                    }}
                                    onClear={() => { setSearch("") }}
                                    startContent={
                                        <Search color="gray" />
                                    }
                                />}
                        {onNewItem && 
                                <>
                                    <Button
                                        color="primary"
                                        // variant="light"
                                        size="sm"
                                        onPress={onNewItem}
                                    >
                                        Add
                                    </Button>
                                </>}
                    </div>
                    <div>                    
                        {isSearchable && 
                                <Tabs
                                    aria-label="Tabs order"
                                    radius="full"
                                    variant="underlined"
                                    color="primary"
                                    selectedKey={orderBy}
                                    onSelectionChange={(key) => {
                                        setOrderBy(key as any)
                                    }}
                                >
                                    <Tab key="last" title="last" />
                                    <Tab key="oldest" title="oldest" />
                                </Tabs>}
                    </div>
                </div>}
            classNames={{
                // base: "max-w-xs",
                // list: "max-h-[300px] overflow-scroll",
                list: "max-h-full overflow-scroll",
            }}

            onSelectionChange={(keys: Selection) => { 
                //@ts-ignore               
                onSelectionChange && onSelectionChange(keys.anchorKey)
            }}
            items={itemList}
            variant="flat"
            // selectionMode="single"
            selectionMode={selectionMode ? selectionMode : "none"}
        >
            {(item) => (
                <ListboxItem 
                    key={`${item.key}`} 
                    onClick={() => {
                        if (selectionMode == undefined || selectionMode === "none"){
                            onSelectionChange && onSelectionChange(item.key)
                        }                        
                    }}
                >
                    {/* <div className="flex gap-2 items-center w-full relative py-1"> */}
                    <div className={`flex gap-2 items-center w-full relative py-1 ${selectedItem ? "bg-slate-300" : ""}`}>
                        {itemComponent(item)}
                    </div>
                    {/* </Link> */}
                </ListboxItem>
            )}
        </Listbox>
        // </div>
    )
}