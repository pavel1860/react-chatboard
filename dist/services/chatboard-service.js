import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher } from "./fetcher";
import { build_run_tree } from '../types/run-tree';
import { useEffect, useState } from 'react';
export async function postRequest(endpoint, { arg }) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify(arg) // Convert the data to JSON format
    };
    // const res = await fetch(`${process.env.NEXT_PUBLIC_CHATBOARD_BACKEND_URL}/chatboard/${endpoint}`, options)
    const res = await fetch(`/promptboard/${endpoint}`, options);
    if (!res.ok) {
        throw new Error("Failed to fetch chatboard metadata.");
    }
    return await res.json();
}
export function useChatboardMetadata() {
    const url = `/promptboard/metadata`;
    const { data, error, isLoading } = useSWR(url, (url) => fetcher(url, {}));
    return {
        data,
        error,
        isLoading
    };
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
export function useAssetPartitionService(asset, partition) {
    // const { data, error, isLoading } = useSWR(partition ? 'get_asset_partition' : null, (url: string) => fetcher(url, { asset, field: "phone_number", partition }));
    const { data, error, isLoading } = useSWR(asset && partition ?
        ['promptboard/get_asset_partition', asset, partition] : null, ([url, asset, partition]) => fetcher(url, {
        asset,
        field: "metadata.phone_number",
        partition
    }));
    return {
        data,
        error,
        isLoading
    };
}
export function useProfilePartitionService(profile, partition) {
    const { data, error, isLoading } = useSWR(profile ? 'promptboard/get_profile_partition' : null, (url) => fetcher(url, { profile, partition }));
    return {
        data,
        error,
        isLoading
    };
}
export function useProfileService() {
    const { data, error, isLoading } = useSWR('get_profile', (url) => fetcher(url, {}));
    return {
        data,
        error,
        isLoading
    };
}
export function useAssetDocumentsService(asset) {
    const { data, error, isLoading } = useSWR('get_asset_documents', (url) => fetcher(url, { asset }));
    return {
        data,
        error,
        isLoading
    };
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
export function useGetRuns(limit, offset, runNames) {
    const fetchRuns = (url) => fetcher(url, { limit, offset, runNames });
    const { data, error, isLoading } = useSWR('ai/tracing/get_runs', fetchRuns);
    return {
        data,
        error,
        isLoading
    };
}
export function useGetTree(id) {
    const { data, error, isLoading } = useSWR(id ? ['ai/tracing/get_run_tree', id] : null, ([url, id]) => fetcher(url, { run_id: id }));
    const [runTree, setRunTree] = useState(null);
    useEffect(() => {
        if (data) {
            setRunTree(build_run_tree(data));
        }
    }, [data]);
    return {
        // runTree: data ? build_run_tree(data) : null,
        runTree,
        error: error,
        loading: isLoading
    };
}
export function useAddExampleService() {
    const { data, error, trigger, isMutating } = useSWRMutation('upsert_rag_document', postRequest);
    return {
        data,
        addExample: (input, output, namespace, id) => {
            trigger({
                namespace,
                input,
                output,
                id,
            });
        },
        error,
        loading: isMutating
    };
}
export function useDeleteExample() {
    const deleteExample = async () => { };
    const deleteExampleStatus = async () => { };
    return [deleteExample, deleteExampleStatus];
}
export function useEditExampleService() {
    const editExample = async () => { };
    const editExampleStatus = async () => { };
    return [editExample, editExampleStatus];
}
export function useGetExamples() {
    const getExamples = async () => {
    };
    const examplesStatus = async () => {
    };
    return [getExamples, examplesStatus];
}
export function useGetNamespaces() {
    // const res = await getRagDocumentsApi
    // return {}
    const fetchMetadata = (url) => fetcher(url, {});
    const { data, error, isLoading } = useSWR('/promptboard/metadata', fetchMetadata);
    return {
        data,
        error,
        isLoading
    };
}
//# sourceMappingURL=chatboard-service.js.map