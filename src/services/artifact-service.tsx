import useSWR, { SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { AnyZodObject, z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useHeadEnv } from "../hooks/artifact-log-hook";
import { useMutationHook } from "./mutation";
import { fetcher } from "./fetcher2";
import { useCallback, useEffect, useMemo, useState } from "react";
import createModelService, { DefaultFilter, UseQueryBuilderHook } from "./model-service";

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
    useArtifact: <M extends z.infer<T> & BaseArtifactType>(id: string | number | undefined, filters?: DefaultFilter<M>) => SWRResponse<M | null>
    useArtifactList: <M extends z.infer<T> & BaseArtifactType>(branchId: number, turnId?: number, limit?: number, offset?: number, filters?: DefaultFilter<T>[]) => SWRResponse<M[]> & UseQueryBuilderHook<M>
    useLastArtifact: <M extends z.infer<T> & BaseArtifactType>(partitions: any, filters?: DefaultFilter<M>) => SWRResponse<M | null>
    useCreateArtifact: <M extends z.infer<T> & BaseArtifactType>() => SWRMutationResponse<M, Error>
    useUpdateArtifact: <M extends z.infer<T> & BaseArtifactType>(id?: string) => SWRMutationResponse<M, Error>
    useDeleteArtifact: <M extends z.infer<T> & BaseArtifactType>(id?: string) => SWRMutationResponse<M, Error>
}







export default function createArtifactService<T extends AnyZodObject>(model: string, schema: ZodSchema<T>) {


    const ArtifactSchema = BaseArtifactSchema.merge(schema)

    const {
        useModel: useArtifact,
        useModelList: useGetModelList,
        useLastModel: useLastArtifact,
        useCreateModel: useCreateArtifact,
        useUpdateModel: useUpdateArtifact,
        useDeleteModel: useDeleteArtifact,
    } = createModelService(model, ArtifactSchema)



    function useArtifactList<M extends z.infer<T> & BaseArtifactType>(branchId?: number, turnId?: number, limit?: number, offset?: number, filters?: DefaultFilter<M>[]) {
        const [currBranchId, setCurrBranchId] = useState<number | undefined>(branchId)
        const [currTurnId, setCurrTurnId] = useState<number | undefined>(turnId)

        const isActive = currBranchId !== undefined
        
        const listHooks = useGetModelList(limit, offset, filters, { branchId: currBranchId, turnId: currTurnId }, isActive)

        return {
            ...listHooks,
            branchId: currBranchId,
            turnId: currTurnId,
            setBranchId: setCurrBranchId,
            setTurnId: setCurrTurnId,
        }
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