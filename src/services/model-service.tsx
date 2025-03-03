import useSWR, { SWRResponse, useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { AnyZodObject, z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useHeadEnv } from "../hooks/artifact-log-hook";
import { useMutationHook } from "./mutation";
import { fetcher } from "./fetcher2";




export const BaseArtifactSchema = z.object({
    id: z.number(),
    score: z.number(),
    turn_id: z.number(),
    branch_id: z.number(),
    created_at: z.string(),
    // updated_at: z.string(),
})


export const BaseHeadSchema = z.object({
    id: z.number(),    
    head_id: z.number(),
})


export type BaseArtifactType = z.infer<typeof BaseArtifactSchema>


export type ModelServiceOptions = {
    isArtifact?: boolean,
    baseUrl?: string,
    isHead?: boolean,
}



export interface ModelService<T extends AnyZodObject> {
    ModelArtifactSchema: ZodSchema<T & BaseArtifactType>
    useGetModel: (id: string) => SWRResponse<T & BaseArtifactType | null>
    useGetModelList: (limit: number, offset: number) => SWRResponse<(T & BaseArtifactType)[]>
    useLastModel: (partitions: any) => SWRResponse<T & BaseArtifactType | null>
    useCreateModel: () => SWRMutationResponse<T & BaseArtifactType, Error>
    useUpdateModel: (id?: string) => SWRMutationResponse<T & BaseArtifactType, Error>
    useDeleteModel: (id?: string) => SWRMutationResponse<T & BaseArtifactType, Error>
}



export default function createModelService<T extends AnyZodObject>(model: string, schema: T, options: ModelServiceOptions): ModelService<T> {
    const { isArtifact = false, baseUrl = "/api/ai/model", isHead = false } = options;

    if (isHead && isArtifact) {
        throw new Error("Head and Artifact cannot be true at the same time")
    }

    const ModelArtifactSchema = isHead ? BaseHeadSchema.merge(schema) : isArtifact ? BaseArtifactSchema.merge(schema) : schema
    // type ModelArtifactType = T & BaseArtifactType

    function useGetModel(id: string | number): SWRResponse<T & BaseArtifactType | null> {

        const env = useHeadEnv();
        //@ts-ignore
        return useSWR<ModelArtifactType | null>([`${baseUrl}/${model}/id/${id}`, env], ([url, env]) => fetcher({ schema: ModelArtifactSchema, endpoint: url, env }));
    }

    function useGetModelList(limit: number = 10, offset: number = 0): SWRResponse<(T & BaseArtifactType)[]> {
        const env = useHeadEnv();

        //@ts-ignore
        return useSWR<ModelArtifactType[]>([`${baseUrl}/${model}/list`, limit, offset, env], ([url, limit, offset]) => fetcher({ schema: z.array(ModelArtifactSchema), endpoint: url, queryParams: { limit, offset }, env }));

    }

    function useLastModel(partitions: any) {
        const env = useHeadEnv();

        //@ts-ignore
        return useSWR<ModelArtifactType | null>([`${baseUrl}/${model}/last`, partitions, env], ([url, partitions, env]) => fetcher({ ModelArtifactSchema, endpoint: url, queryParams: partitions, env }));
    }

    function useCreateModel() {
        const env = useHeadEnv();

        return useMutationHook<ModelArtifactType, ModelArtifactType>({ schema: ModelArtifactSchema, endpoint: `${baseUrl}/${model}/create`, env });
    }

    function useUpdateModel(id?: string) {
        const env = useHeadEnv();

        return useMutationHook<ModelArtifactType, ModelArtifactType>({ schema: ModelArtifactSchema, endpoint: id && `${baseUrl}/${model}/update/${id}`, env });
    }

    function useDeleteModel(id?: string) {
        const env = useHeadEnv();

        return useMutationHook<ModelArtifactType, ModelArtifactType>({ schema: ModelArtifactSchema, endpoint: id && `${baseUrl}/${model}/delete/${id}`, env });
    }

    return {
        ModelArtifactSchema,        
        useGetModel,
        useGetModelList,
        useLastModel,
        useCreateModel,
        useUpdateModel,
        useDeleteModel,
    };
}










