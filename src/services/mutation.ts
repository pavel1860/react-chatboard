import { z, ZodSchema } from "zod";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { useModelEnv } from "../state/model-env";




interface MutationOptions<Params, Data> {
    schema?: ZodSchema<Data>;
    endpoint: string;
    data: Params;
    method?: string;
    env?: {
        headId?: string;
        branchId?: string;
    };
}

export async function sendRequest<Params, Data>({ schema, endpoint, data, env, method = 'POST' }: MutationOptions<Params, Data>): Promise<Data> {

    const headers: any = {
        "Content-Type": "application/json"
    }
    if (env) {
        headers["head_id"] = env.headId
        headers["branch_id"] = env.branchId
    }

    const res = await fetch(endpoint, {
        method,
        body: JSON.stringify(data),
        headers
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`POST request to ${endpoint} failed: ${res.status} ${errorText}`);
    }

    const responseData = await res.json();
    if (schema) {
        return schema.parse(responseData); // Validate response data
    }
    return responseData;
}




interface UseMutationOptions<Params, Data> {
    schema: ZodSchema<Data>;
    // model: string;
    endpoint?: string;
    env?: {
        head_id?: string;
        branch_id?: string;
    };
    // id?: string;
    method?: string;
    callbacks?: {
        onSuccess?: (data: Data) => void;
        onError?: (error: any) => void;
    };
}

export function useMutationHook<Params, Data>({ schema, endpoint, callbacks, env, method = 'POST' }: UseMutationOptions<Params, Data>): SWRMutationResponse<Data, Error> {
    // const endpoint = id ? `${model}/update/${id}` : `${model}/create`;
    

    const { trigger, data, error, isMutating, reset } = useSWRMutation<Data>(
        // `/api/model/${endpoint}`,
        endpoint,
        async (url: string, { arg }: { arg: Params }) => {
            if (!endpoint) {
                throw new Error("Endpoint is not defined");
            }
            const response = await sendRequest<Params, Data>({ schema, endpoint, data: arg, env, method });
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
