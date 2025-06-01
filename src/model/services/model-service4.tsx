


import { createContext, useContext } from "react";
import useSWR, { BareFetcher, mutate, SWRConfiguration, SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { z, ZodSchema, ZodTypeAny } from "zod";
import { useMutationHook } from "../../services/mutation2";
import { fetcher } from "../../services/fetcher3";

import { ModelServiceOptions } from "./model-service";
import { DefaultFilter, useQueryBuilder, UseQueryBuilderHook } from "../../services/query-builder";
import { ModelContextType } from "./model-context";
import useSWRInfinite from "swr/infinite";

export type ModelConfiguration<Model, Ctx = undefined> = SWRConfiguration & {
    headers?: Record<string, string>
    defaultFilters?: DefaultFilter<Model>[],
    ctx?: Ctx,
}





export interface ModelService<Model, Payload, Ctx = undefined, ID = number> {
    useModel: (id?: ID, options?: ModelConfiguration<Model, Ctx> | undefined) => SWRResponse<Model, any, SWRConfiguration<Model, any, BareFetcher<Model>> | undefined>
    useModelList: (limit: number, offset: number, isDisabled?: boolean, options?: ModelConfiguration<Model, Ctx> | undefined) => SWRResponse<Model[], any, SWRConfiguration<Model[], any, BareFetcher<Model[]>> | undefined>
    useModelListInfinite: (pageSize: number, defaultFilters: DefaultFilter<Model>[], isDisabled?: boolean, options?: ModelConfiguration<Model, Ctx> | undefined) => SWRResponse<Model[], any, SWRConfiguration<Model[], any, BareFetcher<Model[]>> | undefined>
    useLastModel: (options?: ModelConfiguration<Model, Ctx>) => SWRResponse<Model | null, any, SWRConfiguration<Model | null, any, BareFetcher<Model | null>> | undefined>
    useCreateModel: (ctx?: Ctx) => SWRMutationResponse<Model, Error>
    useUpdateModel: (id: ID, ctx?: Ctx) => SWRMutationResponse<Model, Error>
    useDeleteModel: (id: ID, ctx?: Ctx) => SWRMutationResponse<Model, Error>
}



export default function createModelContext<Ctx = undefined>() {


    const CtxContext = createContext<Ctx>({} as Ctx)

    function useCtx() {
        return useContext(CtxContext)
    }


    function useHookCtx<Ctx = undefined>(ctxValue?: Ctx) {
        const ctx = useCtx()
        return ctxValue || ctx || {} as Ctx
    }

    // function createUseModelMutation<Model, Payload, ID = number>


    function createUseModel<Model, ID = number>(url: string, schema: ZodTypeAny){
        function useModel(id?: ID, options?: ModelConfiguration<Model, Ctx> | undefined) {
            const { headers, ctx, ...restOptions } = options || {};
            return useSWR<Model>(
                id ? [url, id, ctx] : null,
                ([url, id, ctx]: [string, ID, Ctx]) => fetcher<Ctx, never, Model>(`${url}/${id}`, { schema, ctx, headers, ...restOptions }),
                restOptions
            )
        }
        return useModel
    }

    function createUseModelList<Model>(url: string, schema: ZodTypeAny){
        function useModelList(
            limit: number,
            offset: number,
            isDisabled: boolean = false,
            options?: ModelConfiguration<Model, Ctx>,
        ) {

            const { filters, where, build, reset, queryString } = useQueryBuilder(schema, options?.defaultFilters || []);
            const ctx = useHookCtx(options?.ctx)

            const { headers, ...restOptions } = options || {};
            // Prepare query parameters with pagination and filters
            let queryParams: Record<string, any> = { limit, offset };

            if (filters.length > 0) {
                // Send the filters as a stringified JSON array
                queryParams.filter = queryString;
            }

            //@ts-ignore
            const getModelList = useSWR<Model[]>(
                !isDisabled ? [url, ctx, queryString] : null,
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

        return useModelList
    }



    function createUseModelInfinite<Model>(url: string, schema: ZodTypeAny){

        function useInfinite(
            pageSize: number,
            defaultFilters: DefaultFilter<Model>[],
            isDisabled: boolean = false,
            options?: ModelConfiguration<Model, Ctx>
        ) {
            const { filters, where, build, reset, queryString } = useQueryBuilder(schema, defaultFilters || []);
            const ctx = useHookCtx(options?.ctx);
            const { headers, ...restOptions } = options || {};

            // Key generator for SWRInfinite
            const getKey = (pageIndex: number, previousPageData: Model[] | null) => {
                // If we've reached the end, return null
                if (previousPageData && previousPageData.length < pageSize) return null;
                if (isDisabled) return null;
                // Compose query string for this page
                let queryParams: Record<string, any> = {
                    limit: pageSize,
                    offset: pageIndex * pageSize,
                };
                if (filters.length > 0) {
                    queryParams.filter = queryString;
                }
                return [url, ctx, JSON.stringify(queryParams)];
            };

            // The fetcher function for each page
            const fetchPage = async ([url, ctx, paramsStr]: [string, Ctx, string]) => {
                const params = JSON.parse(paramsStr);
                return fetcher<Ctx, any, Model[]>(url, {
                    schema: z.array(schema),
                    params,
                    ctx,
                    headers,
                });
            };

            const swrInfinite = useSWRInfinite<Model[]>(getKey, fetchPage, restOptions);


            return {
                ...swrInfinite,
                filters,
                where,
                build,
                reset,
                queryString,
                // Conveniently flatten data for easy consumption
                items: swrInfinite.data ? ([] as Model[]).concat(...swrInfinite.data) : [],
            };
        }
        return useInfinite
    }


    

    return {
        CtxContext,
        useCtx,
        createUseModel,
        createUseModelList,
        createUseModelInfinite,
    }
}