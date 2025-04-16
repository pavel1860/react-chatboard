import useSWR, { SWRResponse } from 'swr';
import { z } from 'zod';
import { useMutationHook } from '../../services/mutation2';
import { useHeadEnv, useVersionHead } from "../hooks/artifact-head-hooks";
import {fetcher as fetcher3, VersionHead } from '../../services/fetcher3';


export interface ArtifactLogHeaders {
    head_id: number;
    branch_id?: number;
    partition_id?: number;
}

const BASE_URL = '/api/ai/artifact_log';

// Zod schemas for validation
const BranchSchema = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    // branch_index: z.number(),
    // turn_counter: z.number(),
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
    user_context: z.any().optional(),
    trace_id: z.string().nullable().optional(),
    forked_branches: z.array(BranchSchema)
});

export const HeadSchema = z.object({
    id: z.number(),
    main_branch_id: z.number().nullable(),
    branch_id: z.number().nullable(),
    turn_id: z.number().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
});


export const ParticipantSchema = z.object({
    id: z.number(),
    user_id: z.number(),
});

export const PartitionSchema = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    participants: z.array(ParticipantSchema),
});


// Types inferred from Zod schemas
export type BranchType = z.infer<typeof BranchSchema>;
export type TurnType = z.infer<typeof TurnSchema>;
export type HeadType = z.infer<typeof HeadSchema>;
export type PartitionType = z.infer<typeof PartitionSchema>;

const getHeaders = (headers: ArtifactLogHeaders): Headers => {
    const requestHeaders = new Headers();
    requestHeaders.append('head_id', headers.headId);
    if (headers.branchId) {
        requestHeaders.append('branch_id', headers.branchId);
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







// SWR Hooks
export const useAllBranches = (headers: ArtifactLogHeaders) => {
    return useSWR<BranchType[]>(
        [BASE_URL + '/branches', headers],
        ([url, headers]) => fetcher(url, headers).then(data => z.array(BranchSchema).parse(data))
    );
};





export const usePartitions = (head: VersionHead) => {
    const env = useVersionHead(head);
    return useSWR<PartitionType[]>(
        [BASE_URL + '/partitions', env],
        ([url, env]: [string, VersionHead]) => fetcher3<PartitionType[]>(url, {schema: z.array(PartitionSchema), head: env})
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

export const useBranchTurns = (branchId: number | null): SWRResponse<TurnType[]> => {
    
    return useSWR<TurnType[]>(
        branchId ? [BASE_URL + `/turns/${branchId}`] : null,
        ([url]) => fetcher(url, { branchId: branchId }).then(data => z.array(TurnSchema).parse(data))
    );
};


export const useUpdateTurn = (turnId: number, head?: VersionHead) => {
    // const currHead = useVersionHead();
    return useMutationHook<TurnType, TurnType>(
        `${BASE_URL}/turns/update/${turnId}`,
        // env,
        {
            head: head,
            callbacks: {
                onSuccess: (data) => {
                    // mutate();
                }
            }
        });
}




export const useBranchFromTurn = (head?: VersionHead) => {
    const currHead = useVersionHead(head);
    const { mutate } = useBranchTurns(currHead.branchId);
    return useMutationHook<BranchType, BranchType>(
        `${BASE_URL}/branches`,
        {         
            head: currHead,
            callbacks: {
                onSuccess: (data) => {
                    mutate();
                }
            }
        });
}

// export const useBranchFromTurn = () => {
//     const env = useHeadEnv();
//     const { mutate } = useBranchTurns(env.branch_id);
//     return useMutationHook<BranchType, BranchType>({ 
//         endpoint: `${BASE_URL}/branches`, 
//         env,
//         callbacks: {
//             onSuccess: (data) => {
//                 mutate();
//             }
//         }
//     });
// };





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


