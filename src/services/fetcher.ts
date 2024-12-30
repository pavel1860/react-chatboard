import useSWR, { Fetcher } from "swr";
import React from "react";
import useSWRMutation, { MutationFetcher } from "swr/mutation";
import useSWRInfinite from "swr/infinite";
import { useModelEnv } from "../state/model-env";



export interface ServiceHook<T> {
    data: T
    error: any
    isLoading: boolean
    mutate?: any
    refetch?: () => void
}


export interface ServiceMutationHook<T> extends ServiceHook<T> {
    mutate: any
}


export interface ServiceInfiniteHook<T> extends ServiceMutationHook<T>{
    size: number
    setSize: (size: number) => void
}


export interface EndpointHook<T> {
    data: T
    error: any
    isLoading: boolean
}


export interface PaginatableEndpointHook<T> extends EndpointHook<T> {
    page: number
    setPage: (page: number) => void
}


function replaceParams(url: string , params: {[key: string]: any}) {
    return url.replace(/{(\w+)}/g, function(match, key) {
        return typeof params[key] !== 'undefined' ? params[key] : match;
    });
}




export async function fetchWithResponse(url: string) {

    const res = await fetch(`/api/${url}`);
    if (!res.ok){
        const error = new Error("Failed to fetch chatboard metadata.") as any;
        // error.info = await res.json()
        error.info = await res.text()
        error.status = res.status
        throw error
    }
    return await res.json()
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










interface MutationOptions<Args, Data> {
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    onSuccess?: (date: Data)=> void
    onError?: (error: any)=>void
}


export const useMutation = <Args, Data>(url: string, options: MutationOptions<Args, Data>) => {

    async function sendMutationRequest<Args, Data>(url: string, { arg }: { arg: Args }): Promise<Data> {
        return fetch(url, {
            method: options.method || 'POST',
            body: JSON.stringify(arg),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
    }

    const { trigger, isMutating } = useSWRMutation(url, sendMutationRequest<Args, Data> as MutationFetcher<Data, string, Args>, {
        onSuccess: (data: Data) => {
            options.onSuccess && options.onSuccess(data)
        },
        onError: (error) => {
            console.error(error)
            options.onError && options.onError(error)
        }
    })

    return {
        isMutating,
        trigger: (arg: Args) => {
            {/* @ts-ignore */}
            trigger(arg)
        },
    }

}





// const argsToParams = <Args extends Record<string, string | number>>(args: Args) => {
const argsToParams = <Args extends Record<string, string | number>>(args: Args) => {
    const params = new URLSearchParams()
    Object.keys(args).forEach((k: string) => {
        params.set(k, args[k].toString())
    })
    return params.toString()
}


type GetKeyFn<Args> = (pageIndex: number, previousPageData: any) => Record<string, string | number>


export function useInfinite<Args extends Record<string, string | number>, Data>(url: string, args: Args, getKey: GetKeyFn<Args>) {

    // const getKey = (pageIndex: number, previousPageData: any) => {
    //     // if (!phoneNumber) return null
    //     if (previousPageData && !previousPageData.length) return null // reached the end
    //     const params = argsToParams(args)
    //     if (previousPageData && previousPageData.length)
    //         params.set('start_from', `${previousPageData[previousPageData.length - 1].asset_update_ts}`)      
    //     return `${url}?${params.toString()}`
    // }
    const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite(
        getKey, fetchWithResponse
    )

    const refetch = () => {
        setSize(1)
    }
    return {
        data: data ? data.flat() : [],
        mutate,
        error,
        isLoading,
        size,
        setSize,
        refetch
    }
}










