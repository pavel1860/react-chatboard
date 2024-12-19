import useSWR, { useSWRConfig } from "swr"
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { z, ZodSchema } from "zod";





interface FetcherOptions<T> {
    schema: ZodSchema<T>;
    endpoint: string;
    queryParams?: Record<string, any>;
}

export async function fetcher<T>({ schema, endpoint, queryParams }: FetcherOptions<T>): Promise<T | null> {
    let url = `${endpoint}`;

    if (queryParams) {
        const params = new URLSearchParams(
            Object.entries(queryParams).map(([key, value]) => [key, String(value)])
        );
        url += `?${params.toString()}`;
    }

    const res = await fetch(url);

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${errorText}`);
    }

    const data = await res.json();
    // return schema.parse(data); // Validate data using Zod schema
    if (data == null || data == undefined) {
        return null
    }
    const result = schema.safeParse(data);
    if (result.success) {
        return result.data;
    } else {
        console.error(result.error.errors);
        throw new Error(`Failed to parse data: ${result.error.errors}`);
    }
}



interface MutationOptions<T, P> {
    schema: ZodSchema<P>;
    endpoint: string;
    data: T;
}

export async function sendRequest<T, P>({ schema, endpoint, data }: MutationOptions<T, P>): Promise<P> {
    const res = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`POST request to ${endpoint} failed: ${res.status} ${errorText}`);
    }

    const responseData = await res.json();
    return schema.parse(responseData); // Validate response data
}




interface UseMutationOptions<T, P> {
    schema: ZodSchema<P>;
    // model: string;
    endpoint?: string;
    // id?: string;
    callbacks?: {
        onSuccess?: (data: P) => void;
        onError?: (error: any) => void;
    };
}

export function useMutationHook<T, P>({ schema, endpoint, callbacks }: UseMutationOptions<T, P>): SWRMutationResponse<P, Error> {
    // const endpoint = id ? `${model}/update/${id}` : `${model}/create`;

    const { trigger, data, error, isMutating, reset } = useSWRMutation<P>(
        // `/api/model/${endpoint}`,
        endpoint,
        async (url: string, { arg }: { arg: T }) => {
            if (!endpoint) {
                throw new Error("Endpoint is not defined");
            }
            const response = await sendRequest<T, P>({ schema, endpoint, data: arg });
            return response;
        },
        {
            onSuccess: (data) => {
                callbacks?.onSuccess?.(data);
            },
            onError: (error) => {
                console.error(error);
                callbacks?.onError?.(error);
            },
        }
    );

    return { trigger, data, error, isMutating, reset };
}




export default function createModelService<T>(model: string, schema: ZodSchema<T>, baseUrl?: string) {
    baseUrl = baseUrl || "/api/model";


    function useGetModel(id: string) {
        return useSWR<T | null>(`${baseUrl}/${model}/${id}`, (url: string) => fetcher({ schema, endpoint: url }));
    }

    function useGetModelList(partitions?: any, limit: number = 10, offset: number = 0) {
        // return useSWR<T[]>([`${baseUrl}/${model}/list`, partitions, limit, offset], ([url, partitions, limit, offset]) => fetcher({ schema, endpoint: url, queryParams: { ...partitions, limit, offset } }));
        //@ts-ignore
        return useSWR<T[]>([`${baseUrl}/${model}/list`, partitions, limit, offset], ([url, partitions, limit, offset]) => fetcher({ schema: z.array(schema), endpoint: url, queryParams: { ...partitions, limit, offset } }));
    }

    function useLastModel(partitions: any) {
        //@ts-ignore
        return useSWR<T | null>([`${baseUrl}/${model}/last`, partitions], ([url, partitions]) => fetcher({ schema, endpoint: url, queryParams: partitions }));
    }

    function useCreateModel() {
        return useMutationHook<T, T>({ schema, endpoint: `${baseUrl}/${model}/create` });
    }

    function useUpdateModel(id?: string) {
        return useMutationHook<T, T>({ schema, endpoint: id && `${baseUrl}/${model}/update/${id}` });
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


