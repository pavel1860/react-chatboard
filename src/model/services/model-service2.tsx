



import useSWR, { BareFetcher, mutate, SWRConfiguration, SWRResponse, useSWRConfig} from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { z, ZodSchema, ZodTypeAny } from "zod";
import { useMutationHook } from "../../services/mutation2";
import { fetcher } from "../../services/fetcher3";

import { ModelServiceOptions } from "./model-service";
import { DefaultFilter, useQueryBuilder, UseQueryBuilderHook } from "../../services/query-builder";
import { ModelContextType } from "./model-context";

export type ModelConfiguration = SWRConfiguration & {
    headers?: Record<string, string>
}


export interface ModelService<Model,Payload, Ctx=undefined, ID=number> {
    useModel: (id?: ID, ctx?: Ctx, options?: ModelConfiguration | undefined) => SWRResponse<Model, any, SWRConfiguration<Model, any, BareFetcher<Model>> | undefined>
    useModelList: (limit: number, offset: number, defaultFilters?: DefaultFilter<Model>[], ctx?: Ctx, isDisabled?: boolean, options?: ModelConfiguration | undefined) => SWRResponse<Model[], any, SWRConfiguration<Model[], any, BareFetcher<Model[]>> | undefined>
    useLastModel: (ctx?: Ctx, filters?: DefaultFilter<Model>, options?: ModelConfiguration) => SWRResponse<Model | null, any, SWRConfiguration<Model | null, any, BareFetcher<Model | null>> | undefined>
    useCreateModel: (ctx?: Ctx) => SWRMutationResponse<Model, Error>
    useUpdateModel: (id: ID, ctx?: Ctx) => SWRMutationResponse<Model, Error>
    useDeleteModel: (id: ID, ctx?: Ctx) => SWRMutationResponse<Model, Error>
}






export default function createModelService<Model, Payload, Ctx=undefined, ID=number>(
        model: string, 
        schema: ZodTypeAny,
        options: ModelServiceOptions = {}
    ): ModelService<Model,Payload, Ctx, ID> {
    const { baseUrl = "/api/ai/model" } = options;
    const modelUrl = `${baseUrl}/${model}`
    const modelListUrl = `${baseUrl}/${model}/list`
    const modelLastUrl = `${baseUrl}/${model}/last`
    const modelCreateUrl = `${baseUrl}/${model}/create`
    const modelUpdateUrl = `${baseUrl}/${model}/update`
    const modelDeleteUrl = `${baseUrl}/${model}/delete`

    function useModel(id?: ID, ctx?: Ctx, options?: ModelConfiguration | undefined) {
        const { headers, ...restOptions } = options || {};
        return useSWR<Model>(
            ctx && id ? [modelUrl, id, ctx] : null,
            ([url, id, ctx]: [string, ID, Ctx]) => fetcher<Ctx, never ,Model>(`${url}/${id}`, { schema, ctx, headers }),
            restOptions
        )
    }



    function useModelList(
        limit: number, 
        offset: number, 
        defaultFilters?: DefaultFilter<Model>[], 
        ctx?: Ctx, 
        isDisabled: boolean = false, 
        options?: ModelConfiguration,
    ) {
        
        const { filters, where, build, reset, queryString } = useQueryBuilder(schema, defaultFilters);


        const { headers, ...restOptions } = options || {};
        // Prepare query parameters with pagination and filters
        let queryParams: Record<string, any> = { limit, offset };

        if (filters.length > 0) {
            // Send the filters as a stringified JSON array
            queryParams.filter = queryString;
        }

        //@ts-ignore
        const getModelList = useSWR<Model[]>(
            !isDisabled ? [modelListUrl, ctx, queryString] : null,
            ([url, ctx, queryString]: [string, Ctx, string]) => 
                fetcher<Ctx, any, Model[]>(url, { schema: z.array(schema), params: queryParams, ctx, headers }),
            restOptions
        );

        return {
            ...getModelList,
            filters,
            where,
            build,
            reset,
            queryString,
        }
    }



    function useLastModel<Ctx, Model>(ctx: Ctx, partitions: any, filters?: DefaultFilter<Model>, options?: ModelConfiguration) {        

        const queryParams: Record<string, any> = { ...partitions };

        if (filters) {
            queryParams.filter = JSON.stringify(filters);
        }

        const { headers, ...restOptions } = options || {};

        return useSWR<Model | null>(
            [modelLastUrl, queryParams, ctx],
            ([url, queryParams, ctx]: [string, Record<string, any>, Ctx]) => 
                fetcher<Ctx, never, Model>(url, { 
                    schema, 
                    params: 
                    queryParams,                     
                    ctx,
                    headers
                }),
                restOptions
        )
    }

    function useCreateModel<Ctx, Payload, Model>(ctx: Ctx) {
        

        return useMutationHook<Ctx, Payload, Model>(modelCreateUrl, { 
            ctx, 
            schema, 
            method: 'POST',            
        });
    }

    function useUpdateModel<ID, Ctx, Payload, Model>(id: ID, ctx: Ctx) {
        return useMutationHook<Ctx, Payload, Model>(modelUpdateUrl, { ctx, schema, method: 'PUT' });
    }

    function useDeleteModel<ID, Ctx, Payload, Model>(id: ID, ctx: Ctx) {
        return useMutationHook<Ctx, Payload, Model>(modelDeleteUrl, { ctx, schema, method: 'DELETE' });
    }

    return {
        useModel,
        useModelList,        
        useLastModel,
        useCreateModel,
        useUpdateModel,
        useDeleteModel,
    }
}