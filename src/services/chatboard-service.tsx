import useSWR, {useSWRConfig} from 'swr';
import useSWRMutation from 'swr/mutation';
import { EndpointHook, fetcher } from "./fetcher";


export interface IProperty {

}

// export interface IParameter {
//     type: string
//     properties?: {[key: string]: { type: string}}
// }
export interface IParameter {
    type: "string" | "number" | "object";
    properties?: { [key: string]: IParameter };
}


export interface MetadataClass {
    type: string
    function: {
        name: string
        description: string
        // parameters: { [key: string]: IParameter }
        parameters: IParameter
    }
}

export interface IRagSpaces {
    namespace: string
    metadata_class: MetadataClass
}


// {
//     "type":"function",
//     "function":{
//        "name":"UserMessage",
//        "description":"",
//        "parameters":{
//           "type":"object",
//           "properties":{
//              "user_message":{
//                 "type":"string"
//              }
//           },
//           "required":[
//              "user_message"
//           ]
//        }
//     }
//  }

export interface IError {
    message: string
    stack: string
}


export interface IOAssetClass {
    type: string
    function: {
        name: string
        description: string
        parameters: { [key: string]: IParameter }
    }
}


export interface AssetItem<I, O, M> {
    id: string
    input: I
    output: O
    metadata: M    
}


export interface IAssetClass {
    name: string
    asset_class: {
        input_class: MetadataClass
        output_class: MetadataClass
        metadata_class: MetadataClass
    }
}


export interface IProfileClass {
    name: string
    profile_fields: IParameter
}




export interface IMetadataResponse {
    rag_spaces: IRagSpaces[]
    assets: IAssetClass[]
    profiles: IProfileClass[]
}




export async function postRequest(endpoint: string, { arg }: any ){
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify(arg) // Convert the data to JSON format
    };
    // const res = await fetch(`${process.env.NEXT_PUBLIC_CHATBOARD_BACKEND_URL}/chatboard/${endpoint}`, options)
    const res = await fetch(`/api/chatboard/${endpoint}`, options)
    if (!res.ok){
        throw new Error("Failed to fetch chatboard metadata.");        
    }
    return await res.json()
}



export function useChatboardMetadata(): EndpointHook<any> {
    const url = `/api/chatboard/metadata`
    const { data, error, isLoading } = useSWR(url, (url: string) => fetcher(url, {}))

    return {
        data,
        error,
        isLoading
    }
}



// export async function getChatboardMetadata(cb: any) {
//     // const res = await fetch(`${process.env.NEXT_PUBLIC_CHATBOARD_BACKEND_URL}/chatboard/metadata`)
//     const res = await fetch(`/api/chatboard/metadata`)
//     if (!res.ok){
//         throw new Error("Failed to fetch chatboard metadata.");        
//     }
//     cb((await res.json()).metadata as IMetadataResponse)
// }



// export async function getRagDocumentsApi(namespace: string, cb: any){
//     const options = {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json' // Specify the content type
//         },
//         body: JSON.stringify({
//             namespace
//         }) // Convert the data to JSON format
//     };
//     // const res = await fetch(`${process.env.NEXT_PUBLIC_CHATBOARD_BACKEND_URL}/chatboard/get_rag_document`, options)
//     const res = await fetch(`/api/chatboard/get_rag_document`, options)
//     if (!res.ok){
//         throw new Error("Failed to fetch chatboard metadata.");        
//     }
//     cb(await res.json())
// }



export function useAssetPartitionService(asset: string, partition: string | null){
    // const { data, error, isLoading } = useSWR(partition ? 'get_asset_partition' : null, (url: string) => fetcher(url, { asset, field: "phone_number", partition }));
    const { data, error, isLoading } = useSWR(asset && partition ? 
        ['get_asset_partition', asset, partition] : null, 
        ([url, asset, partition]) => fetcher(url, { 
            asset, 
            field: "phone_number", 
            partition 
        }));

    return {
        data,
        error,
        isLoading
    }
}


export function useProfilePartitionService(profile: string | null, partition: string | null) {
    const { data, error, isLoading} = useSWR(profile ? 'get_profile_partition' : null, (url: string) => fetcher(url, { profile, partition }));

    return {
        data,
        error,
        isLoading
    }
}




export function useProfileService() {
    const { data, error, isLoading} = useSWR('get_profile', (url: string) => fetcher(url, { }));

    return {
        data,
        error,
        isLoading
    }
}


export function useAssetDocumentsService(asset: string){

    const { data, error, isLoading} = useSWR('get_asset_documents', (url: string) => fetcher(url, { asset }));

    return {
        data,
        error,
        isLoading
    }
}


// export async function fetcher(endpoint: string, data: any){
//     const params = new URLSearchParams()
//     Object.keys(data).forEach((k: string) => {
//         params.set(k, data[k])
//     })
//     // const res = await fetch(`${process.env.NEXT_PUBLIC_CHATBOARD_BACKEND_URL}/chatboard/${endpoint}?${params.toString()}`)
//     const res = await fetch(`/api/chatboard/${endpoint}?${params.toString()}`)
//     if (!res.ok){
//         throw new Error("Failed to fetch chatboard metadata.");
//     }
//     return await res.json()
// }



export function useGetRuns(limit: number, offset: number, runNames: string[]) : EndpointHook<any>{
    const fetchRuns = (url: string) => fetcher(url, { limit, offset, runNames });
    const { data, error, isLoading } = useSWR('get_runs', fetchRuns);
    
    return {
        data,
        error,
        isLoading
    }
}


export function useGetTree(id: string){

    const fetchTree = (url: string) => fetcher(url, { run_id: id });
    const { data, error, isLoading } = useSWR('get_run_tree', fetchTree);

    return {
        runTree: data,
        error: error,
        loading: isLoading
    }
}

export function useAddExampleService(){
    
    const { data, error, trigger, isMutating } = useSWRMutation('upsert_rag_document', postRequest)

    return {
        data,
        addExample: (input: any, output: any, namespace: string, id?: string | number) => {
            trigger({
                namespace,
                input,
                output,
                id,
            } as any)
        },
        error,
        loading: isMutating
    }

}


export function useDeleteExample(){
    const deleteExample = async () => {}
    const deleteExampleStatus = async () => {}
    return [deleteExample, deleteExampleStatus] as const
}

export function useEditExampleService(){

    const editExample = async () => {}
    const editExampleStatus = async () => {}
    return [editExample, editExampleStatus] as const
}

export function useGetExamples(){

    
    const getExamples = async () => {
    }
    const examplesStatus = async () => {        
    }
    return [getExamples, examplesStatus] as const
}


export function useGetNamespaces() {
    // const res = await getRagDocumentsApi
    // return {}
    const fetchMetadata = (url: string) => fetcher(url, {});

    const { data, error, isLoading } = useSWR('metadata', fetchMetadata);

    return {
        data,
        error,
        isLoading
    }
}