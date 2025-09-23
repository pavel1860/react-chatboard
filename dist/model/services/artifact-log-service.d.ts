import { SWRResponse } from 'swr';
import { z } from 'zod';
export interface ArtifactLogHeaders {
    head_id: number;
    branch_id?: number;
    partition_id?: string;
}
declare const BranchSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    forked_from_index: z.ZodNullable<z.ZodNumber>;
    forked_from_branch_id: z.ZodNullable<z.ZodNumber>;
    forked_from_turn_id: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string | null;
    id: number;
    created_at: string;
    updated_at: string;
    forked_from_index: number | null;
    forked_from_branch_id: number | null;
    forked_from_turn_id: number | null;
}, {
    name: string | null;
    id: number;
    created_at: string;
    updated_at: string;
    forked_from_index: number | null;
    forked_from_branch_id: number | null;
    forked_from_turn_id: number | null;
}>;
declare const TurnSchema: z.ZodObject<{
    id: z.ZodNumber;
    branch_id: z.ZodNumber;
    index: z.ZodNumber;
    status: z.ZodEnum<["staged", "committed", "reverted"]>;
    created_at: z.ZodString;
    ended_at: z.ZodNullable<z.ZodString>;
    message: z.ZodNullable<z.ZodString>;
    user_context: z.ZodOptional<z.ZodAny>;
    trace_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    forked_branches: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        name: z.ZodNullable<z.ZodString>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
        forked_from_index: z.ZodNullable<z.ZodNumber>;
        forked_from_branch_id: z.ZodNullable<z.ZodNumber>;
        forked_from_turn_id: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string | null;
        id: number;
        created_at: string;
        updated_at: string;
        forked_from_index: number | null;
        forked_from_branch_id: number | null;
        forked_from_turn_id: number | null;
    }, {
        name: string | null;
        id: number;
        created_at: string;
        updated_at: string;
        forked_from_index: number | null;
        forked_from_branch_id: number | null;
        forked_from_turn_id: number | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    message: string | null;
    status: "committed" | "reverted" | "staged";
    id: number;
    index: number;
    created_at: string;
    branch_id: number;
    ended_at: string | null;
    forked_branches: {
        name: string | null;
        id: number;
        created_at: string;
        updated_at: string;
        forked_from_index: number | null;
        forked_from_branch_id: number | null;
        forked_from_turn_id: number | null;
    }[];
    user_context?: any;
    trace_id?: string | null | undefined;
}, {
    message: string | null;
    status: "committed" | "reverted" | "staged";
    id: number;
    index: number;
    created_at: string;
    branch_id: number;
    ended_at: string | null;
    forked_branches: {
        name: string | null;
        id: number;
        created_at: string;
        updated_at: string;
        forked_from_index: number | null;
        forked_from_branch_id: number | null;
        forked_from_turn_id: number | null;
    }[];
    user_context?: any;
    trace_id?: string | null | undefined;
}>;
export declare const HeadSchema: z.ZodObject<{
    id: z.ZodNumber;
    main_branch_id: z.ZodNullable<z.ZodNumber>;
    branch_id: z.ZodNullable<z.ZodNumber>;
    turn_id: z.ZodNullable<z.ZodNumber>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: number;
    created_at: string;
    updated_at: string;
    branch_id: number | null;
    main_branch_id: number | null;
    turn_id: number | null;
}, {
    id: number;
    created_at: string;
    updated_at: string;
    branch_id: number | null;
    main_branch_id: number | null;
    turn_id: number | null;
}>;
export declare const ParticipantSchema: z.ZodObject<{
    id: z.ZodString;
    user_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    user_id: string;
}, {
    id: string;
    user_id: string;
}>;
export declare const PartitionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    participants: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        user_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        user_id: string;
    }, {
        id: string;
        user_id: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    participants: {
        id: string;
        user_id: string;
    }[];
    created_at: string;
    updated_at: string;
}, {
    name: string;
    id: string;
    participants: {
        id: string;
        user_id: string;
    }[];
    created_at: string;
    updated_at: string;
}>;
export type BranchType = z.infer<typeof BranchSchema>;
export type TurnType = z.infer<typeof TurnSchema>;
export type HeadType = z.infer<typeof HeadSchema>;
export type PartitionType = z.infer<typeof PartitionSchema>;
export declare const useAllBranches: () => SWRResponse<{
    name: string | null;
    id: number;
    created_at: string;
    updated_at: string;
    forked_from_index: number | null;
    forked_from_branch_id: number | null;
    forked_from_turn_id: number | null;
}[], any, any>;
export declare const useBranchById: (branchId: number) => SWRResponse<{
    name: string | null;
    id: number;
    created_at: string;
    updated_at: string;
    forked_from_index: number | null;
    forked_from_branch_id: number | null;
    forked_from_turn_id: number | null;
}, any, any>;
export declare const useAllTurns: (headers: ArtifactLogHeaders) => SWRResponse<{
    message: string | null;
    status: "committed" | "reverted" | "staged";
    id: number;
    index: number;
    created_at: string;
    branch_id: number;
    ended_at: string | null;
    forked_branches: {
        name: string | null;
        id: number;
        created_at: string;
        updated_at: string;
        forked_from_index: number | null;
        forked_from_branch_id: number | null;
        forked_from_turn_id: number | null;
    }[];
    user_context?: any;
    trace_id?: string | null | undefined;
}[], any, any>;
export declare const useBranchTurns: (branchId: number | null, partitionId: string) => SWRResponse<TurnType[]>;
export declare const useUpdateTurn: (turnId: number) => import("swr/mutation").SWRMutationResponse<unknown, Error, import("swr").Key, never>;
export {};
//# sourceMappingURL=artifact-log-service.d.ts.map