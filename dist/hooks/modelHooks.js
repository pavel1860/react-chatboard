// src/hooks/modelHooks.tsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { useQueryBuilder } from "../services/query-builder";
import useSWRInfinite from "swr/infinite";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "../model/services/model-context";
// --------------------
// Context & Helpers
// --------------------
/**
 * A generic React context to hold arbitrary context values (e.g., branchId, partitionId, etc.).
 */
export const CtxContext = createContext(null);
export function useCtx() {
    const ctx = useContext(CtxContext);
    return ctx;
}
/**
 * If the hook call receives an explicit `ctx`, return that.
 * Otherwise, pull from React context. If neither exist or branchId missing, throw an error.
 */
export function useHookCtx(explicitCtx) {
    if (explicitCtx) {
        return explicitCtx;
    }
    const fromProvider = useCtx();
    if (fromProvider && typeof fromProvider.branchId === "number") {
        return fromProvider;
    }
    throw new Error("Model hook was called without a valid `ctx`. Provide `ctx` as a hook argument or wrap your component tree in <ModelContextProvider>.");
}
const buildFinalUrl = (baseUrl, ctx, list, filter) => {
    const params = {
        ctx: convertKeysToSnakeCase(ctx),
    };
    if (list) {
        params["list"] = {
            limit: list.limit,
            offset: list.offset,
            ...(list.orderby !== undefined ? { orderby: list.orderby } : {}),
            ...(list.direction !== undefined ? { direction: list.direction } : {}),
        };
    }
    if (filter) {
        params["filter"] = filter;
    }
    const finalUrl = buildNestedUrl(baseUrl, params);
    return finalUrl;
};
const parseSchema = (schema, data) => {
    const result = schema.safeParse(convertKeysToCamelCase(data));
    if (result.success)
        return result.data;
    console.error(result.error.errors);
    throw new Error(`Failed to parse data: ${result.error.errors}`);
};
/**
 * Build a URL with nested query parameters:
 * - ctx: JSON stringified object of context
 * - list: JSON stringified object of list params (limit, offset, orderby, direction)
 * - filter: stringified filter (if present)
 *
 * Example output:
 *   /api/endpoint?ctx={"branchId":1,"extra":"val"}&list={"limit":5,"offset":10,"orderby":"name","direction":"asc"}&filter="name%3A%22A%22"
 */
export function buildNestedUrl(baseUrl, parts) {
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
export async function defaultSingleFetcher(url, config) {
    const finalUrl = buildNestedUrl(url, { ctx: convertKeysToSnakeCase(config.ctx) });
    const combinedHeaders = {
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
    return convertKeysToCamelCase(json);
}
/**
 * A default fetcher for list endpoints.
 * - Assumes GET
 * - Groups ctx fields under "ctx", list params (limit, offset, orderby, direction) under "list"
 * - Includes filter string under "filter"
 * - Merges in any additional headers
 * - Returns parsed JSON (raw array); validation occurs in hook via Zod.
 */
export async function defaultListFetcher(url, config) {
    const listParams = {
        limit: config.params.limit,
        offset: config.params.offset,
        ...(config.params.orderby !== undefined ? { orderby: config.params.orderby } : {}),
        ...(config.params.direction !== undefined ? { direction: config.params.direction } : {}),
    };
    const finalUrl = buildNestedUrl(url, {
        ctx: convertKeysToSnakeCase(config.ctx),
        list: convertKeysToSnakeCase(listParams),
        filter: config.filter ? convertKeysToSnakeCase(config.filter) : undefined,
    });
    const combinedHeaders = {
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
    return convertKeysToCamelCase(json);
}
// --------------------
// Hook Factories
// --------------------
/**
 * Creates a hook to fetch a single model by ID, using SWR and Zod for validation,
 * with optional lazy-fetch support and a default fetcher.
 */
export function createUseFetchModelHook(config) {
    const { url: baseUrl, schema, fetcher: customFetcher } = config;
    return function useFetchModel(params, hookConfig) {
        const { id, ctx: explicitCtx } = params || {};
        const { headers, lazy = false, isDisabled = false, onSuccess, onError, ...swrOptions } = hookConfig || {};
        const ctxToUse = useHookCtx(explicitCtx);
        // Determine which fetcher to use
        const fetchFn = customFetcher
            ? customFetcher
            : defaultSingleFetcher;
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
        const swrKey = shouldFetch && id !== undefined && id !== null
            ? [`${baseUrl}/${id}`, ctxToUse, headers ?? {}]
            : null;
        const swrResult = useSWR(swrKey, async ([fullUrl, ctxObj, hdrs]) => {
            const raw = await fetchFn(fullUrl, {
                ctx: ctxObj,
                headers: hdrs,
            });
            return parseSchema(schema, raw);
        }, {
            ...swrOptions,
            onSuccess: (data) => {
                if (onSuccess)
                    onSuccess(data);
            },
            onError: (error) => {
                if (onError)
                    onError(error);
            },
        });
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
export function createUseFetchModelListHook(config) {
    const { url: listUrl, schema, fetcher: customFetcher } = config;
    return function useFetchModelList(params, hookConfig) {
        const { limit, offset, orderby, direction, filters: defaultFilters = [], ctx: explicitCtx, } = params;
        const { headers, lazy = false, isDisabled = false, onSuccess, onError, ...swrOptions } = hookConfig || {};
        const ctxToUse = useHookCtx(explicitCtx);
        // Determine which fetcher to use
        const fetchFn = customFetcher
            ? customFetcher
            : defaultListFetcher;
        // Filter management via query-builder
        const { filters, where, build, reset, queryString } = useQueryBuilder(schema, 
        // @ts-ignore
        defaultFilters);
        // Build the list params object
        const listParams = {
            limit,
            offset: offset ?? 0,
        };
        if (orderby !== undefined)
            listParams.orderby = orderby;
        if (direction !== undefined)
            listParams.direction = direction;
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
        const swrKey = !isDisabled && shouldFetch
            ? [listUrl, ctxToUse, JSON.stringify(listParams), queryString]
            : null;
        const swrResult = useSWR(swrKey, async ([url, ctxObj, paramsStr, filterStr,]) => {
            const parsedParams = JSON.parse(paramsStr);
            const rawList = await fetchFn(url, {
                ctx: ctxObj,
                headers: headers ?? {},
                params: parsedParams,
                filter: filters.length > 0 ? filterStr : undefined,
            });
            return parseSchema(z.array(schema), rawList);
        }, {
            ...swrOptions,
            onSuccess: (data) => {
                if (onSuccess)
                    onSuccess(data);
            },
            onError: (error) => {
                if (onError)
                    onError(error);
            },
        });
        return {
            data: swrResult.data,
            error: swrResult.error,
            isLoading: !swrResult.error && !swrResult.data,
            mutate: swrResult.mutate,
            trigger,
            // @ts-ignore
            filters,
            // @ts-ignore
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
export function createUseFetchModelListInfiniteHook(config) {
    const { url: listUrl, schema, fetcher: customFetcher } = config;
    return function useFetchModelListInfinite(params, hookConfig) {
        const { limit: pageSize, filters: defaultFilters = [], orderby, direction, ctx: explicitCtx, } = params;
        const { headers, lazy = false, isDisabled = false, onSuccess, onError, ...swrOptions } = hookConfig || {};
        const ctxToUse = useHookCtx(explicitCtx);
        const fetchFn = customFetcher
            ? customFetcher
            : defaultListFetcher;
        // Filter management
        const { filters, where, build, reset, queryString } = useQueryBuilder(schema, 
        // @ts-ignore
        defaultFilters);
        // Lazy control
        const [shouldFetch, setShouldFetch] = useState(!lazy);
        useEffect(() => {
            if (!lazy && !isDisabled) {
                setShouldFetch(true);
            }
        }, [lazy, isDisabled]);
        const trigger = () => {
            if (!shouldFetch)
                setShouldFetch(true);
        };
        // Key generator for SWR Infinite
        const getKey = (pageIndex, previousPageData) => {
            if (!shouldFetch || isDisabled)
                return null;
            if (previousPageData && previousPageData.length < pageSize)
                return null;
            // Build list params for this page
            const listParams = { limit: pageSize, offset: pageIndex * pageSize };
            if (orderby)
                listParams.orderby = orderby;
            if (direction)
                listParams.direction = direction;
            return [
                listUrl,
                ctxToUse,
                JSON.stringify(listParams),
                filters.length > 0 ? queryString : "",
                JSON.stringify(filters),
            ];
        };
        const swrInfinite = useSWRInfinite(getKey, async ([url, ctxObj, paramsStr, filterStr,]) => {
            const parsedParams = JSON.parse(paramsStr);
            let rawList = await fetchFn(url, {
                ctx: ctxObj,
                headers: headers ?? {},
                params: parsedParams,
                filter: filters.length > 0 ? filterStr : undefined,
            });
            // rawList = convertKeysToCamelCase(rawList)
            return parseSchema(z.array(schema), rawList);
        }, {
            ...swrOptions,
            onSuccess: (data) => {
                if (onSuccess)
                    onSuccess(data);
            },
            onError: (error) => {
                if (onError)
                    onError(error);
            },
        });
        const items = swrInfinite.data ? [].concat(...swrInfinite.data) : [];
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
export async function defaultMutationFetcher(url, config) {
    // Build request body: all payload fields, plus nested ctx
    // const body = JSON.stringify({ ...config.payload, ctx: config.ctx });
    const payload = convertKeysToSnakeCase(config.payload);
    const body = JSON.stringify({ ...payload });
    const combinedHeaders = {
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
    return convertKeysToCamelCase(json);
}
/**
 * Creates a hook to perform a CREATE mutation (POST) to the given URL.
 * - Uses defaultMutationFetcher with method="POST".
 * - Validates response via Zod.
 */
export function createUseCreateModelHook(config) {
    const { url: baseUrl, schema, fetcher: customFetcher } = config;
    return function useCreateModel(params) {
        const { ctx: explicitCtx, headers } = params || {};
        const ctxToUse = useHookCtx(explicitCtx);
        const fetchFn = customFetcher
            ? customFetcher
            : ((url, cfg) => defaultMutationFetcher(url, { method: "POST", ...cfg }));
        const mutation = useSWRMutation(buildFinalUrl(baseUrl, ctxToUse), async (url, { arg }) => {
            // @ts-ignore
            const raw = await fetchFn(url, {
                headers,
                payload: arg,
            });
            return parseSchema(schema, raw);
        });
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
export function createUseUpdateModelHook(config) {
    const { url: baseUrl, schema, fetcher: customFetcher } = config;
    return function useUpdateModel(params) {
        const { id, ctx: explicitCtx } = params || {};
        const ctxToUse = useHookCtx(explicitCtx);
        const fetchFn = customFetcher
            ? customFetcher
            : ((url, cfg) => defaultMutationFetcher(url, { method: "PUT", ...cfg }));
        const mutation = useSWRMutation(buildFinalUrl(baseUrl + "/" + id, ctxToUse), async (url, { arg }) => {
            // @ts-ignore
            const raw = await fetchFn(url, {
                // headers,
                payload: arg,
            });
            return parseSchema(schema, raw);
        });
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
export function createUseDeleteModelHook(config) {
    const { url: baseUrl, fetcher: customFetcher } = config;
    return function useDeleteModel(params) {
        const { ctx: explicitCtx, headers } = params || {};
        const ctxToUse = useHookCtx(explicitCtx);
        const fetchFn = customFetcher
            ? customFetcher
            : ((url, cfg) => defaultMutationFetcher(url, { method: "DELETE", ...cfg }));
        const mutation = useSWRMutation(buildFinalUrl(baseUrl, ctxToUse), async (url, { arg }) => {
            // @ts-ignore
            const raw = await fetchFn(url, {
                headers,
                payload: arg,
            });
            return raw;
        });
        return {
            trigger: mutation.trigger,
            data: mutation.data,
            error: mutation.error,
            isMutating: mutation.isMutating,
        };
    };
}
/**
 * Creates a hook to perform a custom mutation (any HTTP method) to the given URL.
 * - `method`: "POST" | "PUT" | "PATCH" | "DELETE"
 * - optional `responseSchema` to validate server response with Zod
 * - `fetcher` falls back to `defaultMutationFetcher`
 */
export function createUseMutationHook(config) {
    const { url: baseUrl, method, payloadSchema, schema, fetcher: customFetcher } = config;
    return function useMutation(params) {
        const { ctx: explicitCtx, headers } = params || {};
        const ctxToUse = useHookCtx(explicitCtx);
        const fetchFn = customFetcher
            ? customFetcher
            : ((url, cfg) => defaultMutationFetcher(url, { method, ...cfg }));
        const mutation = useSWRMutation(buildFinalUrl(baseUrl, ctxToUse), async (url, { arg }) => {
            // @ts-ignore
            const raw = await fetchFn(url, {
                ctx: ctxToUse,
                headers,
                payload: arg,
            });
            return parseSchema(schema, raw);
        });
        const auxTrigger = useCallback((payload) => {
            console.log("ctx", ctxToUse);
            const parsedPayload = parseSchema(payloadSchema, payload);
            mutation.trigger(parsedPayload);
        }, [mutation, payloadSchema]);
        return {
            trigger: auxTrigger,
            data: mutation.data,
            error: mutation.error,
            isMutating: mutation.isMutating,
        };
    };
}
//# sourceMappingURL=modelHooks.js.map