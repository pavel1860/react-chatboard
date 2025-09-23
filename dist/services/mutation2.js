import useSWRMutation from "swr/mutation";
import { buildModelContextHeaders, convertKeysToCamelCase, convertKeysToSnakeCase } from "../model/services/model-context";
export async function sendRequest(endpoint, data, { schema, ctx, method = 'POST' }) {
    const headers = buildModelContextHeaders({}, "json");
    const urlParams = new URLSearchParams();
    if (ctx) {
        Object.entries(ctx)
            .filter(([_, value]) => value != null)
            .forEach(([key, value]) => {
            urlParams.set("ctx." + key, String(value));
        });
    }
    const body = convertKeysToSnakeCase(data);
    const url = `${endpoint}?${urlParams.toString()}`;
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
export function useMutationHook(endpoint, { schema, callbacks, ctx, method = 'POST' }) {
    const { trigger, data, error, isMutating, reset } = useSWRMutation(
    // `/api/model/${endpoint}`,
    endpoint, async (url, { arg }) => {
        if (!endpoint) {
            throw new Error("Endpoint is not defined");
        }
        const response = await sendRequest(endpoint, arg, { schema, ctx, method });
        return response;
    }, {
        onSuccess: (data) => {
            callbacks?.onSuccess?.(data);
        },
        onError: (error) => {
            console.error(error);
            callbacks?.onError?.(error);
        },
    });
    return { trigger, data, error, isMutating, reset };
}
//# sourceMappingURL=mutation2.js.map