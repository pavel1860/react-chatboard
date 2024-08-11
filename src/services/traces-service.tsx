
import useSWR from "swr";
import { EndpointHook, fetcher, fetchWithResponse, PaginatableEndpointHook } from "./fetcher";
import useSWRInfinite from 'swr/infinite'









export function useGetRuns(limit: number, offset: number, runNames: string[]) : EndpointHook<any>{
    const fetchRuns = (url: string) => fetcher(url, { limit, offset, runNames });
    const { data, error, isLoading } = useSWR('chatboard/get_runs', fetchRuns);
    
    return {
        data,
        error,
        isLoading
    }
}





export function useTrace(run_id: string): EndpointHook<any> {
    
    const { data, error, isLoading } = useSWR(run_id ? "chatboard/get_trace" : null, (url: string) => fetcher(url, {run_id}));

    return {
        data,
        error,
        isLoading
    }
}