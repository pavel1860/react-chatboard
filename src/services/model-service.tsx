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
        return useSWR<T | null>([`${baseUrl}/${model}/${id}`, env], ([url, env]) => fetcher({ schema, endpoint: url, env }));
    }

    function useGetModelList(partitions?: any, limit: number = 10, offset: number = 0) {
        // return useSWR<T[]>([`${baseUrl}/${model}/list`, partitions, limit, offset], ([url, partitions, limit, offset]) => fetcher({ schema, endpoint: url, queryParams: { ...partitions, limit, offset } }));
        const {
            selectedEnv: env
        } = useModelEnv();

        //@ts-ignore
        return useSWR<T[]>([`${baseUrl}/${model}/list`, partitions, limit, offset, env], ([url, partitions, limit, offset]) => fetcher({ schema: z.array(schema), endpoint: url, queryParams: { ...partitions, limit, offset }, env }));
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






// export function useGetModel<T>(model: string, id: string) {
//     const url = `/${model}` + "/" + id
//     const { data, error, isLoading, mutate } = useSWR(url, (url: string) => fetcher(url))

//     return {
//         data,
//         error,
//         isLoading,
//         mutate
//     }
// }


// export function useGetModelList(model: string, partitions?: any, limit: number = 10, offset: number = 0,) {

//     const url = `/${model}/list`
//     const { data, error, isLoading, mutate } = useSWR(partitions ? [url, partitions, limit, offset] : null, ([url, partitions, limit, offset]) => fetcher(url, { ...partitions, limit, offset }))

//     return {
//         data: data || [],
//         error,
//         isLoading,
//         mutate
//     }
// }



// export function useLastModel(model: string, partitions: any) {
//     const url = `/${model}/last`
//     const { data, error, isLoading, mutate } = useSWR(partitions ? [url, partitions] : null, ([url, partitions]) => fetcher(url, partitions))
//     // const { data, error, isLoading, mutate } = useSWR([url], ([url]) => fetcher(url, {}))

//     return {
//         data,
//         error,
//         isLoading,
//         mutate
//     }
// }


// export function useUpdateModel<T>(model: string, id: string) {
//     const url = `/${model}/update/` + id
//     const {
//         isMutating,
//         trigger
//     } = useMutation(url)


//     return {
//         isMutating,
//         trigger
//     }
// }


