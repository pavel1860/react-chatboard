import useSWR, { SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { AnyZodObject, z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useMutationHook } from "../../services/mutation";
import { fetcher } from "../../services/fetcher3";
import { DefaultFilter, useQueryBuilder, UseQueryBuilderHook } from "../../services/query-builder";
import { ModelContextType, ModelContextSchema } from "./model-context";





export type ModelServiceOptions = {
    // isArtifact?: boolean,
    baseUrl?: string,
    // isHead?: boolean,
}



export interface ModelService<T extends AnyZodObject, CTX extends ModelContextType> {
    useModel: <M extends z.infer<T>>(id: string | number | undefined, filters?: DefaultFilter<M>) => SWRResponse<M | null>
    useModelList: <M extends z.infer<T>>(limit?: number, offset?: number, filters?: DefaultFilter<T>[], ctx?: CTX, isActive?: boolean) => SWRResponse<M[]> & UseQueryBuilderHook<M>
    useLastModel: <M extends z.infer<T>>(filters?: DefaultFilter<M>, ctx?: CTX) => SWRResponse<M | null>
    useCreateModel: <M extends z.infer<T>>(ctx?: CTX) => SWRMutationResponse<M, Error>
    useUpdateModel: <M extends z.infer<T>>(id: string | number | undefined | null, ctx?: CTX) => SWRMutationResponse<M, Error>
    useDeleteModel: <M extends z.infer<T>>(id: string | number | undefined | null, ctx?: CTX) => SWRMutationResponse<M, Error>
}



export default function createModelService<T extends AnyZodObject, CTX extends ModelContextType>(model: string, schema: T, options: ModelServiceOptions = {}): ModelService<T, CTX> {
    const { baseUrl = "/api/ai/model" } = options;
    
    // type ModelArtifactType = T & BaseArtifactType

    function useModel<M extends z.infer<T>>(id: string | number | undefined, ctx: CTX): SWRResponse<M | null> {        

        // Prepare query parameters with filters
        const queryParams: Record<string, any> = {};

        // Add filters to query params if provided


        //@ts-ignore
        return useSWR<T>(
            id ? [`${baseUrl}/${model}/id/${id}`, ctx] : null,
            ([url, ctx]) => fetcher<T, CTX>(url, {
                schema,
                ctx: ctx
            })
        );
    }

    function useModelList<M extends z.infer<T>>(limit: number = 10, offset: number = 0, defaultFilters: DefaultFilter<T>[] = [], ctx: CTX, isActive: boolean = true): SWRResponse<M[]> & UseQueryBuilderHook<M> {

        const { filters, where, build, reset, queryString } = useQueryBuilder(schema, defaultFilters);

        // Prepare query parameters with pagination and filters
        let queryParams: Record<string, any> = { limit, offset };

        if (filters.length > 0) {
            // Send the filters as a stringified JSON array
            queryParams.filter = queryString;
        }

        // const isActive = (env.branchId || env.turnId || env.headId) !== undefined

        //@ts-ignore
        const getModelList = useSWR<M[]>(
            isActive ? [`${baseUrl}/${model}/list`, limit, offset, queryString, ctx] : null,
            ([url, limit, offset, queryString, ctx]) => fetcher(
                url, {
                    schema: z.array(schema),
                    queryParams,
                    ctx: ctx
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

    function useLastModel<M extends z.infer<T>>(partitions: any, ctx: CTX = {}) {
        // const env = useHeadEnv();

        // Prepare query parameters with partitions and filters
        const queryParams: Record<string, any> = { ...partitions };

        // Add filters to query params if provided
        // if (filters) {
        //     Object.assign(queryParams, filtersToQueryParams(filters));
        // }

        //@ts-ignore
        return useSWR<M | null>(
            [`${baseUrl}/${model}/last`, partitions, ctx],
            ([url, partitions, ctx]) => fetcher<T, CTX>(url, {
                schema,
                queryParams,
                ctx
            })
        );
    }

    function useCreateModel<M extends z.infer<T>>(ctx: CTX) {
        // const env = useHeadEnv();

        //@ts-ignore
        return useMutationHook<M, M>({ schema, endpoint: `${baseUrl}/${model}/create`, ctx });
    }

    function useUpdateModel<M extends z.infer<T> >(id: string | number | undefined | null, ctx: CTX) {
        // const env = useHeadEnv();

        //@ts-ignore
        return useMutationHook<M, M>({ schema, endpoint: id && `${baseUrl}/${model}/update/${id}`, ctx });
    }

    function useDeleteModel<M extends z.infer<T>>(id: string | number | undefined | null, ctx: CTX) {
        // const env = useHeadEnv();

        //@ts-ignore
        return useMutationHook<M, M>({ schema, endpoint: id && `${baseUrl}/${model}/delete/${id}`, ctx });
    }

    return {
        useModel,
        useModelList,
        useLastModel,
        useCreateModel,
        useUpdateModel,
        useDeleteModel,
    };
}








