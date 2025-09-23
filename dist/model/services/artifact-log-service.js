import useSWR from 'swr';
import { z } from 'zod';
import { useMutationHook } from '../../services/mutation2';
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
    id: z.string(),
    user_id: z.string(),
});
export const PartitionSchema = z.object({
    id: z.string(),
    name: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
    participants: z.array(ParticipantSchema),
});
// Fetcher functions
const fetcher = async (url) => {
    const response = await fetch(url, {});
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};
// SWR Hooks
export const useAllBranches = () => {
    return useSWR([BASE_URL + '/branches'], ([url]) => fetcher(url).then(data => z.array(BranchSchema).parse(data)));
};
export const useBranchById = (branchId) => {
    return useSWR(branchId ? [BASE_URL + `/branches/${branchId}`] : null, ([url]) => fetcher(url).then(data => BranchSchema.parse(data)));
};
export const useAllTurns = (headers) => {
    return useSWR([BASE_URL + '/all_turns', headers], ([url, headers]) => fetcher(url).then(data => z.array(TurnSchema).parse(data)));
};
export const useBranchTurns = (branchId, partitionId) => {
    return useSWR(branchId ? [BASE_URL + `/turns/${branchId}/partition/${partitionId}`] : null, ([url]) => fetcher(url).then(data => z.array(TurnSchema).parse(data)));
};
export const useUpdateTurn = (turnId) => {
    // const currHead = useVersionHead();
    return useMutationHook(`${BASE_URL}/turns/update/${turnId}`, 
    // env,
    // @ts-ignore
    {
        callbacks: {
            onSuccess: (data) => {
                // mutate();
            }
        }
    });
};
//# sourceMappingURL=artifact-log-service.js.map