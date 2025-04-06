import { z, ZodSchema } from "zod";
import { useModelEnv } from "../state/model-env";




export interface VersionEnv {
    headId?: number | null;
    branchId?: number | null;
    turnId?: number | null;
    partitionId?: number | null;
}


export interface FetcherOptions<T> {
    schema: ZodSchema<T>;
    endpoint: string;
    queryParams?: Record<string, any>;
    env?: VersionEnv;
}




export async function fetcher<T>({ schema, endpoint, queryParams, env }: FetcherOptions<T>): Promise<T | null> {


    let url = `${endpoint}`;

    if (queryParams) {
        const params = new URLSearchParams(
            Object.entries(queryParams).map(([key, value]) => [key, String(value)])
            // {
            //     filters: JSON.stringify(queryParams)
            // }
        );
        url += `?${params.toString()}`;
    }

    const headers: any = {}
    if (env) {
        // headers["env"] = env
        if (env.headId) {
            headers["head_id"] = env.headId
        }
        if (env.branchId) {
            headers["branch_id"] = env.branchId
        }
        if (env.turnId) {
            headers["turn_id"] = env.turnId
        }
        if (env.partitionId) {
            headers["partition_id"] = env.partitionId
        }
    }
    console.log("headers", headers)

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

