import useSWR from "swr";
import { EndpointHook, fetcher } from "./fetcher";




export function useRagNamespacesEndpoint(): EndpointHook<any>{
    const url = `/api/chatboard/rag_namespaces`
    const { data, error, isLoading } = useSWR(url, (url: string) => fetcher(url, {}));

    return {
        data,
        error,
        isLoading
    }
}




export function useRagDocumentsEndpoint(namespace: string | null): EndpointHook<any>{
    const url = `/api/chatboard/rag_documents`   
    const { data, error, isLoading } = useSWR(namespace ? [url, namespace] : null, ([url, namespace]) => fetcher(url, { namespace }));

    return { 
        data,
        error,
        isLoading
    }
}
