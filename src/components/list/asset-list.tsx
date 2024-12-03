import { formatDateTime } from "../../util/time"
import { Avatar, Input, Listbox, ListboxItem, Skeleton, Selection, Badge, Link, Tabs, Tab } from "@nextui-org/react"
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
    onSelectionChange?: (key: string) => void
}


export default function AssetList<T extends ListItem>({ items, loading, error, itemComponent, onSelectionChange }: AssetListProps<T>): React.ReactElement {

    const {
        itemList,
        search,
        setSearch,
        orderBy,
        setOrderBy,
    } = useAssetList(items)

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
                    />
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
                    </Tabs>
                </div>}
            classNames={{
                // base: "max-w-xs",
                // list: "max-h-[300px] overflow-scroll",
                list: "max-h-full overflow-scroll",
            }}

            onSelectionChange={(keys: Selection) => {                
                onSelectionChange && onSelectionChange(keys.anchorKey)
            }}
            items={itemList}
            variant="flat"
            selectionMode="single"
        >
            {(item) => (
                <ListboxItem 
                    key={`${item.key}`} >
                    <div className="flex gap-2 items-center w-full relative py-1">
                        {itemComponent(item)}
                    </div>
                    {/* </Link> */}
                </ListboxItem>
            )}
        </Listbox>
        // </div>
    )
}