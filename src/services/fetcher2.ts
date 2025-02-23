import { z, ZodSchema } from "zod";
import { useModelEnv } from "../state/model-env";




interface FetcherOptions<T> {
    schema: ZodSchema<T>;
    endpoint: string;
    queryParams?: Record<string, any>;
    env?: {
        headId?: string;
        branchId?: string;
    };
}




export async function fetcher<T>({ schema, endpoint, queryParams, env }: FetcherOptions<T>): Promise<T | null> {


    let url = `${endpoint}`;

    if (queryParams) {
        const params = new URLSearchParams(
            Object.entries(queryParams).map(([key, value]) => [key, String(value)])
        );
        url += `?${params.toString()}`;
    }

    const headers: any = {}
    if (env) {
        // headers["env"] = env
        headers["head_id"] = env.headId
        headers["branch_id"] = env.branchId
    }

    const res = await fetch(url, { headers });

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




export function fetcherWithHeaders(headers: any) {
    return async (url: string) => {
        const res = await fetch(url, {
            headers
        });
        if (!res.ok) {
            const error = new Error('Error fetching data');
            throw error;
        }
        return res.json();
    };
}

