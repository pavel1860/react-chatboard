import useSWR, { SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { AnyZodObject, z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useHeadEnv } from "../model/hooks/artifact-head-hooks";
import { useMutationHook } from "./mutation";
import { fetcher, VersionEnv } from "./fetcher2";
import { useCallback, useEffect, useMemo, useState } from "react";
import createModelService, { DefaultFilter, ModelServiceOptions, UseQueryBuilderHook } from "../model/services/model-service";
import { HeadSchema } from "../model/services/artifact-log-service";




export const BaseHeadSchema = z.object({
    id: z.number(),
    // head_id: z.number(),
    // head: HeadSchema
})




export type BaseHeadModelType = z.infer<typeof BaseHeadSchema>

export interface HeadModelService<T extends AnyZodObject> {
    HeadModelSchema: ZodSchema<T & BaseHeadModelType>
    useHeadModel: <M extends z.infer<T> & BaseHeadModelType>(id: string | number | undefined, filters?: DefaultFilter<M>) => SWRResponse<M | null>
    useHeadModelList: <M extends z.infer<T> & BaseHeadModelType>(limit?: number, offset?: number, filters?: DefaultFilter<T>[], env?: VersionEnv) => SWRResponse<M[]> & UseQueryBuilderHook<M>
    useLastHeadModel: <M extends z.infer<T> & BaseHeadModelType>(partitions: any, filters?: DefaultFilter<M>) => SWRResponse<M | null>
    useCreateHeadModel: <M extends z.infer<T> & BaseHeadModelType>() => SWRMutationResponse<M, Error>
    useUpdateHeadModel: <M extends z.infer<T> & BaseHeadModelType>(id?: string) => SWRMutationResponse<M, Error>
    useDeleteHeadModel: <M extends z.infer<T> & BaseHeadModelType>(id?: string) => SWRMutationResponse<M, Error>
}







export default function createHeadModelService<T extends AnyZodObject>(model: string, schema: ZodSchema<T>, options: ModelServiceOptions): HeadModelService<T> {


    const HeadModelSchema = BaseHeadSchema.merge(schema)

    const {
        useModel,
        useModelList,
        useLastModel,
        useCreateModel,
        useUpdateModel,
        useDeleteModel,
    } = createModelService(model, HeadModelSchema, options)



    return {
        HeadModelSchema,
        useHeadModel: useModel,
        useHeadModelList: useModelList,
        useLastHeadModel: useLastModel,
        useCreateHeadModel: useCreateModel,
        useUpdateHeadModel: useUpdateModel,
        useDeleteHeadModel: useDeleteModel,
    }
}