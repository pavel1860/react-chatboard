import useSWR, { SWRResponse } from 'swr';
import { z } from 'zod';
import { useMutationHook } from '../../services/mutation2';
import { useHeadEnv, useVersionHead } from "../hooks/artifact-head-hooks";
import {fetcher as fetcher3 } from '../../services/fetcher3';


export interface ArtifactLogHeaders {
    head_id: number;
    branch_id?: number;
    partition_id?: number;
}

const BASE_URL = '/api/ai/artifact_log';

// Zod schemas for validation
const BranchSchema = z.object({
    id: z.number(),
    name: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    // branch_index: z.number(),
    // turn_counter: z.number(),
    forked_from_index: z.number().nullable(),
    forked_from_branch_id: z.number().nullable(),
    forked_from_turn_id: z.number().nullable(),
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

// Fetcher functions
const fetcher = async (url: string) => {
    const response = await fetch(url, {
        
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
};







// SWR Hooks
export const useAllBranches = () => {
    return useSWR<BranchType[]>(
        [BASE_URL + '/branches'],
        ([url]) => fetcher(url).then(data => z.array(BranchSchema).parse(data))
    );
};






export const useBranchById = (branchId: number) => {
    return useSWR<BranchType>(
        branchId ? [BASE_URL + `/branches/${branchId}`] : null,
        ([url]) => fetcher(url).then(data => BranchSchema.parse(data))
    );
};

export const useAllTurns = (headers: ArtifactLogHeaders) => {
    return useSWR<TurnType[]>(
        [BASE_URL + '/all_turns', headers],
        ([url, headers]) => fetcher(url).then(data => z.array(TurnSchema).parse(data))
    );
};

export const useBranchTurns = (branchId: number | null, partitionId: number): SWRResponse<TurnType[]> => {
    
    return useSWR<TurnType[]>(
        branchId ? [BASE_URL + `/turns/${branchId}/partition/${partitionId}`] : null,
        ([url]) => fetcher(url).then(data => z.array(TurnSchema).parse(data))
    );
};


export const useUpdateTurn = (turnId: number) => {
    // const currHead = useVersionHead();
    return useMutationHook(
        `${BASE_URL}/turns/update/${turnId}`,
        // env,
        // @ts-ignore
        {
            callbacks: {
                onSuccess: (data) => {
                    // mutate();
                }
            }
        });
}
