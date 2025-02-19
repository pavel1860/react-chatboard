import useSWR, { SWRResponse } from 'swr';
import { z } from 'zod';
import { useMutationHook } from './mutation';
import { useModelEnv } from "../hooks/artifact-log-hook";
// Types for API responses
// export interface Branch {
//     id: number;
//     name: string;
//     created_at: string;
//     updated_at: string;
//     branch_index: number;
//     turn_counter: number;
//     forked_from_turn_index?: number;
//     forked_from_branch_id?: number;
// }

// export interface Turn {
//     id: number;
//     branch_id: number;
//     index: number;
//     status: "STAGED" | "COMMITTED" | "REVERTED";
//     created_at: string;
//     ended_at?: string;
//     message?: string;
// }

export interface ArtifactLogHeaders {
    head_id: number;
    branch_id?: number;
}

const BASE_URL = '/api/ai/artifact_log';

// Zod schemas for validation
const BranchSchema = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    branch_index: z.number(),
    turn_counter: z.number(),
    forked_from_turn_index: z.number().nullable(),
    forked_from_branch_id: z.number().nullable()
});

const TurnSchema = z.object({
    id: z.number(),
    branch_id: z.number(),
    index: z.number(),
    // status: z.enum(["STAGED", "COMMITTED", "REVERTED"]),
    status: z.enum(["staged", "committed", "reverted"]),
    created_at: z.string(),
    ended_at: z.string().nullable(),
    message: z.string().nullable(),
    forked_branches: z.array(BranchSchema)
});

const HeadSchema = z.object({
    id: z.number(),
    main_branch_id: z.number(),
    branch_id: z.number(),
    turn_id: z.number(),
    created_at: z.string(),
});

// Types inferred from Zod schemas
export type BranchType = z.infer<typeof BranchSchema>;
export type TurnType = z.infer<typeof TurnSchema>;
export type HeadType = z.infer<typeof HeadSchema>;

const getHeaders = (headers: ArtifactLogHeaders): Headers => {
    const requestHeaders = new Headers();
    requestHeaders.append('head_id', headers.head_id);
    if (headers.branch_id) {
        requestHeaders.append('branch_id', headers.branch_id);
    }
    return requestHeaders;
};

// Fetcher functions
const fetcher = async (url: string, headers: ArtifactLogHeaders) => {
    const response = await fetch(url, {
        headers: getHeaders(headers),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
};


export const useHead = (headId: number | null, headers: ArtifactLogHeaders) => {
    return useSWR<HeadType>(
        headId ? [BASE_URL + `/heads/${headId}`, headers] : null,
        ([url, headers]) => fetcher(url, headers).then(data => HeadSchema.parse(data))
    );
};


export const useAllHeads = (headers: ArtifactLogHeaders) => {
    return useSWR<BranchType[]>(
        [BASE_URL + '/heads', headers],
        ([url, headers]) => fetcher(url, headers).then(data => z.array(BranchSchema).parse(data))
    );
};

// SWR Hooks
export const useAllBranches = (headers: ArtifactLogHeaders) => {
    return useSWR<BranchType[]>(
        [BASE_URL + '/branches', headers],
        ([url, headers]) => fetcher(url, headers).then(data => z.array(BranchSchema).parse(data))
    );
};

export const useBranchById = (branchId: number, headers: ArtifactLogHeaders) => {
    return useSWR<BranchType>(
        branchId ? [BASE_URL + `/branches/${branchId}`, headers] : null,
        ([url, headers]) => fetcher(url, headers).then(data => BranchSchema.parse(data))
    );
};

export const useAllTurns = (headers: ArtifactLogHeaders) => {
    return useSWR<TurnType[]>(
        [BASE_URL + '/all_turns', headers],
        ([url, headers]) => fetcher(url, headers).then(data => z.array(TurnSchema).parse(data))
    );
};

export const useBranchTurns = (branchId: number | null, headers: ArtifactLogHeaders): SWRResponse<TurnType[]> => {
    return useSWR<TurnType[]>(
        branchId ? [BASE_URL + `/turns/${branchId}`, headers] : null,
        ([url, headers]) => fetcher(url, headers).then(data => z.array(TurnSchema).parse(data))
    );
};





export const useBranchFromTurn = () => {
    const env = useModelEnv();
    const { mutate } = useBranchTurns(env.branch_id, env);
    return useMutationHook<BranchType, BranchType>({ 
        endpoint: `${BASE_URL}/branches`, 
        env,
        callbacks: {
            onSuccess: (data) => {
                mutate();
            }
        }
    });
};





// Example usage:
/*
const YourComponent = () => {
    const headers = { head_id: "123" };
    const { data: branches, error, isLoading } = useAllBranches(headers);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    return <div>{branches?.map(branch => <div key={branch.id}>{branch.name}</div>)}</div>;
};
*/


