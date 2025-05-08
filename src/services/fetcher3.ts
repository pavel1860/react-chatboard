import { AnyZodObject, z, ZodSchema } from "zod";
import { useModelEnv } from "../state/model-env";
import { buildModelContextHeaders, ModelContextType } from "../model/services/model-context";


export interface ApiError {
    status: number;
    message: string;
    details?: unknown;
}




export interface FetcherOptions<Ctx, Params, Model> {
    schema?: ZodSchema<Model>;
    params?: Params extends Record<string, unknown> ? Record<string, unknown> : never;
    ctx: Ctx
}





export async function fetcher<Ctx, Params, Model>(endpoint: string, { schema, params, ctx }: FetcherOptions<Ctx, Params, Model>): Promise<Model> {

    let url = `${endpoint}`;

    if (params) {
        const urlParams = new URLSearchParams(
            Object.entries(params)
                .filter(([_, value]) => value != null)
                .map(([key, value]) => [key, String(value)])
        );
        url += `?${urlParams.toString()}`;
    }

    const headers: any = buildModelContextHeaders<Ctx>(ctx)

    const res = await fetch(url, { headers });
    
    const data = await res.json();
    if (!res.ok) throw { status: res.status, message: data?.message || res.statusText, details: data };

    if (data == null || data == undefined) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.status} returned null response`);
    }
    if (schema) {
        const result = schema.safeParse(data);
        if (result.success) return result.data;        
        console.error(result.error.errors);
        throw new Error(`Failed to parse data: ${result.error.errors}`);        
    }
    return data;
}



