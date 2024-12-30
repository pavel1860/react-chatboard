import { z, ZodSchema } from "zod";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { useModelEnv } from "../state/model-env";




interface MutationOptions<T, P> {
    schema: ZodSchema<P>;
    endpoint: string;
    data: T;
    env?: string;
}

export async function sendRequest<T, P>({ schema, endpoint, data, env }: MutationOptions<T, P>): Promise<P> {

    const headers: any = {
        "Content-Type": "application/json"
    }
    if (env) {
        headers["env"] = env
    }

    const res = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers
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
    env?: string;
    // id?: string;
    callbacks?: {
        onSuccess?: (data: P) => void;
        onError?: (error: any) => void;
    };
}

export function useMutationHook<T, P>({ schema, endpoint, callbacks, env }: UseMutationOptions<T, P>): SWRMutationResponse<P, Error> {
    // const endpoint = id ? `${model}/update/${id}` : `${model}/create`;

    

    const { trigger, data, error, isMutating, reset } = useSWRMutation<P>(
        // `/api/model/${endpoint}`,
        endpoint,
        async (url: string, { arg }: { arg: T }) => {
            if (!endpoint) {
                throw new Error("Endpoint is not defined");
            }
            const response = await sendRequest<T, P>({ schema, endpoint, data: arg, env });
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
