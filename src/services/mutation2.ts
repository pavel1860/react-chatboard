import { z, ZodSchema } from "zod";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { useModelEnv } from "../state/model-env";
import { ModelContextType } from "../model/services/model-context";
import { buildHeaders } from "./utils";




interface MutationOptions<Params, Data, CTX extends ModelContextType> {
    schema?: ZodSchema<Data>;
    // data: Params;
    method?: string;
    ctx: CTX
}

export async function sendRequest<Params, Data, CTX extends ModelContextType>(endpoint: string, data: Params, { schema, ctx, method = 'POST' }: MutationOptions<Params, Data, CTX>): Promise<Data> {

    const headers = buildHeaders(ctx, "json")

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




interface UseMutationOptions<Params, Data, CTX extends ModelContextType> {
    schema?: ZodSchema<Data>;
    // model: string;
    ctx: CTX;
    // id?: string;
    method?: string;
    callbacks?: {
        onSuccess?: (data: Data) => void;
        onError?: (error: any) => void;
    };
}

export function useMutationHook<Params, Data, CTX extends ModelContextType>(endpoint: string, { schema, callbacks, ctx, method = 'POST' }: UseMutationOptions<Params, Data, CTX>): SWRMutationResponse<Data, Error> {

    const { trigger, data, error, isMutating, reset } = useSWRMutation<Data>(
        // `/api/model/${endpoint}`,
        endpoint,
        async (url: string, { arg }: { arg: Params }) => {
            if (!endpoint) {
                throw new Error("Endpoint is not defined");
            }
            const response = await sendRequest<Params, Data, CTX>(endpoint, arg, { schema, ctx, method });
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
