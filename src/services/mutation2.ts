import { z, ZodSchema } from "zod";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { useModelEnv } from "../state/model-env";
import { VersionHead } from "./fetcher3";
import { buildHeaders } from "./utils";




interface MutationOptions<Params, Data> {
    schema?: ZodSchema<Data>;
    // data: Params;
    method?: string;
    head: VersionHead
}

export async function sendRequest<Params, Data>(endpoint: string, data: Params, { schema, head, method = 'POST' }: MutationOptions<Params, Data>): Promise<Data> {

    const headers = buildHeaders({
        "partition_id": head.partitionId,
        "branch_id": head.branchId,
        "turn_id": head.turnId,        
    }, "json")

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
    schema?: ZodSchema<Data>;
    // model: string;
    head: VersionHead;
    // id?: string;
    method?: string;
    callbacks?: {
        onSuccess?: (data: Data) => void;
        onError?: (error: any) => void;
    };
}

export function useMutationHook<Params, Data>(endpoint: string, { schema, callbacks, head, method = 'POST' }: UseMutationOptions<Params, Data>): SWRMutationResponse<Data, Error> {
    // const endpoint = id ? `${model}/update/${id}` : `${model}/create`;
    

    const { trigger, data, error, isMutating, reset } = useSWRMutation<Data>(
        // `/api/model/${endpoint}`,
        endpoint,
        async (url: string, { arg }: { arg: Params }) => {
            if (!endpoint) {
                throw new Error("Endpoint is not defined");
            }
            const response = await sendRequest<Params, Data>(endpoint, arg, { schema, head, method });
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
