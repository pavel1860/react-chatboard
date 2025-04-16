import useSWR, { SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { AnyZodObject, z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useHeadEnv } from "../hooks/artifact-head-hooks";
import { useMutationHook } from "../../services/mutation";
import { fetcher, VersionHead } from "../../services/fetcher3";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BaseHeadSchema } from "../../services/head-model-service";
import { useQueryBuilder } from "../../services/query-builder";





export type ModelServiceOptions = {
    // isArtifact?: boolean,
    baseUrl?: string,
    // isHead?: boolean,
}



export interface ModelService<T extends AnyZodObject> {
    useModel: <M extends z.infer<T>>(id: string | number | undefined, filters?: DefaultFilter<M>) => SWRResponse<M | null>
    useModelList: <M extends z.infer<T>>(limit?: number, offset?: number, filters?: DefaultFilter<T>[], env?: VersionHead, isActive?: boolean) => SWRResponse<M[]> & UseQueryBuilderHook<M>
    useLastModel: <M extends z.infer<T>>(partitions: any, filters?: DefaultFilter<M>) => SWRResponse<M | null>
    useCreateModel: <M extends z.infer<T>>(env?: VersionHead) => SWRMutationResponse<M, Error>
    useUpdateModel: <M extends z.infer<T>>(id?: string, env?: VersionHead) => SWRMutationResponse<M, Error>
    useDeleteModel: <M extends z.infer<T>>(id?: string, env?: VersionHead) => SWRMutationResponse<M, Error>
}



export default function createModelService<T extends AnyZodObject>(model: string, schema: T, options: ModelServiceOptions = {}): ModelService<T> {
    const { baseUrl = "/api/ai/model" } = options;
    
    // type ModelArtifactType = T & BaseArtifactType

    function useModel<M extends z.infer<T>>(id: string | number | undefined, head: VersionHead = {} ): SWRResponse<M | null> {        

        // Prepare query parameters with filters
        const queryParams: Record<string, any> = {};

        // Add filters to query params if provided


        //@ts-ignore
        return useSWR<M | null>(
            id ? [`${baseUrl}/${model}/id/${id}`, env] : null,
            ([url, env]) => fetcher({
                schema,
                endpoint: url,
                head
            })
        );
    }

    function useModelList<M extends z.infer<T>>(limit: number = 10, offset: number = 0, defaultFilters: DefaultFilter<T>[] = [], head: VersionHead = {}, isActive: boolean = true): SWRResponse<M[]> & UseQueryBuilderHook<M> {

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
            isActive ? [`${baseUrl}/${model}/list`, limit, offset, queryString, head, head.branchId, head.turnId] : null,
            ([url, limit, offset, queryString, env]) => fetcher({
                schema: z.array(schema),
                endpoint: url,
                queryParams,
                head
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

    function useLastModel<M extends z.infer<T>>(partitions: any, head: VersionHead = {}) {
        // const env = useHeadEnv();

        // Prepare query parameters with partitions and filters
        const queryParams: Record<string, any> = { ...partitions };

        // Add filters to query params if provided
        // if (filters) {
        //     Object.assign(queryParams, filtersToQueryParams(filters));
        // }

        //@ts-ignore
        return useSWR<M | null>(
            [`${baseUrl}/${model}/last`, partitions, head],
            ([url, partitions, head]) => fetcher({
                schema,
                endpoint: url,
                queryParams,
                head
            })
        );
    }

    function useCreateModel<M extends z.infer<T>>(head: VersionHead = {}) {
        // const env = useHeadEnv();

        //@ts-ignore
        return useMutationHook<M, M>({ schema, endpoint: `${baseUrl}/${model}/create`, env });
    }

    function useUpdateModel<M extends z.infer<T> >(id?: string | number, head: VersionHead = {}) {
        // const env = useHeadEnv();

        //@ts-ignore
        return useMutationHook<M, M>({ schema, endpoint: id && `${baseUrl}/${model}/update/${id}`, head });
    }

    function useDeleteModel<M extends z.infer<T>>(id?: string | number, head: VersionHead = {}) {
        // const env = useHeadEnv();

        //@ts-ignore
        return useMutationHook<M, M>({ schema, endpoint: id && `${baseUrl}/${model}/delete/${id}`, head });
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








