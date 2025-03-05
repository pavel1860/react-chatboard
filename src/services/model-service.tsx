import useSWR, { SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { AnyZodObject, z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useHeadEnv } from "../hooks/artifact-log-hook";
import { useMutationHook } from "./mutation";
import { fetcher } from "./fetcher2";
import { useCallback, useEffect, useMemo, useState } from "react";


interface UseQueryBuilderHook<T extends Record<string, any>> {
    // The array of filter strings (including any default filters)
    filters: string[];

    // Adds a filter condition. The tuple's types are inferred from your Zod schema.
    where: <K extends keyof T>(
        filter: [K, FilterOperators<T[K]>, T[K]]
    ) => void;

    // Builds and returns the complete query string (e.g., "name==arnold&and&final_score>=15")
    build: () => string;

    // Resets the filter state to an empty array.
    reset: () => void;

    queryString: string;
}


export type FilterOperators<T> = T extends number
    ? '==' | '>' | '<' | '>=' | '<='
    : T extends string
    ? '==' | 'contains'
    : never;

// A tuple representing a condition for a given field.
export type FilterTuple<T> = [keyof T, FilterOperators<T[keyof T]>, T[keyof T]];

// A default filter can be a tuple or a logical operator ("and" or "or").
export type DefaultFilter<T> = FilterTuple<T> | 'and' | 'or';

/**
 * A React hook for building query parameters with Zod validation.
 *
 * @param schema A Zod object schema defining valid fields and their types.
 * @param defaultFilters Optional default filters provided as an array of tuples or logical operators.
 * @returns An object with functions to add filters, build the query string, and reset the filters.
 */
export function useQueryBuilder<T extends Record<string, any>>(
    schema: z.ZodObject<T>,
    defaultFilters?: DefaultFilter<T>[]
): UseQueryBuilderHook<T> {
    // Pre-populate the filters state if default filters are provided.
    const initialFilters: Array<FilterTuple<T> | string> = defaultFilters || [];

    const [filters, setFilters] = useState<Array<FilterTuple<T> | string>>(initialFilters);

    /**
     * Adds a filter condition to the query using a tuple.
     * The tuple is destructured into [field, operator, value] and validated.
     */
    const where = useCallback(
        <K extends keyof T>(filter: [K, FilterOperators<T[K]>, T[K]]) => {
            const [field, operator, value] = filter;
            if (!(field in schema.shape)) {
                throw new Error(`Field "${String(field)}" is not defined in the schema.`);
            }
            const fieldSchema = schema.shape[field];
            const result = fieldSchema.safeParse(value);
            if (!result.success) {
                throw new Error(
                    `Invalid value for field "${String(field)}": ${result.error.message}`
                );
            }
            
            // Store the filter tuple directly in the array
            setFilters((prev) => [...prev, filter as unknown as FilterTuple<T>]);
        },
        [schema]
    );

    // Build a JSON string representation of the filters array
    const build = useCallback(() => {
        return JSON.stringify(filters);
    }, [filters]);

    const reset = useCallback(() => setFilters([]), []);

    // Create the queryString as a JSON representation
    const queryString = useMemo(() => {
        return JSON.stringify(filters);
    }, [filters]);

    return { filters, where, build, reset, queryString };
}







export const BaseArtifactSchema = z.object({
    id: z.number(),
    score: z.number(),
    turn_id: z.number(),
    branch_id: z.number(),
    created_at: z.string(),
    // updated_at: z.string(),
})


export const BaseHeadSchema = z.object({
    id: z.number(),
    head_id: z.number(),
})


export type BaseArtifactType = z.infer<typeof BaseArtifactSchema>


export type ModelServiceOptions = {
    isArtifact?: boolean,
    baseUrl?: string,
    isHead?: boolean,
}



export interface ModelService<T extends AnyZodObject> {
    ModelArtifactSchema: ZodSchema<T & BaseArtifactType>
    useGetModel: <M extends z.infer<T> & BaseArtifactType>(id: string, filters?: TypedModelFilters<M>) => SWRResponse<M | null>
    useGetModelList: <M extends z.infer<T> & BaseArtifactType>(limit: number, offset: number, filters?: DefaultFilter<T>[]) => SWRResponse<M[]> & UseQueryBuilderHook<M>
    useLastModel: <M extends z.infer<T> & BaseArtifactType>(partitions: any, filters?: TypedModelFilters<M>) => SWRResponse<M | null>
    useCreateModel: <M extends z.infer<T> & BaseArtifactType>() => SWRMutationResponse<M, Error>
    useUpdateModel: <M extends z.infer<T> & BaseArtifactType>(id?: string) => SWRMutationResponse<M, Error>
    useDeleteModel: <M extends z.infer<T> & BaseArtifactType>(id?: string) => SWRMutationResponse<M, Error>
}



export default function createModelService<T extends AnyZodObject>(model: string, schema: T, options: ModelServiceOptions): ModelService<T> {
    const { isArtifact = false, baseUrl = "/api/ai/model", isHead = false } = options;

    if (isHead && isArtifact) {
        throw new Error("Head and Artifact cannot be true at the same time")
    }

    const ModelArtifactSchema = isHead ? BaseHeadSchema.merge(schema) : isArtifact ? BaseArtifactSchema.merge(schema) : schema
    // type ModelArtifactType = T & BaseArtifactType

    function useGetModel<M extends z.infer<T> & BaseArtifactType>(id: string | number): SWRResponse<M | null> {
        const env = useHeadEnv();

        // Prepare query parameters with filters
        const queryParams: Record<string, any> = {};

        // Add filters to query params if provided


        //@ts-ignore
        return useSWR<M | null>(
            [`${baseUrl}/${model}/id/${id}`, env],
            ([url, env]) => fetcher({
                schema: ModelArtifactSchema,
                endpoint: url,
                env
            })
        );
    }

    function useGetModelList<M extends z.infer<T> & BaseArtifactType>(limit: number = 10, offset: number = 0, defaultFilters: DefaultFilter<T>[] = []): SWRResponse<M[]> & UseQueryBuilderHook<M> {
        const env = useHeadEnv();

        const { filters, where, build, reset, queryString } = useQueryBuilder(ModelArtifactSchema, defaultFilters);

        // Prepare query parameters with pagination and filters
        let queryParams: Record<string, any> = { limit, offset };

        if (filters.length > 0) {
            // Send the filters as a stringified JSON array
            queryParams.filter = queryString;
        }

        //@ts-ignore
        const getModelList = useSWR<M[]>(
            [`${baseUrl}/${model}/list`, limit, offset, queryString, env],
            ([url, limit, offset, queryString, env]) => fetcher({
                schema: z.array(ModelArtifactSchema),
                endpoint: url,
                queryParams,
                env
            })
        );

        return {
            ...getModelList,
            filters,
            where,
            build,
            reset,
            queryString
        }
    }

    function useLastModel<M extends z.infer<T> & BaseArtifactType>(partitions: any, filters?: TypedModelFilters<M>) {
        const env = useHeadEnv();

        // Prepare query parameters with partitions and filters
        const queryParams: Record<string, any> = { ...partitions };

        // Add filters to query params if provided
        if (filters) {
            Object.assign(queryParams, filtersToQueryParams(filters));
        }

        //@ts-ignore
        return useSWR<M | null>(
            [`${baseUrl}/${model}/last`, partitions, filters, env],
            ([url, partitions, filters, env]) => fetcher({
                schema: ModelArtifactSchema,
                endpoint: url,
                queryParams,
                env
            })
        );
    }

    function useCreateModel<M extends z.infer<T> & BaseArtifactType>() {
        const env = useHeadEnv();

        //@ts-ignore
        return useMutationHook<M, M>({ schema: ModelArtifactSchema, endpoint: `${baseUrl}/${model}/create`, env });
    }

    function useUpdateModel<M extends z.infer<T> & BaseArtifactType>(id?: string | number) {
        const env = useHeadEnv();

        //@ts-ignore
        return useMutationHook<M, M>({ schema: ModelArtifactSchema, endpoint: id && `${baseUrl}/${model}/update/${id}`, env });
    }

    function useDeleteModel<M extends z.infer<T> & BaseArtifactType>(id?: string | number) {
        const env = useHeadEnv();

        //@ts-ignore
        return useMutationHook<M, M>({ schema: ModelArtifactSchema, endpoint: id && `${baseUrl}/${model}/delete/${id}`, env });
    }

    return {
        ModelArtifactSchema,
        useGetModel,
        useGetModelList,
        useLastModel,
        useCreateModel,
        useUpdateModel,
        useDeleteModel,
    };
}










