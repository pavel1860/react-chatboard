import useSWR, { SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { AnyZodObject, z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useHeadEnv, useVersionHead } from "../hooks/artifact-head-hooks";
import { useMutationHook } from "../../services/mutation";
import { fetcher, VersionHead } from "../../services/fetcher3";
import { useCallback, useEffect, useMemo, useState } from "react";
import createModelService, { DefaultFilter, ModelServiceOptions, UseQueryBuilderHook } from "./model-service";
import { useQueryBuilder } from "../../services/query-builder";

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







// export default function createArtifactService<T extends AnyZodObject>(model: string, schema: ZodSchema<T>) {


//     const ArtifactSchema = BaseArtifactSchema.merge(schema)

//     const {
//         useModel: useArtifact,
//         useModelList: useGetModelList,
//         useLastModel: useLastArtifact,
//         useCreateModel: useCreateArtifact,
//         useUpdateModel: useUpdateArtifact,
//         useDeleteModel: useDeleteArtifact,
//     } = createModelService(model, ArtifactSchema)



//     function useArtifactList<M extends z.infer<T> & BaseArtifactType>(branchId?: number, turnId?: number, limit?: number, offset?: number, filters?: DefaultFilter<M>[]) {
//         const [currBranchId, setCurrBranchId] = useState<number | undefined>(branchId)
//         const [currTurnId, setCurrTurnId] = useState<number | undefined>(turnId)

//         const isActive = currBranchId !== undefined
        
//         const listHooks = useGetModelList(limit, offset, filters, { branchId: currBranchId, turnId: currTurnId }, isActive)

//         return {
//             ...listHooks,
//             branchId: currBranchId,
//             turnId: currTurnId,
//             setBranchId: setCurrBranchId,
//             setTurnId: setCurrTurnId,
//         }
//     }

//     return {
//         ArtifactSchema,
//         useArtifactList,
//         useArtifact,
//         useLastArtifact,
//         useCreateArtifact,
//         useUpdateArtifact,
//         useDeleteArtifact,
//     }
// }





export default function createArtifactService<T extends AnyZodObject>(model: string, schema: ZodSchema<T>, options: ModelServiceOptions = {}) {
    const { baseUrl = "/api/ai/artifact" } = options;

    const ArtifactSchema = BaseArtifactSchema.merge(schema)


    function useArtifact<M extends z.infer<T> & BaseArtifactType>(artifactId: string | undefined, version: string | undefined = undefined) {
        const head = useVersionHead();


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
            url ? [url, head] : null,
            ([url, head]: [string, VersionHead]) => fetcher<M>(url, { schema: ArtifactSchema, head })
        )
    }



    function useArtifactList<M extends z.infer<T> & BaseArtifactType>(branchId?: number, turnId?: number, limit?: number, offset?: number, defaultFilters?: DefaultFilter<M>[], head: VersionHead = {}) {
        const [currBranchId, setCurrBranchId] = useState<number | undefined>(branchId)
        const [currTurnId, setCurrTurnId] = useState<number | undefined>(turnId)
        const currHead = useVersionHead(head)

        const isActive = currHead.partitionId !== undefined
        
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
            isActive ? [`${baseUrl}/${model}/list`, limit, offset, queryString, currHead] : null,
            ([url, limit, offset, queryString, currHead]: [string, number, number, string, VersionHead]) => 
                fetcher<M[]>(url, { schema: z.array(ArtifactSchema), queryParams, head: currHead })
        );

        return {
            ...getArtifactList,
            filters,
            where,
            build,
            reset,
            queryString,
            branchId: currBranchId,
            turnId: currTurnId,
            setBranchId: setCurrBranchId,
            setTurnId: setCurrTurnId,
        }
    }


    function useLastArtifact<M extends z.infer<T> & BaseArtifactType>(partitions: any, filters?: DefaultFilter<M>) {
        const head = useVersionHead();

        const queryParams: Record<string, any> = { ...partitions };

        if (filters) {
            queryParams.filter = JSON.stringify(filters);
        }

        return useSWR<M | null>(
            [`${baseUrl}/${model}/last`, queryParams, head],
            ([url, queryParams, head]: [string, Record<string, any>, VersionHead]) => fetcher<M>(url, { schema: ArtifactSchema, queryParams, head })
        )
    }

    function useCreateArtifact<M extends z.infer<T> & BaseArtifactType>() {
        const head = useVersionHead();

        return useMutationHook<M, M>({ schema, endpoint: `${baseUrl}/${model}`, head, method: 'POST' });
    }

    function useUpdateArtifact<M extends z.infer<T> & BaseArtifactType>(artifactId: string | undefined) {
        const head = useVersionHead();
        return useMutationHook<M, M>({ schema, endpoint: `${baseUrl}/${model}/${artifactId}`, head, method: 'PUT' });
    }

    function useDeleteArtifact<M extends z.infer<T> & BaseArtifactType>(artifactId: string | undefined) {
        const head = useVersionHead();
        return useMutationHook<M, M>({ schema, endpoint: `${baseUrl}/${model}/${artifactId}`, head, method: 'DELETE' });
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