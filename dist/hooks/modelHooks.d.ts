import React from "react";
import { SWRResponse, SWRConfiguration } from "swr";
import { ZodTypeAny } from "zod";
import { DefaultFilter } from "../services/query-builder";
/**
 * A generic React context to hold arbitrary context values (e.g., branchId, partitionId, etc.).
 */
export declare const CtxContext: React.Context<any>;
export declare function useCtx<Ctx = any>(): Ctx;
/**
 * If the hook call receives an explicit `ctx`, return that.
 * Otherwise, pull from React context. If neither exist or branchId missing, throw an error.
 */
export declare function useHookCtx<Ctx extends {
    branchId: number;
} = {
    branchId: number;
}>(explicitCtx?: Ctx): Ctx;
/**
 * Build a URL with nested query parameters:
 * - ctx: JSON stringified object of context
 * - list: JSON stringified object of list params (limit, offset, orderby, direction)
 * - filter: stringified filter (if present)
 *
 * Example output:
 *   /api/endpoint?ctx={"branchId":1,"extra":"val"}&list={"limit":5,"offset":10,"orderby":"name","direction":"asc"}&filter="name%3A%22A%22"
 */
export declare function buildNestedUrl(baseUrl: string, parts: {
    ctx: Record<string, any>;
    list?: {
        limit: number;
        offset: number;
        orderby?: string;
        direction?: "asc" | "desc";
    };
    filter?: string;
}): string;
/**
 * A default fetcher for single-model endpoints.
 * - Assumes GET
 * - Groups all ctx fields under "ctx" query parameter
 * - Merges in any additional headers
 * - Returns parsed JSON (raw); validation occurs in hook via Zod.
 */
export declare function defaultSingleFetcher<Ctx extends {
    branchId: number;
}, T>(url: string, config: {
    ctx: Ctx;
    headers?: Record<string, string>;
}): Promise<T>;
/**
 * A default fetcher for list endpoints.
 * - Assumes GET
 * - Groups ctx fields under "ctx", list params (limit, offset, orderby, direction) under "list"
 * - Includes filter string under "filter"
 * - Merges in any additional headers
 * - Returns parsed JSON (raw array); validation occurs in hook via Zod.
 */
export declare function defaultListFetcher<Ctx extends {
    branchId: number;
}, T>(url: string, config: {
    ctx: Ctx;
    headers?: Record<string, string>;
    params: {
        limit: number;
        offset: number;
        orderby?: string;
        direction?: "asc" | "desc";
    };
    filter?: string;
}): Promise<T>;
/**
 * Configuration object for `createUseFetchModelHook`.
 */
export interface FetchModelHookConfig<Model, Ctx extends {
    branchId: number;
}> {
    /**
     * The base URL for the single-model endpoint, e.g. "/api/ai/model/user".
     * The hook will internally append `/${id}`.
     */
    url: string;
    /**
     * Zod schema for validating the fetched Model.
     */
    schema: ZodTypeAny;
    /**
     * Optional custom fetcher. If omitted, `defaultSingleFetcher` is used.
     */
    fetcher?: <T>(url: string, config: {
        ctx: Ctx;
        headers?: Record<string, string>;
    }) => Promise<T>;
}
/**
 * Parameters passed into the hook returned by createUseFetchModelHook.
 */
export interface UseFetchModelParams<Ctx> {
    id?: number | string | null;
    ctx?: Ctx;
}
/**
 * Return shape of the hook from createUseFetchModelHook.
 */
export interface UseFetchModelReturn<Model> extends SWRResponse<Model, any> {
    /**
     * Call this function to start fetching when `lazy: true`.
     * If `lazy` was false or omitted, `trigger` is a no-op.
     */
    trigger: () => void;
}
/**
 * Configuration object for `createUseFetchModelListHook`.
 */
export interface FetchModelListHookConfig<Model, Ctx extends {
    branchId: number;
}> {
    /**
     * The URL for the list endpoint, e.g. "/api/ai/model/user/list".
     * The hook will append nested query parameters for ctx, list, and filter.
     */
    url: string;
    /**
     * Zod schema for validating a single Model in the returned array.
     */
    schema: ZodTypeAny;
    /**
     * Optional custom fetcher. If omitted, `defaultListFetcher` is used.
     */
    fetcher?: <T>(url: string, config: {
        ctx: Ctx;
        headers?: Record<string, string>;
        params: {
            limit: number;
            offset: number;
            orderby?: string;
            direction?: "asc" | "desc";
        };
        filter?: string;
    }) => Promise<T>;
}
export interface BaseConfiguration extends SWRConfiguration {
    isDisabled?: boolean;
    headers?: Record<string, string>;
    lazy?: boolean;
    /**
     * Optional callback for fetch error.
     */
    onError?: (error: any) => void;
}
export interface SingleConfiguration<Model> extends BaseConfiguration {
    /**
     * Optional callback for successful fetch.
     */
    onSuccess?: (data: Model) => void;
}
export interface ListConfiguration<Model> extends BaseConfiguration {
    /**
     * Optional callback for successful fetch.
     */
    onSuccess?: (data: Model[]) => void;
}
export interface InfiniteConfiguration<Model> extends BaseConfiguration {
    /**
     * Optional callback for successful fetch.
     */
    onSuccess?: (data: Model[][]) => void;
}
/**
 * Parameters passed into the hook returned by createUseFetchModelListHook.
 */
export interface UseFetchModelListParams<Model, Ctx> {
    limit: number;
    offset?: number;
    orderby?: string;
    direction?: "asc" | "desc";
    filters?: DefaultFilter<Model & Record<string, any>>;
    ctx?: Ctx;
}
/**
 * Return shape of the hook from createUseFetchModelListHook.
 */
export interface UseFetchModelListReturn<Model> {
    data: Model[] | undefined;
    error: any;
    isLoading: boolean;
    mutate: (data?: Model[] | Promise<Model[]> | undefined, shouldRevalidate?: boolean) => Promise<Model[] | undefined>;
    /**
     * Call this function to start fetching when `lazy: true`.
     * If `lazy` was false or omitted, `trigger` is a no-op.
     */
    trigger: () => void;
    filters: DefaultFilter<Model>;
    where: (filter: DefaultFilter<Model>) => void;
    build: () => void;
    reset: () => void;
    queryString: string;
}
/**
 * Creates a hook to fetch a single model by ID, using SWR and Zod for validation,
 * with optional lazy-fetch support and a default fetcher.
 */
export declare function createUseFetchModelHook<Model, Ctx extends {
    branchId: number;
}>(config: FetchModelHookConfig<Model, Ctx>): (params: Partial<UseFetchModelParams<Ctx>>, hookConfig?: SingleConfiguration<Model>) => UseFetchModelReturn<Model>;
/**
 * Creates a hook to fetch a paginated list of models (limit + offset), with optional filters,
 * SWR and Zod validation, lazy-fetch support, and a default fetcher.
 */
export declare function createUseFetchModelListHook<Model, Ctx extends {
    branchId: number;
}>(config: FetchModelListHookConfig<Model, Ctx>): (params: UseFetchModelListParams<Model, Ctx>, hookConfig?: ListConfiguration<Model>) => UseFetchModelListReturn<Model>;
/**
 * Creates a hook to fetch an infinite-scrolling list of models using SWRInfinite,
 * with nested ctx/list/filter params, Zod validation, and optional lazy support.
 */
export declare function createUseFetchModelListInfiniteHook<Model, Ctx extends {
    branchId: number;
}>(config: FetchModelListHookConfig<Model, Ctx>): (params: UseFetchModelListParams<Model, Ctx> & {
    defaultFilters?: DefaultFilter<Model>[];
}, hookConfig?: InfiniteConfiguration<Model>) => {
    items: Model[];
    trigger: () => void;
    filters: DefaultFilter<Model & Record<string, any>>[];
    where: <K extends string | keyof Model>(filter: [K, import("../services/query-builder").FilterOperators<(Model & Record<string, any>)[K]>, (Model & Record<string, any>)[K]]) => void;
    build: () => string;
    reset: () => void;
    queryString: string;
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<Model[][] | undefined>;
    mutate: import("swr/infinite").SWRInfiniteKeyedMutator<Model[][]>;
    error: any;
    data: Model[][] | undefined;
    isLoading: import("swr/_internal").IsLoadingResponse<Data, Config>;
    isValidating: boolean;
};
export declare function defaultMutationFetcher<Ctx extends {
    branchId: number;
}, T>(url: string, config: {
    method: "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    payload: Record<string, any>;
}): Promise<T>;
/**
 * Creates a hook to perform a CREATE mutation (POST) to the given URL.
 * - Uses defaultMutationFetcher with method="POST".
 * - Validates response via Zod.
 */
export declare function createUseCreateModelHook<Model, Payload extends Record<string, any>, Ctx extends {
    branchId: number;
}>(config: {
    url: string;
    schema: ZodTypeAny;
    fetcher?: <T>(url: string, cfg: {
        method: "POST";
        ctx: Ctx;
        headers?: Record<string, string>;
        payload: any;
    }) => Promise<T>;
}): (params?: {
    ctx?: Ctx;
    headers?: Record<string, string>;
}) => {
    trigger: import("swr/mutation").TriggerWithOptionsArgs<Model, Model, any, any>;
    data: Model | undefined;
    error: Model | undefined;
    isMutating: boolean;
};
export interface MutateModelHookConfig<Model, Payload, Ctx extends {
    branchId: number;
}> {
    url: string;
    schema: ZodTypeAny;
    fetcher?: <T>(url: string, cfg: {
        method: "PUT";
        ctx: Ctx;
        headers?: Record<string, string>;
        payload: any;
    }) => Promise<T>;
}
export interface UseMutateModelParams<Model, Payload, Ctx extends {
    branchId: number;
}> {
    id?: number | string;
    ctx?: Ctx;
}
/**
 * Creates a hook to perform an UPDATE mutation (PUT) to the given URL.
 * - Uses defaultMutationFetcher with method="PUT".
 * - Validates response via Zod.
 */
export declare function createUseUpdateModelHook<Model, Payload, Ctx extends {
    branchId: number;
}>(config: MutateModelHookConfig<Model, Payload, Ctx>): (params?: UseMutateModelParams<Model, Payload, Ctx>) => {
    trigger: import("swr/mutation").TriggerWithOptionsArgs<Payload, Model, any, any>;
    data: Payload | undefined;
    error: Model | undefined;
    isMutating: boolean;
};
/**
 * Creates a hook to perform a DELETE mutation to the given URL.
 * - Uses defaultMutationFetcher with method="DELETE".
 * - Returns `null` or parsed JSON.
 */
export declare function createUseDeleteModelHook<Ctx extends {
    branchId: number;
}>(config: {
    url: string;
    fetcher?: <T>(url: string, cfg: {
        method: "DELETE";
        ctx: Ctx;
        headers?: Record<string, string>;
        payload: {
            id: number | string;
        };
    }) => Promise<any>;
}): (params?: {
    ctx?: Ctx;
    headers?: Record<string, string>;
}) => {
    trigger: import("swr/mutation").TriggerWithoutArgs<{
        id: number | string;
    }, any, any, never>;
    data: {
        id: number | string;
    } | undefined;
    error: any;
    isMutating: boolean;
};
/**
 * Creates a hook to perform a custom mutation (any HTTP method) to the given URL.
 * - `method`: "POST" | "PUT" | "PATCH" | "DELETE"
 * - optional `responseSchema` to validate server response with Zod
 * - `fetcher` falls back to `defaultMutationFetcher`
 */
export declare function createUseMutationHook<Req, Res, Ctx extends {
    branchId: number;
}>(config: {
    url: string;
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    payloadSchema: ZodTypeAny;
    schema: ZodTypeAny;
    fetcher?: <T>(url: string, cfg: {
        method: string;
        ctx: Ctx;
        headers?: Record<string, string>;
        payload: any;
    }) => Promise<T>;
}): (params?: {
    ctx?: Ctx;
    headers?: Record<string, string>;
}) => {
    trigger: (payload: Req) => void;
    data: Req | undefined;
    error: Res | undefined;
    isMutating: boolean;
};
//# sourceMappingURL=modelHooks.d.ts.map