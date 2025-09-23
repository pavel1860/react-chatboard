import { buildModelContextHeaders, convertKeysToCamelCase } from "../model/services/model-context";
export async function fetcher(endpoint, { schema, params, ctx, headers }) {
    let url = `${endpoint}`;
    const urlParams = new URLSearchParams();
    if (ctx) {
        Object.entries(ctx)
            .filter(([_, value]) => value != null)
            .forEach(([key, value]) => {
            urlParams.set("ctx." + key, String(value));
        });
    }
    if (params) {
        Object.entries(params)
            .filter(([_, value]) => value != null)
            .forEach(([key, value]) => {
            urlParams.set("filter." + key, String(value));
        });
    }
    url += `?${urlParams.toString()}`;
    const finalHeaders = { ...buildModelContextHeaders({}), ...headers };
    const res = await fetch(url, { headers: finalHeaders });
    const data = await res.json();
    if (!res.ok)
        throw { status: res.status, message: data?.message || res.statusText, details: data };
    if (data == null || data == undefined) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.status} returned null response`);
    }
    if (schema) {
        const result = schema.safeParse(convertKeysToCamelCase(data));
        if (result.success)
            return result.data;
        console.error(result.error.errors);
        throw new Error(`Failed to parse data: ${result.error.errors}`);
    }
    return data;
}
//# sourceMappingURL=fetcher3.js.map