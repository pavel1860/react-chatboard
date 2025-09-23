export interface ServiceHook<T> {
    data: T;
    error: any;
    isLoading: boolean;
    mutate?: any;
    refetch?: () => void;
}
export interface ServiceMutationHook<T> extends ServiceHook<T> {
    mutate: any;
}
export interface ServiceInfiniteHook<T> extends ServiceMutationHook<T> {
    size: number;
    setSize: (size: number) => void;
}
export interface EndpointHook<T> {
    data: T;
    error: any;
    isLoading: boolean;
}
export interface PaginatableEndpointHook<T> extends EndpointHook<T> {
    page: number;
    setPage: (page: number) => void;
}
export declare function fetchWithResponse(url: string): Promise<any>;
export declare function fetcher(endpoint: string, data: any): Promise<any>;
export declare function useEndpoint(phoneNumber: string | null, limit?: number, offset?: number): EndpointHook<any>;
type GetKeyFn<Args> = (pageIndex: number, previousPageData: any) => Record<string, string | number>;
export declare function useInfinite<Args extends Record<string, string | number>, Data>(url: string, args: Args, getKey: GetKeyFn<Args>): {
    data: any[];
    mutate: import("swr/infinite").SWRInfiniteKeyedMutator<any[]>;
    error: any;
    isLoading: boolean;
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<any[] | undefined>;
    refetch: () => void;
};
export {};
//# sourceMappingURL=fetcher.d.ts.map