import useSWR, { useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { z, ZodSchema } from "zod";
import { useModelEnv } from "../state/model-env";
import { useMutationHook } from "./mutation";
import { fetcher } from "./fetcher2";




export default function createModelService<T>(model: string, schema: ZodSchema<T>, baseUrl?: string) {
    baseUrl = baseUrl || "/api/model";


    function useGetModel(id: string) {

        const {
            selectedEnv: env
        } = useModelEnv();
        //@ts-ignore
        return useSWR<T | null>([`${baseUrl}/${model}/id/${id}`, env], ([url, env]) => fetcher({ schema, endpoint: url, env }));
    }

    function useGetModelList(partitions?: any, limit: number = 10, offset: number = 0) {
        const {
            selectedEnv: env
        } = useModelEnv();

        //@ts-ignore
        return useSWR<T[]>([`${baseUrl}/${model}/list`, partitions, limit, offset, env], ([url, partitions, limit, offset]) => fetcher({ schema: z.array(schema), endpoint: url, queryParams: { ...partitions, limit, offset }, env }));

        // return useSWR<z.infer<typeof schema>[]>([`${baseUrl}/${model}/list`, partitions, limit, offset, env], ([url, partitions, limit, offset]) => fetcher({ schema: z.array(schema), endpoint: url, queryParams: { ...partitions, limit, offset }, env }));
        const {
            data,
            error,
            isLoading,
            mutate
        } = useSWR<T[]>([`${baseUrl}/${model}/list`, partitions, limit, offset, env], ([url, partitions, limit, offset]) => fetcher({ schema: z.array(schema), endpoint: url, queryParams: { ...partitions, limit, offset }, env }));

        return {
            data: data || [],
            error,
            isLoading,
            mutate
        }
    }

    function useLastModel(partitions: any) {
        const {
            selectedEnv: env
        } = useModelEnv();

        //@ts-ignore
        return useSWR<T | null>([`${baseUrl}/${model}/last`, partitions, env], ([url, partitions, env]) => fetcher({ schema, endpoint: url, queryParams: partitions, env }));
    }

    function useCreateModel() {
        const {
            selectedEnv: env
        } = useModelEnv();

        return useMutationHook<T, T>({ schema, endpoint: `${baseUrl}/${model}/create`, env });
    }

    function useUpdateModel(id?: string) {
        const {
            selectedEnv: env
        } = useModelEnv();

        return useMutationHook<T, T>({ schema, endpoint: id && `${baseUrl}/${model}/update/${id}`, env });
    }

    return {
        useGetModel,
        useGetModelList,
        useLastModel,
        useCreateModel,
        useUpdateModel,
    };
}





