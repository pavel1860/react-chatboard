import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
function replaceParams(url, params) {
    return url.replace(/{(\w+)}/g, function (match, key) {
        return typeof params[key] !== 'undefined' ? params[key] : match;
    });
}
export async function fetchWithResponse(url) {
    const res = await fetch(`/api/${url}`);
    if (!res.ok) {
        const error = new Error("Failed to fetch chatboard metadata.");
        // error.info = await res.json()
        error.info = await res.text();
        error.status = res.status;
        throw error;
    }
    return await res.json();
}
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
export function useEndpoint(phoneNumber, limit = 10, offset = 0) {
    const url = `client/${phoneNumber}/chat`;
    const { data, error, isLoading } = useSWR(phoneNumber ? [url, phoneNumber, limit, offset] : null, ([url, phoneNumber, limit, offset]) => fetcher(url, { phone_number: phoneNumber, limit, offset }));
    return {
        data,
        error,
        isLoading
    };
}
// const argsToParams = <Args extends Record<string, string | number>>(args: Args) => {
const argsToParams = (args) => {
    const params = new URLSearchParams();
    Object.keys(args).forEach((k) => {
        params.set(k, args[k].toString());
    });
    return params.toString();
};
export function useInfinite(url, args, getKey) {
    // const getKey = (pageIndex: number, previousPageData: any) => {
    //     // if (!phoneNumber) return null
    //     if (previousPageData && !previousPageData.length) return null // reached the end
    //     const params = argsToParams(args)
    //     if (previousPageData && previousPageData.length)
    //         params.set('start_from', `${previousPageData[previousPageData.length - 1].asset_update_ts}`)      
    //     return `${url}?${params.toString()}`
    // }
    const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite(getKey, fetchWithResponse);
    const refetch = () => {
        setSize(1);
    };
    return {
        data: data ? data.flat() : [],
        mutate,
        error,
        isLoading,
        size,
        setSize,
        refetch
    };
}
//# sourceMappingURL=fetcher.js.map