import { z, ZodSchema } from "zod";
import { useModelEnv } from "../state/model-env";


export interface ApiError {
    status: number;
    message: string;
    details?: unknown;
}

export interface VersionHead {
    headId?: number | null;
    branchId?: number | null;
    turnId?: number | null;
    partitionId?: number | null;
}


export interface FetcherOptions<T> {
    schema?: ZodSchema<T>;
    queryParams?: Record<string, any>;
    head?: VersionHead;
}





export async function fetcher<T>(endpoint: string, { schema, queryParams, head }: FetcherOptions<T>): Promise<T> {


    let url = `${endpoint}`;

    if (queryParams) {
        const params = new URLSearchParams(
            Object.entries(queryParams)
                .filter(([_, value]) => value != null)
                .map(([key, value]) => [key, String(value)])
        );
        url += `?${params.toString()}`;
    }

    const headers: any = {}
    if (head) {
        // headers["env"] = env
        if (head.headId) {
            headers["head_id"] = head.headId
        }
        if (head.branchId) {
            headers["branch_id"] = head.branchId
        }
        if (head.turnId) {
            headers["turn_id"] = head.turnId
        }
        if (head.partitionId) {
            headers["partition_id"] = head.partitionId
        } else{
            console.error("no partition")
        }
    } else {
        console.error(`no head found for ${endpoint}`)
        throw new Error("No head is passed to the fetcher");
        
    }
    

    const res = await fetch(url, { headers });

    if (!res.ok) {
        // const errorText = await res.text();
        // throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${errorText}`);
        const errorData = await res.json().catch(() => null);
        throw {
            status: res.status,
            message: errorData?.message || res.statusText,
            details: errorData
        };
    }

    const data = await res.json();
    // return schema.parse(data); // Validate data using Zod schema
    if (data == null || data == undefined) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.status} returned null response`);
    }
    if (schema) {
        const result = schema.safeParse(data);
        if (result.success) {
            return result.data;
        } else {
            console.error(result.error.errors);
            throw new Error(`Failed to parse data: ${result.error.errors}`);
        }
    }
    return data;
}



