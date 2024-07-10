import { 
    AssetItem, 
    IAssetClass, 
    IError, 
    IParameter, 
    IProfileClass, 
    useAssetDocumentsService, 
    useAssetPartitionService, 
    useProfilePartitionService
 } from "../services/chatboard-service";
import React, { use, useEffect } from "react";
import { useChatboard } from "./chatboard-state";
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';






export const useAssetMetadata = (assetName: string) => {

    const [metadata, setMetadata] = React.useState<IAssetClass | null>(null)

    const chatboard = useChatboard()

    useEffect(()=>{
        if (chatboard?.metadata?.assets?.length && metadata == null){
            const asset = chatboard.metadata.assets.find(asset=>asset.name==assetName)
            if (!asset){
                throw new Error("Asset not found");                
            }
            setMetadata(asset)
        }
    }, [chatboard.metadata])
    
    return metadata
}



export const useAssetPartition = (assetName: string, metadata: IAssetClass | null) => {
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const chatboard = useChatboard()

    const {
        isLoading: assetLoading,
        data: assetList,
        error: assetError
    } = useAssetPartitionService(assetName, searchParams.get('partition'))


    const {
        isLoading: profileLoading,
        data: profileData,
        error: profileError
    } = useProfilePartitionService(searchParams.get('profile'), searchParams.get('partition'))


    useEffect(()=>{

    }, [metadata, searchParams.get('partition')])


    const getPartitions = () => {
        return metadata?.asset_class.metadata_class.function.parameters.properties
    }

    const addProfileFilter = (profile: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('profile', profile)
        replace(`${pathname}?${params.toString()}`);
    }

    const removeProfileFilter = (profile: string) => {

    }

    const addPartitionFilter = (partition: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('partition', partition)
        replace(`${pathname}?${params.toString()}`);
    }

    const removePartitionFilter = (partition: string) => {

    }

    return {        
        profiles: chatboard.metadata.profiles,        
        profileData,
        profileLoading,
        profileError,
        assetList,
        assetLoading,
        assetError,  
        partitions: getPartitions(),
        addPartitionFilter,
        removePartitionFilter,
        addProfileFilter,
        removeProfileFilter
    }
}




interface AssetContextType<I, O, M> {
    metadata: IAssetClass | null
    assetList: AssetItem<I, O, M>[] | null 
    assetLoading: boolean
    assetError: IError | null
    partitions: {[key: string] :IParameter} | undefined
    profiles: IProfileClass[]
    profileData: any[]
    profileLoading: boolean
    profileError: IError | null
    addPartitionFilter: (partition: string) => void
    removePartitionFilter: (partition: string) => void
    addProfileFilter: (profile: string) => void
    removeProfileFilter: (profile: string) => void    
}

const AssetContext = React.createContext<AssetContextType<any, any, any>>({
    metadata: null,
    assetList: null,
    partitions: {},
    profiles: [],
    addPartitionFilter: () => {},
    removePartitionFilter: () => {},
    addProfileFilter: () => {},
    removeProfileFilter: () => {},
    profileData: [],
    profileLoading: false,
    profileError: null,
    assetLoading: false,
    assetError: null
});






export const AssetProvider = ({children, assetName}: {children: any, assetName:string}) => {




    
    const metadata = useAssetMetadata(assetName)


    const {  
        profiles,
        partitions,
        profileData,
        profileLoading,
        profileError,
        assetList,
        assetLoading,
        assetError,  
        addPartitionFilter,
        removePartitionFilter,
        addProfileFilter,
        removeProfileFilter
    } = useAssetPartition(assetName, metadata)


    // const {
        
    // } = useProfilePartitionService(pro)

    console.log("###########", partitions)
    

    
    // const {
    //     data: assetList,
    //     error,
    //     isLoading,
    // } = useAssetDocumentsService(assetName)


    
    // const [partitionFilters, setPartitionFilters] = React.useState<string[]>([])
    // const setAsset = (metadata: IAssetClass) => {
    //     setMetadata(metadata)
    // }

    // useEffect(()=>{
    //     if (data){
    //         setAssetList(data)
    //     }
    // }, [data])
    

    
    return (
        <AssetContext.Provider value={{ 
            metadata, 
            partitions,
            profiles,
            profileData,
            profileLoading,
            profileError,
            addPartitionFilter,
            removePartitionFilter,
            addProfileFilter,
            removeProfileFilter,            
            assetList,
            assetLoading,
            assetError,
            //@ts-ignore
        }} displayName="asset-context">
            {children}
        </AssetContext.Provider>
    )
}




export const useAsset = () => {
    return React.useContext(AssetContext)
}



