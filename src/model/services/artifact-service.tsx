import useSWR, { SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { AnyZodObject, z, ZodSchema, ZodObject, ZodTypeAny, ZodType } from "zod";
import { useMutationHook } from "../../services/mutation2";
import { fetcher } from "../../services/fetcher3";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ModelServiceOptions } from "./model-service";
import { DefaultFilter, useQueryBuilder, UseQueryBuilderHook } from "../../services/query-builder";
import { ModelContextType } from "./model-context";

export const BaseArtifactSchema = z.object({
    id: z.number(),
    score: z.number().nullable().optional(),
    turn_id: z.number(),
    branch_id: z.number(),
    created_at: z.string(),
    // updated_at: z.string(),
})

export type BaseArtifactType = z.infer<typeof BaseArtifactSchema>

export interface ArtifactService<T extends AnyZodObject> {
    ArtifactSchema: ZodSchema<T & BaseArtifactType>
    useArtifact: <M extends z.infer<T> & BaseArtifactType>(artifactId: string | number | undefined, version?: string | undefined) => SWRResponse<M | null>
    useArtifactList: <M extends z.infer<T> & BaseArtifactType>(branchId: number, turnId?: number, limit?: number, offset?: number, filters?: DefaultFilter<T>[]) => SWRResponse<M[]> & UseQueryBuilderHook<M>
    useLastArtifact: <M extends z.infer<T> & BaseArtifactType>(partitions: any, filters?: DefaultFilter<M>) => SWRResponse<M | null>
    useCreateArtifact: <M extends z.infer<T> & BaseArtifactType>() => SWRMutationResponse<M, Error>
    useUpdateArtifact: <M extends z.infer<T> & BaseArtifactType>(id?: string) => SWRMutationResponse<M, Error>
    useDeleteArtifact: <M extends z.infer<T> & BaseArtifactType>(id?: string) => SWRMutationResponse<M, Error>
}





export default function createArtifactService<T extends AnyZodObject, CTX extends ModelContextType>(model: string, schema: T, options: ModelServiceOptions = {}) {
    const { baseUrl = "/api/ai/artifact" } = options;

    const ArtifactSchema = BaseArtifactSchema.merge(schema)


    function useArtifact<M extends (z.infer<T> & BaseArtifactType)>(ctx: CTX, artifactId: string | undefined, version: string | undefined = undefined) {


        const url = useMemo(() => {
            if (version) {
                return `${baseUrl}/${model}/${artifactId}/version/${version}`
            } else if (artifactId) {
                return `${baseUrl}/${model}/${artifactId}`
            } else {
                return null
            }
        }, [artifactId, version])


        return useSWR<M | null>(
            url ? [url, ctx] : null,
            ([url, ctx]: [string, CTX]) => fetcher<M, CTX>(url, { schema: ArtifactSchema, ctx })
        )
    }



    function useArtifactList<M extends z.infer<T> & BaseArtifactType>(ctx: CTX, limit?: number, offset?: number, defaultFilters?: DefaultFilter<M>[]) {
        
        const isActive = true
        
        const { filters, where, build, reset, queryString } = useQueryBuilder(schema, defaultFilters);

        // Prepare query parameters with pagination and filters
        let queryParams: Record<string, any> = { limit, offset };

        if (filters.length > 0) {
            // Send the filters as a stringified JSON array
            queryParams.filter = queryString;
        }

        // const isActive = (env.branchId || env.turnId || env.headId) !== undefined

        //@ts-ignore
        const getArtifactList = useSWR<M[]>(
            isActive ? [`${baseUrl}/${model}/list`, limit, offset, queryString, ctx] : null,
            ([url, limit, offset, queryString, ctx]: [string, number, number, string, CTX]) => 
                fetcher<M[], CTX>(url, { schema: z.array(ArtifactSchema), queryParams, ctx })
        );

        return {
            ...getArtifactList,
            filters,
            where,
            build,
            reset,
            queryString,
            // branchId: currBranchId,
            // turnId: currTurnId,
            // setBranchId: setCurrBranchId,
            // setTurnId: setCurrTurnId,
        }
    }


    function useLastArtifact<M extends z.infer<T> & BaseArtifactType>(ctx: CTX, partitions: any, filters?: DefaultFilter<M>) {        

        const queryParams: Record<string, any> = { ...partitions };

        if (filters) {
            queryParams.filter = JSON.stringify(filters);
        }

        return useSWR<M | null>(
            [`${baseUrl}/${model}/last`, queryParams, ctx],
            ([url, queryParams, ctx]: [string, Record<string, any>, CTX]) => fetcher<M, CTX>(url, { schema: ArtifactSchema, queryParams, ctx })
        )
    }

    function useCreateArtifact<M extends z.infer<T> & BaseArtifactType>(ctx: CTX) {
        

        return useMutationHook<M, M, CTX>(`${baseUrl}/${model}`, { schema, ctx, method: 'POST' });
    }

    function useUpdateArtifact<M extends z.infer<T> & BaseArtifactType>(ctx: CTX, artifactId: string | undefined) {
        return useMutationHook<M, M, CTX>(`${baseUrl}/${model}/${artifactId}`, { schema, ctx, method: 'PUT' });
    }

    function useDeleteArtifact<M extends z.infer<T> & BaseArtifactType>(ctx: CTX, artifactId: string | undefined) {
        return useMutationHook<M, M, CTX>(`${baseUrl}/${model}/${artifactId}`, { schema, ctx, method: 'DELETE' });
    }

    return {
        ArtifactSchema,
        useArtifactList,
        useArtifact,
        useLastArtifact,
        useCreateArtifact,
        useUpdateArtifact,
        useDeleteArtifact,
    }
}