import useSWR, { useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { z, ZodSchema } from "zod";
// import { useModelEnv } from "../state/model-env";
import { useHeadEnv } from "../hooks/artifact-log-hook";
import { useMutationHook } from "./mutation";
import { fetcher } from "./fetcher2";




export const BaseArtifactSchema = z.object({
    id: z.number(),
    score: z.number(),
    turn_id: z.number(),
    created_at: z.string(),
    // updated_at: z.string(),
})


export type BaseArtifactType = z.infer<typeof BaseArtifactSchema>



export default function createModelService<T>(model: string, schema: ZodSchema<T>, baseUrl?: string) {
    baseUrl = baseUrl || "/api/ai/model";

    const ModelArtifactSchema = BaseArtifactSchema.merge(schema)
    type ModelArtifactType = T & BaseArtifactType

    function useGetModel(id: string) {

        const env = useHeadEnv();
        //@ts-ignore
        return useSWR<ModelArtifactType | null>([`${baseUrl}/${model}/id/${id}`, env], ([url, env]) => fetcher({ schema: ModelArtifactSchema, endpoint: url, env }));
    }

    function useGetModelList(partitions?: any, limit: number = 10, offset: number = 0) {
        const env = useHeadEnv();

        //@ts-ignore
        return useSWR<ModelArtifactType[]>([`${baseUrl}/${model}/list`, partitions, limit, offset, env], ([url, partitions, limit, offset]) => fetcher({ schema: z.array(ModelArtifactSchema), endpoint: url, queryParams: { ...partitions, limit, offset }, env }));

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

    return {
        ModelArtifactSchema,        
        useGetModel,
        useGetModelList,
        useLastModel,
        useCreateModel,
        useUpdateModel,
    };
}





