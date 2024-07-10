import useSWR from "swr";
import React from "react";




export interface EndpointHook<T> {
    data: T
    error: any
    isLoading: boolean
}


function replaceParams(url: string , params: {[key: string]: any}) {
    return url.replace(/{(\w+)}/g, function(match, key) {
        return typeof params[key] !== 'undefined' ? params[key] : match;
    });
}




export async function fetcher(endpoint: string, data: any){
    const params = new URLSearchParams()
    Object.keys(data).forEach((k: string) => {
        params.set(k, data[k])
    })
    const res = await fetch(`/api/${endpoint}?${params.toString()}`)
    if (!res.ok){
        const error = new Error("Failed to fetch chatboard metadata.") as any;
        error.info = await res.json()
        error.status = res.status
        throw error
    }
    return await res.json()
}




export function useEndpoint(phoneNumber: string | null, limit: number = 10, offset: number = 0): EndpointHook<any> {
    const url = `client/${phoneNumber}/chat`
    const { data, error, isLoading } = useSWR(
        phoneNumber ? [url, phoneNumber, limit, offset] : null,
        ([url, phoneNumber, limit, offset]) =>
            fetcher(url, { phone_number: phoneNumber, limit, offset })
    );
    return {
        data,
        error,
        isLoading
    }
}
