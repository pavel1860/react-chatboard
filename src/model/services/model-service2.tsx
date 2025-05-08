



import useSWR, { SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { z, ZodSchema } from "zod";
import { useMutationHook } from "../../services/mutation2";
import { fetcher } from "../../services/fetcher3";

import { ModelServiceOptions } from "./model-service";
import { DefaultFilter, useQueryBuilder, UseQueryBuilderHook } from "../../services/query-builder";
import { ModelContextType } from "./model-context";




export interface ModelService<Ctx, Payload, Model> {
    useModel: <Ctx, Model>(ctx?: Ctx) => SWRResponse<Ctx & Model | null>
    useModelList: <Ctx, Payload, Model>(ctx?: Ctx, limit?: number, offset?: number, filters?: DefaultFilter<Model>[]) => SWRResponse<(Model)[]> & UseQueryBuilderHook<Model>
    useLastModel: <Ctx, Payload, Model>(ctx?: Ctx, filters?: DefaultFilter<Model>) => SWRResponse<Ctx & Model | null>
    useCreateModel: <Ctx, Payload, Model>(ctx?: Ctx) => SWRMutationResponse<Model, Error>
    useUpdateModel: <Ctx, Payload, Model>(ctx?: Ctx, id?: string) => SWRMutationResponse<Model, Error>
    useDeleteModel: <Ctx, Payload, Model>(ctx?: Ctx, id?: string) => SWRMutationResponse<Model, Error>
}



export default function createModelService<Ctx, Payload, Model>(
        model: string, 
        schema: ZodSchema<Model>,
        options: ModelServiceOptions = {}
    ): ModelService<Ctx, Payload, Model> {
    const { baseUrl = "/api/ai/model" } = options;
    const modelUrl = `${baseUrl}/${model}`
    const modelListUrl = `${baseUrl}/${model}/list`
    const modelLastUrl = `${baseUrl}/${model}/last`
    const modelCreateUrl = `${baseUrl}/${model}/create`
    const modelUpdateUrl = `${baseUrl}/${model}/update`
    const modelDeleteUrl = `${baseUrl}/${model}/delete`

    function useModel<Ctx, Model>(ctx?: Ctx) {
        return useSWR<Model>(
            ctx ? [modelUrl, ctx] : null,
            ([url, ctx]: [string, Ctx]) => fetcher<Ctx, never ,Model>(url, { schema, ctx })
        )
    }



    function useModelList<Ctx, Payload, Model>(ctx?: Ctx, limit?: number, offset?: number, defaultFilters?: DefaultFilter<Model>[]) {
        
        const { filters, where, build, reset, queryString } = useQueryBuilder(schema, defaultFilters);

        // Prepare query parameters with pagination and filters
        let queryParams: Record<string, any> = { limit, offset };

        if (filters.length > 0) {
            // Send the filters as a stringified JSON array
            queryParams.filter = queryString;
        }
        //@ts-ignore
        const getModelList = useSWR<Model[]>(
            ctx ? [modelListUrl, ctx, queryString] : null,
            ([url, ctx, queryString]: [string, Ctx, string]) => 
                fetcher<Ctx, any, Model[]>(url, { schema: z.array(schema), queryParams, ctx })
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



    function useLastModel<Ctx, Model>(ctx: Ctx, partitions: any, filters?: DefaultFilter<Model>) {        

        const queryParams: Record<string, any> = { ...partitions };

        if (filters) {
            queryParams.filter = JSON.stringify(filters);
        }

        return useSWR<Model | null>(
            [modelLastUrl, queryParams, ctx],
            ([url, queryParams, ctx]: [string, Record<string, any>, Ctx]) => fetcher<Ctx, never, Model>(url, { schema, queryParams, ctx })
        )
    }

    function useCreateModel<Ctx, Payload, Model>(ctx: Ctx) {
        

        return useMutationHook<Ctx, Payload, Model>(modelCreateUrl, { ctx, schema, method: 'POST' });
    }

    function useUpdateModel<Ctx, Payload, Model>(ctx: Ctx) {
        return useMutationHook<Ctx, Payload, Model>(modelUpdateUrl, { ctx, schema, method: 'PUT' });
    }

    function useDeleteModel<Ctx, Payload, Model>(ctx: Ctx) {
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