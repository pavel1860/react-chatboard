import { ZodSchema } from "zod";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation"
import { buildModelContextHeaders, convertKeysToCamelCase, convertKeysToSnakeCase } from "../model/services/model-context";





interface MutationOptions<Ctx, Data> {
    ctx: Ctx
    schema?: ZodSchema<Data>;
    // data: Params;
    method?: string;
    
}

export async function sendRequest<Ctx, Params, Data>(endpoint: string, data: Params, { schema, ctx, method = 'POST' }: MutationOptions<Ctx, Data>): Promise<Data> {

    const headers = buildModelContextHeaders({}, "json")

    const urlParams = new URLSearchParams()
    if (ctx) {
        Object.entries(ctx)
            .filter(([_, value]) => value != null)
            .forEach(([key, value]) => {
                urlParams.set("ctx." + key, String(value));
            });
    }
    const body = convertKeysToSnakeCase(data)
    const url = `${endpoint}?${urlParams.toString()}`
    const res = await fetch(url, {
        method,
        body: JSON.stringify(body),
        headers
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`POST request to ${endpoint} failed: ${res.status} ${errorText}`);
    }

    const responseData = await res.json();
    if (schema) {
        return schema.parse(convertKeysToCamelCase(responseData)); // Validate response data
    }
    return responseData;
}




interface UseMutationOptions<Data, Ctx> {
    ctx: Ctx;
    schema?: ZodSchema<Data>;    
    method?: string;
    callbacks?: {
        onSuccess?: (data: Data) => void;
        onError?: (error: any) => void;
    };
}

export function useMutationHook<Ctx, Params, Data>(endpoint: string, { schema, callbacks, ctx, method = 'POST' }: UseMutationOptions<Data, Ctx>): SWRMutationResponse<Data, Error> {

    const { trigger, data, error, isMutating, reset } = useSWRMutation<Data>(
        // `/api/model/${endpoint}`,
        endpoint,
        async (url: string, { arg }: { arg: Params }) => {
            if (!endpoint) {
                throw new Error("Endpoint is not defined");
            }
            const response = await sendRequest<Ctx, Params, Data>(endpoint, arg, { schema, ctx, method });
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
