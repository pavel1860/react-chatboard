import useSWR from "swr";
import { EndpointHook, fetcher, fetchWithResponse, PaginatableEndpointHook } from "./fetcher";
import useSWRInfinite from 'swr/infinite'





export function useRagNamespacesEndpoint(): EndpointHook<any> {
    const url = `/api/chatboard/rag_namespaces`
    const { data, error, isLoading } = useSWR(url, (url: string) => fetcher(url, {}));


    return {
        data,
        error,
        isLoading
    }
}




export async function getRagDocumentsApi(namespace: string, page: number, pageSize: number=10, sortField: string | undefined = undefined, sortOrder: string | undefined = undefined) {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('pageSize', pageSize.toString())
    if (sortField) {
        params.set('sortField', sortField)
    }
    if (sortOrder) {
        params.set('sortOrder', sortOrder)
    }
    const res = await fetch(`/api/chatboard/rag_documents/${namespace}?${params.toString()}`)
    // const res = await fetch(`/api/chatboard/rag_documents/${namespace}?page=${page}&pageSize=${pageSize}`)
    if (!res.ok){
        const error = new Error("Failed to fetch chatboard metadata.") as any;
        error.info = await res.text()
        error.status = res.status
        throw error
    }
    let json = await res.json()
    return json
    return {
        results: json,
        next: json.length ? `/chatboard/rag_documents/${namespace}?page=${page+1}&pageSize=${pageSize}` : null
    } 
}


export function useRagDocumentsEndpoint(namespace: string | null, pageSize: number = 10, pageIndex: number = 0): PaginatableEndpointHook<any> {
    // const url = `/chatboard/rag_documents/${namespace}?page=${pageIndex}&pageSize=${pageSize}`
    const url = `/chatboard/rag_documents/${namespace}`
    const { data, error, isLoading } = useSWR(namespace ? [url, namespace, pageSize, pageIndex] : null, ([url, namespace, limit, offset]) => fetcher(url, { pageSize, page: pageIndex }));
    // const getKey = (pageIndex: number, previousPageData: any) => {
    //     if (previousPageData && !previousPageData.length) return null // reached the end
    //     return `/chatboard/rag_documents/${namespace}?page=${pageIndex}&pageSize=${pageSize}`                    // SWR key
    // }

    // const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite(
    //     getKey, fetchWithResponse
    // )

    // const nextPage = (cb) => {
    //     setSize(size + 1)
    //     cb()    
    // }

    return {
        data: data ? data.flat() : data,
        error,
        isLoading,
        // page: size,
        // setPage: setSize,
    }
}





export async function addDocumentEndpoint(namespace: string, input: any, output: any, id?: string) {
    return await fetch(`/api/chatboard/rag_documents/upsert_rag_document`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            namespace,
            input,
            output,
            id: id
        })
    })
}

// export function useRagDocumentsEndpoint(namespace: string | null, pageSize: number = 10, pageIndex: number = 0): PaginatableEndpointHook<any> {
//     // const { data, error, isLoading } = useSWR(namespace ? [url, namespace, limit, offset] : null, ([url, namespace, limit, offset]) => fetcher(url, { limit, offset }));
//     const getKey = (pageIndex: number, previousPageData: any) => {
//         if (previousPageData && !previousPageData.length) return null // reached the end
//         return `/chatboard/rag_documents/${namespace}?page=${pageIndex}&pageSize=${pageSize}`                    // SWR key
//     }

//     const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite(
//         getKey, fetchWithResponse
//     )

//     const nextPage = (cb) => {
//         setSize(size + 1)
//         cb()    
//     }

//     return {
//         data: data ? data.flat() : data,
//         error,
//         isLoading,
//         page: size,
//         setPage: setSize,
//     }
// }

