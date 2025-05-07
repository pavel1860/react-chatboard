import { AnyZodObject, z, ZodSchema } from "zod";
import { useModelEnv } from "../state/model-env";
import { buildModelContextHeaders, ModelContextType } from "../model/services/model-context";


export interface ApiError {
    status: number;
    message: string;
    details?: unknown;
}




export interface FetcherOptions<T extends AnyZodObject, CTX extends ModelContextType> {
    schema?: T;
    queryParams?: Record<string, any>;
    ctx?: CTX
}





export async function fetcher<T extends AnyZodObject, CTX extends ModelContextType>(endpoint: string, { schema, queryParams, ctx }: FetcherOptions<T, CTX>): Promise<T> {

    let url = `${endpoint}`;

    if (queryParams) {
        const params = new URLSearchParams(
            Object.entries(queryParams)
                .filter(([_, value]) => value != null)
                .map(([key, value]) => [key, String(value)])
        );
        url += `?${params.toString()}`;
    }

    const headers: any = buildModelContextHeaders(ctx)

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



