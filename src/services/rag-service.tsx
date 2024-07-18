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




export function useRagDocumentsEndpoint(namespace: string | null, limit: number=10, offset: number = 0): EndpointHook<any>{
    const url = `/chatboard/rag_documents/${namespace}`   
    const { data, error, isLoading } = useSWR(namespace ? [url, namespace, limit, offset] : null, ([url, namespace, limit, offset]) => fetcher(url, { limit, offset }));

    return { 
        data,
        error,
        isLoading
    }
}
