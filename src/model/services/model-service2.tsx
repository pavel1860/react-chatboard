



import useSWR, { SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { z, ZodSchema } from "zod";
import { useMutationHook } from "../../services/mutation2";
import { fetcher } from "../../services/fetcher3";

import { ModelServiceOptions } from "./model-service";
import { DefaultFilter, useQueryBuilder, UseQueryBuilderHook } from "../../services/query-builder";
import { ModelContextType } from "./model-context";




export interface ModelService<Ctx, Model> {
    ModelSchema: ZodSchema<Ctx & Model>
    useModel: <Ctx, Model>(ctx?: Ctx) => SWRResponse<Ctx & Model | null>
    useModelList: <Ctx, Model>(ctx?: Ctx, limit?: number, offset?: number, filters?: DefaultFilter<Model>[]) => SWRResponse<(Ctx & Model)[]> & UseQueryBuilderHook<Ctx & Model>
    useLastModel: <Ctx, Model>(ctx?: Ctx, filters?: DefaultFilter<Model>) => SWRResponse<Ctx & Model | null>
    useCreateModel: <Ctx, Model>(ctx?: Ctx) => SWRMutationResponse<Ctx & Model, Error>
    useUpdateModel: <Ctx, Model>(ctx?: Ctx, id?: string) => SWRMutationResponse<Ctx & Model, Error>
    useDeleteModel: <Ctx, Model>(ctx?: Ctx, id?: string) => SWRMutationResponse<Ctx & Model, Error>
}



export default function createModelService<Ctx, Model>(model: string, schema: ZodSchema<Ctx & Model>, options: ModelServiceOptions = {}): ModelService<Ctx, Model> {
    const { baseUrl = "/api/ai/model" } = options;
    

    function useModel<Ctx, Model>(ctx?: Ctx) {
        const url = `${baseUrl}/${model}`
        return useSWR<Ctx, Model>(
            ctx ? [url, ctx] : null,
            ([url, ctx]: [string, Ctx]) => fetcher<Ctx, Model, Ctx & Model>(url, { schema, ctx })
        )
    }



    function useModelList<Ctx, Model>(ctx?: Ctx, limit?: number, offset?: number, defaultFilters?: DefaultFilter<Model>[]) {
        
        const { filters, where, build, reset, queryString } = useQueryBuilder(schema, defaultFilters);

        // Prepare query parameters with pagination and filters
        let queryParams: Record<string, any> = { limit, offset };

        if (filters.length > 0) {
            // Send the filters as a stringified JSON array
            queryParams.filter = queryString;
        }
        //@ts-ignore
        const getModelList = useSWR<(Ctx & Model)[]>(
            ctx ? [`${baseUrl}/${model}/list`, ctx, queryString] : null,
            ([url, ctx, queryString]: [string, Ctx, string]) => 
                fetcher<Ctx, any, (Ctx & Model)[]>(url, { schema: z.array(schema), queryParams, ctx })
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

    

    // function useModelList<Ctx, Model>(ctx?: Ctx, limit?: number, offset?: number, defaultFilters?: DefaultFilter<Model>[]) {
        
    //     const { filters, where, build, reset, queryString } = useQueryBuilder(schema, defaultFilters);

    //     // Prepare query parameters with pagination and filters
    //     let queryParams: Record<string, any> = { limit, offset };
    //     type CtxModel = Ctx & Model
    //     if (filters.length > 0) {
    //         // Send the filters as a stringified JSON array
    //         queryParams.filter = queryString;
    //     }
    //     //@ts-ignore
    //     const {data, isLoading, error, mutate} = useSWR<CtxModel[]>(
    //         ctx ? [`${baseUrl}/${model}/list`, ctx, queryString] : null,
    //         ([url, ctx, queryString]: [string, Ctx, string]) => 
    //             fetcher<Ctx, any, CtxModel[]>(url, { schema: z.array(schema), queryParams, ctx })
    //     );

    //     console.log(data)

    //     return {
    //         // ...getModelList,
    //         filters,
    //         where,
    //         build,
    //         reset,
    //         queryString,
    //     }
    // }


    function useLastModel<Ctx, Model>(ctx: Ctx, partitions: any, filters?: DefaultFilter<Model>) {        

        const queryParams: Record<string, any> = { ...partitions };

        if (filters) {
            queryParams.filter = JSON.stringify(filters);
        }

        return useSWR<Model | null>(
            [`${baseUrl}/${model}/last`, queryParams, ctx],
            ([url, queryParams, ctx]: [string, Record<string, any>, Ctx]) => fetcher<Ctx, undefined, Model>(url, { schema, queryParams, ctx })
        )
    }

    function useCreateModel<Ctx, Model>(ctx: Ctx) {
        

        return useMutationHook<Ctx, Model, Ctx & Model>(`${baseUrl}/${model}`, { ctx, schema, method: 'POST' });
    }

    function useUpdateModel<Ctx, Model>(ctx: Ctx, modelId: string | undefined) {
        return useMutationHook<Ctx, Model, Ctx & Model>(`${baseUrl}/${model}/${modelId}`, { ctx, schema, method: 'PUT' });
    }

    function useDeleteModel<Ctx, Model>(ctx: Ctx, modelId: string | undefined) {
        return useMutationHook<Ctx, Model, Ctx & Model>(`${baseUrl}/${model}/${modelId}`, { ctx, schema, method: 'DELETE' });
    }

    return {
        useModelList,
        useModel,
        useLastModel,
        useCreateModel,
        useUpdateModel,
        useDeleteModel,
    }
}