// src/hooks/modelHooks.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import useSWR, { SWRResponse, SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";

import { ZodTypeAny, z } from "zod";
import { DefaultFilter, useQueryBuilder } from "../services/query-builder";
import useSWRInfinite from "swr/infinite";

// --------------------
// Context & Helpers
// --------------------

/**
 * A generic React context to hold arbitrary context values (e.g., branchId, partitionId, etc.).
 */
export const CtxContext = createContext<any>(null);

export function useCtx<Ctx = any>(): Ctx {
    const ctx = useContext<Ctx>(CtxContext);
    return ctx!;
}

/**
 * If the hook call receives an explicit `ctx`, return that.
 * Otherwise, pull from React context. If neither exist or branchId missing, throw an error.
 */
export function useHookCtx<Ctx extends { branchId: number } = { branchId: number }>(
    explicitCtx?: Ctx
): Ctx {
    if (explicitCtx) {
        return explicitCtx;
    }
    const fromProvider = useCtx<Ctx>();
    if (fromProvider && typeof fromProvider.branchId === "number") {
        return fromProvider;
    }
    throw new Error(
        "Model hook was called without a valid `ctx`. Provide `ctx` as a hook argument or wrap your component tree in <ModelContextProvider>."
    );
}

/**
 * Build a URL with nested query parameters:
 * - ctx: JSON stringified object of context
 * - list: JSON stringified object of list params (limit, offset, orderby, direction)
 * - filter: stringified filter (if present)
 *
 * Example output:
 *   /api/endpoint?ctx={"branchId":1,"extra":"val"}&list={"limit":5,"offset":10,"orderby":"name","direction":"asc"}&filter="name%3A%22A%22"
 */
function buildNestedUrl(
    baseUrl: string,
    parts: {
        ctx: Record<string, any>;
        list?: { limit: number; offset: number; orderby?: string; direction?: "asc" | "desc" };
        filter?: string;
    }
): string {
    const params = new URLSearchParams();

    // ctx param
    params.set("ctx", JSON.stringify(parts.ctx));

    // list param, if provided
    if (parts.list) {
        params.set("list", JSON.stringify(parts.list));
    }

    // filter param, if provided
    if (parts.filter !== undefined) {
        params.set("filter", parts.filter);
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

// --------------------
// Default Fetcher Implementations
// --------------------

/**
 * A default fetcher for single-model endpoints.
 * - Assumes GET
 * - Groups all ctx fields under "ctx" query parameter
 * - Merges in any additional headers
 * - Returns parsed JSON (raw); validation occurs in hook via Zod.
 */
export async function defaultSingleFetcher<Ctx extends { branchId: number }, T>(
    url: string,
    config: { ctx: Ctx; headers?: Record<string, string> }
): Promise<T> {
    const finalUrl = buildNestedUrl(url, { ctx: config.ctx });
    const combinedHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(config.headers || {}),
    };
    const response = await fetch(finalUrl, {
        method: "GET",
        headers: combinedHeaders,
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    const json = await response.json();
    return json as T;
}

/**
 * A default fetcher for list endpoints.
 * - Assumes GET
 * - Groups ctx fields under "ctx", list params (limit, offset, orderby, direction) under "list"
 * - Includes filter string under "filter"
 * - Merges in any additional headers
 * - Returns parsed JSON (raw array); validation occurs in hook via Zod.
 */
export async function defaultListFetcher<
    Ctx extends { branchId: number },
    T
>(
    url: string,
    config: {
        ctx: Ctx;
        headers?: Record<string, string>;
        params: {
            limit: number;
            offset: number;
            orderby?: string;
            direction?: "asc" | "desc";
        };
        filter?: string;
    }
): Promise<T> {
    const listParams = {
        limit: config.params.limit,
        offset: config.params.offset,
        ...(config.params.orderby !== undefined ? { orderby: config.params.orderby } : {}),
        ...(config.params.direction !== undefined ? { direction: config.params.direction } : {}),
    };
    const finalUrl = buildNestedUrl(url, {
        ctx: config.ctx,
        list: listParams,
        filter: config.filter,
    });
    const combinedHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(config.headers || {}),
    };
    const response = await fetch(finalUrl, {
        method: "GET",
        headers: combinedHeaders,
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    const json = await response.json();
    return json as T;
}

// --------------------
// Types
// --------------------

/**
 * Configuration object for `createUseFetchModelHook`.
 */
export interface FetchModelHookConfig<Model, Ctx extends { branchId: number }> {
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
    fetcher?: <T>(
        url: string,
        config: { ctx: Ctx; headers?: Record<string, string> }
    ) => Promise<T>;
}

/**
 * Parameters passed into the hook returned by createUseFetchModelHook.
 */
export interface UseFetchModelParams<Ctx> {
    id?: number | string;
    ctx?: Ctx;
    headers?: Record<string, string>;
    swrOptions?: SWRConfiguration<any, any>;
    /**
     * If true, the hook will not fetch on mount (lazy mode).
     * To trigger the fetch, call the returned `trigger()` function.
     */
    lazy?: boolean;
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
export interface FetchModelListHookConfig<
    Model,
    Ctx extends { branchId: number }
> {
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
    fetcher?: <T>(
        url: string,
        config: {
            ctx: Ctx;
            headers?: Record<string, string>;
            params: {
                limit: number;
                offset: number;
                orderby?: string;
                direction?: "asc" | "desc";
            };
            filter?: string;
        }
    ) => Promise<T>;
}

/**
 * Parameters passed into the hook returned by createUseFetchModelListHook.
 */
export interface UseFetchModelListParams<Model, Ctx> {
    limit: number;
    offset: number;
    orderby?: string;
    direction?: "asc" | "desc";
    filters?: DefaultFilter<Model>[];
    isDisabled?: boolean;
    ctx?: Ctx;
    headers?: Record<string, string>;
    swrOptions?: SWRConfiguration<any, any>;
    /**
     * If true, the hook will not fetch on mount (lazy mode).
     * To trigger the fetch, call the returned `trigger()` function.
     */
    lazy?: boolean;
}

/**
 * Return shape of the hook from createUseFetchModelListHook.
 */
export interface UseFetchModelListReturn<Model> {
    data: Model[] | undefined;
    error: any;
    isLoading: boolean;
    mutate: (
        data?: Model[] | Promise<Model[]> | undefined,
        shouldRevalidate?: boolean
    ) => Promise<Model[] | undefined>;
    /**
     * Call this function to start fetching when `lazy: true`.
     * If `lazy` was false or omitted, `trigger` is a no-op.
     */
    trigger: () => void;
    // Filter-management helpers:
    filters: DefaultFilter<Model>[];
    where: (filter: DefaultFilter<Model>) => void;
    build: () => void;
    reset: () => void;
    queryString: string;
}

// --------------------
// Hook Factories
// --------------------

/**
 * Creates a hook to fetch a single model by ID, using SWR and Zod for validation,
 * with optional lazy-fetch support and a default fetcher.
 */
export function createUseFetchModelHook<
    Model,
    Ctx extends { branchId: number }
>(config: FetchModelHookConfig<Model, Ctx>) {
    const { url: baseUrl, schema, fetcher: customFetcher } = config;

    return function useFetchModel(
        params: UseFetchModelParams<Ctx>
    ): UseFetchModelReturn<Model> {
        const { id, ctx: explicitCtx, headers, swrOptions, lazy = false } = params || {};
        const ctxToUse = useHookCtx<Ctx>(explicitCtx);

        // Determine which fetcher to use
        const fetchFn = customFetcher
            ? customFetcher
            : (defaultSingleFetcher as typeof defaultSingleFetcher);

        // Local state to control lazy fetching
        const [shouldFetch, setShouldFetch] = useState(!lazy);

        // If `id` changes while not lazy, ensure we fetch
        useEffect(() => {
            if (!lazy && id !== undefined && id !== null) {
                setShouldFetch(true);
            }
        }, [id, lazy]);

        const trigger = () => {
            if (!shouldFetch) {
                setShouldFetch(true);
            }
        };

        // Only fetch if we have an ID and shouldFetch is true
        const swrKey =
            shouldFetch && id !== undefined && id !== null
                ? [`${baseUrl}/${id}`, ctxToUse, headers ?? {}]
                : null;

        const swrResult = useSWR<Model>(
            swrKey,
            async ([fullUrl, ctxObj, hdrs]: [string, Ctx, Record<string, string>]) => {
                const raw = await fetchFn<Model>(fullUrl, {
                    ctx: ctxObj,
                    headers: hdrs,
                });
                return schema.parse(raw);
            },
            swrOptions
        );

        return {
            ...swrResult,
            trigger,
        };
    };
}

/**
 * Creates a hook to fetch a paginated list of models (limit + offset), with optional filters,
 * SWR and Zod validation, lazy-fetch support, and a default fetcher.
 */
export function createUseFetchModelListHook<
    Model,
    Ctx extends { branchId: number }
>(config: FetchModelListHookConfig<Model, Ctx>) {
    const { url: listUrl, schema, fetcher: customFetcher } = config;

    return function useFetchModelList(
        params: UseFetchModelListParams<Model, Ctx>
    ): UseFetchModelListReturn<Model> {
        const {
            limit,
            offset,
            orderby,
            direction,
            filters: defaultFilters = [],
            isDisabled = false,
            ctx: explicitCtx,
            headers,
            swrOptions,
            lazy = false,
        } = params;

        const ctxToUse = useHookCtx<Ctx>(explicitCtx);

        // Determine which fetcher to use
        const fetchFn = customFetcher
            ? customFetcher
            : (defaultListFetcher as typeof defaultListFetcher);

        // Filter management via query-builder
        const { filters, where, build, reset, queryString } = useQueryBuilder<Model>(
            schema,
            defaultFilters
        );

        // Build the list params object
        const listParams: { limit: number; offset: number; orderby?: string; direction?: "asc" | "desc" } = {
            limit,
            offset,
        };
        if (orderby !== undefined) listParams.orderby = orderby;
        if (direction !== undefined) listParams.direction = direction;

        // Local state for lazy support
        const [shouldFetch, setShouldFetch] = useState(!lazy);

        // If not lazy and not disabled, always fetch on mount or when dependencies change
        useEffect(() => {
            if (!lazy && !isDisabled) {
                setShouldFetch(true);
            }
        }, [limit, offset, orderby, direction, queryString, lazy, isDisabled]);

        const trigger = () => {
            if (!shouldFetch) {
                setShouldFetch(true);
            }
        };

        // If disabled or lazy not yet triggered, skip fetch
        const swrKey =
            !isDisabled && shouldFetch
                ? [listUrl, ctxToUse, JSON.stringify(listParams), queryString]
                : null;

        const swrResult = useSWR<Model[]>(
            swrKey,
            async ([
                url,
                ctxObj,
                paramsStr,
                filterStr,
            ]: [string, Ctx, string, string]) => {
                const parsedParams = JSON.parse(paramsStr) as {
                    limit: number;
                    offset: number;
                    orderby?: string;
                    direction?: "asc" | "desc";
                };
                const rawList = await fetchFn<Model[]>(url, {
                    ctx: ctxObj,
                    headers: headers ?? {},
                    params: parsedParams,
                    filter: filters.length > 0 ? filterStr : undefined,
                });
                return z.array(schema).parse(rawList);
            },
            swrOptions
        );

        return {
            data: swrResult.data,
            error: swrResult.error,
            isLoading: !swrResult.error && !swrResult.data,
            mutate: swrResult.mutate,
            trigger,
            filters,
            where,
            build,
            reset,
            queryString,
        };
    };
}







/**
 * Creates a hook to fetch an infinite-scrolling list of models using SWRInfinite,
 * with nested ctx/list/filter params, Zod validation, and optional lazy support.
 */
export function createUseFetchModelListInfiniteHook<
    Model,
    Ctx extends { branchId: number }
>(config: FetchModelListHookConfig<Model, Ctx>) {
    const { url: listUrl, schema, fetcher: customFetcher } = config;

    return function useFetchModelListInfinite(
        params: UseFetchModelListParams<Model, Ctx> & { pageSize: number; defaultFilters: DefaultFilter<Model>[] }
    ) {
        const {
            pageSize,
            defaultFilters,
            orderby,
            direction,
            isDisabled = false,
            ctx: explicitCtx,
            headers,
            swrOptions,
            lazy = false,
        } = params;

        const ctxToUse = useHookCtx<Ctx>(explicitCtx);

        const fetchFn = customFetcher
            ? customFetcher
            : (defaultListFetcher as typeof defaultListFetcher);

        // Filter management
        const { filters, where, build, reset, queryString } = useQueryBuilder<Model>(
            schema,
            defaultFilters
        );

        // Lazy control
        const [shouldFetch, setShouldFetch] = useState(!lazy);
        useEffect(() => {
            if (!lazy && !isDisabled) {
                setShouldFetch(true);
            }
        }, [lazy, isDisabled]);
        const trigger = () => {
            if (!shouldFetch) setShouldFetch(true);
        };

        // Key generator for SWR Infinite
        const getKey = (
            pageIndex: number,
            previousPageData: Model[] | null
        ) => {
            if (!shouldFetch || isDisabled) return null;
            if (previousPageData && previousPageData.length < pageSize) return null;

            // Build list params for this page
            const listParams: {
                limit: number;
                offset: number;
                orderby?: string;
                direction?: "asc" | "desc";
            } = { limit: pageSize, offset: pageIndex * pageSize };
            if (orderby) listParams.orderby = orderby;
            if (direction) listParams.direction = direction;

            return [
                listUrl,
                ctxToUse,
                JSON.stringify(listParams),
                filters.length > 0 ? queryString : "",
                JSON.stringify(filters),
            ];
        };

        const swrInfinite = useSWRInfinite<Model[]>(
            getKey,
            async ([
                url,
                ctxObj,
                paramsStr,
                filterStr,
            ]: [string, Ctx, string, string]) => {
                const parsedParams = JSON.parse(paramsStr) as {
                    limit: number;
                    offset: number;
                    orderby?: string;
                    direction?: "asc" | "desc";
                };
                const rawList = await fetchFn<Model[]>(url, {
                    ctx: ctxObj,
                    headers: headers ?? {},
                    params: parsedParams,
                    filter: filters.length > 0 ? filterStr : undefined,
                });
                return z.array(schema).parse(rawList);
            },
            swrOptions
        );

        const items = swrInfinite.data ? ([] as Model[]).concat(...swrInfinite.data) : [];

        return {
            ...swrInfinite,
            items,
            trigger,
            filters,
            where,
            build,
            reset,
            queryString,
        };
    };
}





export async function defaultMutationFetcher<
    Ctx extends { branchId: number },
    T
>(
    url: string,
    config: {
        method: "POST" | "PUT" | "DELETE";
        ctx: Ctx;
        headers?: Record<string, string>;
        payload: Record<string, any>;
    }
): Promise<T> {
    // Build request body: all payload fields, plus nested ctx
    const body = JSON.stringify({ ...config.payload, ctx: config.ctx });
    const combinedHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(config.headers || {}),
    };
    const response = await fetch(url, {
        method: config.method,
        headers: combinedHeaders,
        body,
    });
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    // Some DELETEs return empty body → handle text then parse if nonempty
    const json = await response.json();
    return json as T;
}





/**
 * Creates a hook to perform a CREATE mutation (POST) to the given URL.
 * - Uses defaultMutationFetcher with method="POST".
 * - Validates response via Zod.
 */
export function createUseCreateModelHook<
    Model,
    Payload extends Record<string, any>,
    Ctx extends { branchId: number }
>(config: {
    url: string;
    schema: ZodTypeAny;
    fetcher?: <T>(
        url: string,
        cfg: { method: "POST"; ctx: Ctx; headers?: Record<string, string>; payload: any }
    ) => Promise<T>;
}) {
    const { url: baseUrl, schema, fetcher: customFetcher } = config;

    return function useCreateModel(params?: {
        ctx?: Ctx;
        headers?: Record<string, string>;
    }) {
        const { ctx: explicitCtx, headers } = params || {};
        const ctxToUse = useHookCtx<Ctx>(explicitCtx);

        const fetchFn = customFetcher
            ? customFetcher
            : ((url: string, cfg: any) =>
                defaultMutationFetcher<Ctx, any>(url, { method: "POST", ...cfg })) as typeof defaultMutationFetcher;

        const mutation = useSWRMutation<Payload, Model, any>(
            baseUrl,
            async (url, { arg }) => {
                const raw = await fetchFn<Model>(url, {
                    ctx: ctxToUse,
                    headers,
                    payload: arg,
                });
                return schema.parse(raw);
            }
        );

        return {
            trigger: mutation.trigger,
            data: mutation.data,
            error: mutation.error,
            isMutating: mutation.isMutating,
        };
    };
}

/**
 * Creates a hook to perform an UPDATE mutation (PUT) to the given URL.
 * - Uses defaultMutationFetcher with method="PUT".
 * - Validates response via Zod.
 */
export function createUseUpdateModelHook<
    Model,
    Payload extends { id: number | string },
    Ctx extends { branchId: number }
>(config: {
    url: string;
    schema: ZodTypeAny;
    fetcher?: <T>(
        url: string,
        cfg: { method: "PUT"; ctx: Ctx; headers?: Record<string, string>; payload: any }
    ) => Promise<T>;
}) {
    const { url: baseUrl, schema, fetcher: customFetcher } = config;

    return function useUpdateModel(params?: {
        ctx?: Ctx;
        headers?: Record<string, string>;
    }) {
        const { ctx: explicitCtx, headers } = params || {};
        const ctxToUse = useHookCtx<Ctx>(explicitCtx);

        const fetchFn = customFetcher
            ? customFetcher
            : ((url: string, cfg: any) =>
                defaultMutationFetcher<Ctx, any>(url, { method: "PUT", ...cfg })) as typeof defaultMutationFetcher;

        const mutation = useSWRMutation<Payload, Model, any>(
            baseUrl,
            async (url, { arg }) => {
                const raw = await fetchFn<Model>(url, {
                    ctx: ctxToUse,
                    headers,
                    payload: arg,
                });
                return schema.parse(raw);
            }
        );

        return {
            trigger: mutation.trigger,
            data: mutation.data,
            error: mutation.error,
            isMutating: mutation.isMutating,
        };
    };
}

/**
 * Creates a hook to perform a DELETE mutation to the given URL.
 * - Uses defaultMutationFetcher with method="DELETE".
 * - Returns `null` or parsed JSON.
 */
export function createUseDeleteModelHook<
    Ctx extends { branchId: number }
>(config: {
    url: string;
    fetcher?: <T>(
        url: string,
        cfg: { method: "DELETE"; ctx: Ctx; headers?: Record<string, string>; payload: { id: number | string } }
    ) => Promise<any>;
}) {
    const { url: baseUrl, fetcher: customFetcher } = config;

    return function useDeleteModel(params?: {
        ctx?: Ctx;
        headers?: Record<string, string>;
    }) {
        const { ctx: explicitCtx, headers } = params || {};
        const ctxToUse = useHookCtx<Ctx>(explicitCtx);

        const fetchFn = customFetcher
            ? customFetcher
            : ((url: string, cfg: any) =>
                defaultMutationFetcher<Ctx, any>(url, { method: "DELETE", ...cfg })) as typeof defaultMutationFetcher;

        const mutation = useSWRMutation<{ id: number | string }, any, any>(
            baseUrl,
            async (url, { arg }) => {
                const raw = await fetchFn<any>(url, {
                    ctx: ctxToUse,
                    headers,
                    payload: arg,
                });
                return raw;
            }
        );

        return {
            trigger: mutation.trigger,
            data: mutation.data,
            error: mutation.error,
            isMutating: mutation.isMutating,
        };
    };
}