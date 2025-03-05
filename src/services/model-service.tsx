import useSWR, { SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { AnyZodObject, z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useHeadEnv } from "../hooks/artifact-log-hook";
import { useMutationHook } from "./mutation";
import { fetcher } from "./fetcher2";

// Filter operations
export enum FilterOperation {
    EQUALS = 'eq',
    GREATER_THAN = 'gt',
    LESS_THAN = 'lt',
    GREATER_THAN_OR_EQUAL = 'gte',
    LESS_THAN_OR_EQUAL = 'lte',
}

// Generic field filter type with value type parameter
export type FieldFilter<T> = {
    operation: FilterOperation;
    value: T;
};

// Type-safe filters for a specific model type
export type TypedModelFilters<T> = {
    [K in keyof T]?: T[K] | FieldFilter<T[K]>;
};

// Legacy untyped filter type for backward compatibility
export type ModelFilters = {
    [field: string]: FieldFilter<any> | (string | number | boolean);
};

// Helper function to convert filters to query params
function filtersToQueryParams<T>(filters: TypedModelFilters<T> | ModelFilters): Record<string, any> {
    const queryParams: Record<string, any> = {};

    Object.entries(filters).forEach(([field, filter]) => {
        // If filter is a simple value, use equality operation by default
        if (typeof filter !== 'object' || filter === null) {
            queryParams[field] = filter;
        } else if ('operation' in filter && 'value' in filter) {
            // For complex filters with operations
            queryParams[`${field}_${filter.operation}`] = filter.value;
        }
    });

    return { filters: JSON.stringify(queryParams) };
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
    useGetModelList: <M extends z.infer<T> & BaseArtifactType>(limit: number, offset: number, filters?: TypedModelFilters<M>) => SWRResponse<M[]>
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

    function useGetModel<M extends z.infer<T> & BaseArtifactType>(id: string | number, filters?: TypedModelFilters<M>): SWRResponse<M | null> {
        const env = useHeadEnv();

        // Prepare query parameters with filters
        const queryParams: Record<string, any> = {};

        // Add filters to query params if provided
        if (filters) {
            Object.assign(queryParams, filtersToQueryParams(filters));
        }

        //@ts-ignore
        return useSWR<M | null>(
            [`${baseUrl}/${model}/id/${id}`, filters, env],
            ([url, filters, env]) => fetcher({
                schema: ModelArtifactSchema,
                endpoint: url,
                queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
                env
            })
        );
    }

    function useGetModelList<M extends z.infer<T> & BaseArtifactType>(limit: number = 10, offset: number = 0, filters?: TypedModelFilters<M>): SWRResponse<M[]> {
        const env = useHeadEnv();

        // Prepare query parameters with pagination and filters
        const queryParams: Record<string, any> = { limit, offset };

        // Add filters to query params if provided
        if (filters) {
            Object.assign(queryParams, filtersToQueryParams(filters));
        }

        //@ts-ignore
        return useSWR<M[]>(
            [`${baseUrl}/${model}/list`, limit, offset, filters, env],
            ([url, limit, offset, filters, env]) => fetcher({
                schema: z.array(ModelArtifactSchema),
                endpoint: url,
                queryParams,
                env
            })
        );
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










