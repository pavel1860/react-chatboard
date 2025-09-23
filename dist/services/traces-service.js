import useSWR from "swr";
// import { EndpointHook, fetcher, fetchWithResponse, PaginatableEndpointHook } from "./fetcher";
import { build_run_tree } from "../types/run-tree";
import { useEffect, useState } from "react";
export async function fetcher(endpoint, data) {
    const params = new URLSearchParams();
    Object.keys(data).forEach((k) => {
        params.set(k, data[k]);
    });
    const res = await fetch(`/api/${endpoint}?${params.toString()}`);
    if (!res.ok) {
        const error = new Error("Failed to fetch chatboard metadata.");
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return await res.json();
}
export function useGetRuns(limit, offset, runNames) {
    const fetchRuns = (url) => fetcher(url, { limit, offset, runNames });
    const { data, error, isLoading } = useSWR('chatboard/get_runs', fetchRuns);
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
export function useTrace(run_id) {
    const { data, error, isLoading } = useSWR(run_id ? "chatboard/get_trace" : null, (url) => fetcher(url, { run_id }));
    return {
        data,
        error,
        isLoading
    };
}
//# sourceMappingURL=traces-service.js.map