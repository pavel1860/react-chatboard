import { z } from "zod";
declare const ConversationPayloadSchema: z.ZodObject<{
    name: z.ZodNullable<z.ZodString>;
    avatar: z.ZodNullable<z.ZodString>;
    phoneNumber: z.ZodNullable<z.ZodString>;
    platform: z.ZodNullable<z.ZodString>;
    provider: z.ZodNullable<z.ZodString>;
    turns: z.ZodArray<z.ZodAny, "many">;
    participants: z.ZodArray<z.ZodAny, "many">;
}, "strip", z.ZodTypeAny, {
    name: string | null;
    provider: string | null;
    turns: any[];
    avatar: string | null;
    phoneNumber: string | null;
    platform: string | null;
    participants: any[];
}, {
    name: string | null;
    provider: string | null;
    turns: any[];
    avatar: string | null;
    phoneNumber: string | null;
    platform: string | null;
    participants: any[];
}>;
declare const ConversationSchema: z.ZodObject<{
    name: z.ZodNullable<z.ZodString>;
    avatar: z.ZodNullable<z.ZodString>;
    phoneNumber: z.ZodNullable<z.ZodString>;
    platform: z.ZodNullable<z.ZodString>;
    provider: z.ZodNullable<z.ZodString>;
    turns: z.ZodArray<z.ZodAny, "many">;
    participants: z.ZodArray<z.ZodAny, "many">;
    id: z.ZodString;
    createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
    updatedAt: z.ZodEffects<z.ZodDate, Date, unknown>;
}, "strip", z.ZodTypeAny, {
    name: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    provider: string | null;
    turns: any[];
    avatar: string | null;
    phoneNumber: string | null;
    platform: string | null;
    participants: any[];
}, {
    name: string | null;
    id: string;
    provider: string | null;
    turns: any[];
    avatar: string | null;
    phoneNumber: string | null;
    platform: string | null;
    participants: any[];
    createdAt?: unknown;
    updatedAt?: unknown;
}>;
export type ConversationType = z.infer<typeof ConversationSchema>;
export type ConversationPayloadType = z.infer<typeof ConversationPayloadSchema>;
declare const useConversationList: (params: import("../hooks/modelHooks").UseFetchModelListParams<{
    name: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    provider: string | null;
    turns: any[];
    avatar: string | null;
    phoneNumber: string | null;
    platform: string | null;
    participants: any[];
}, {
    branchId: number;
}> & {
    defaultFilters?: import("./query-builder").DefaultFilter<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    }>[] | undefined;
}, hookConfig?: import("../hooks/modelHooks").InfiniteConfiguration<{
    name: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    provider: string | null;
    turns: any[];
    avatar: string | null;
    phoneNumber: string | null;
    platform: string | null;
    participants: any[];
}> | undefined) => {
    items: {
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    }[];
    trigger: () => void;
    filters: import("./query-builder").DefaultFilter<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    } & Record<string, any>>[];
    where: <K extends string>(filter: [K, import("./query-builder").FilterOperators<({
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    } & Record<string, any>)[K]>, ({
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    } & Record<string, any>)[K]]) => void;
    build: () => string;
    reset: () => void;
    queryString: string;
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    }[][] | undefined>;
    mutate: import("swr/infinite").SWRInfiniteKeyedMutator<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    }[][]>;
    error: any;
    data: {
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    }[][] | undefined;
    isLoading: import("swr/_internal").IsLoadingResponse<Data, Config>;
    isValidating: boolean;
};
declare const useConversation: (params: Partial<import("../hooks/modelHooks").UseFetchModelParams<{
    branchId: number;
}>>, hookConfig?: import("../hooks/modelHooks").SingleConfiguration<{
    name: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    provider: string | null;
    turns: any[];
    avatar: string | null;
    phoneNumber: string | null;
    platform: string | null;
    participants: any[];
}> | undefined) => import("../hooks/modelHooks").UseFetchModelReturn<{
    name: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    provider: string | null;
    turns: any[];
    avatar: string | null;
    phoneNumber: string | null;
    platform: string | null;
    participants: any[];
}>;
declare const useCreateConversation: (params?: {
    ctx?: {
        branchId: number;
    } | undefined;
    headers?: Record<string, string>;
} | undefined) => {
    trigger: import("swr/mutation").TriggerWithOptionsArgs<{
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    }, {
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    }, any, any>;
    data: {
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    } | undefined;
    error: {
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    } | undefined;
    isMutating: boolean;
};
declare const useUpdateConversation: (params?: import("../hooks/modelHooks").UseMutateModelParams<{
    name: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    provider: string | null;
    turns: any[];
    avatar: string | null;
    phoneNumber: string | null;
    platform: string | null;
    participants: any[];
}, {
    name: string | null;
    provider: string | null;
    turns: any[];
    avatar: string | null;
    phoneNumber: string | null;
    platform: string | null;
    participants: any[];
}, {
    branchId: number;
}> | undefined) => {
    trigger: import("swr/mutation").TriggerWithOptionsArgs<{
        name: string | null;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    }, {
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    }, any, any>;
    data: {
        name: string | null;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    } | undefined;
    error: {
        name: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        provider: string | null;
        turns: any[];
        avatar: string | null;
        phoneNumber: string | null;
        platform: string | null;
        participants: any[];
    } | undefined;
    isMutating: boolean;
};
export { useConversationList, useConversation, useCreateConversation, useUpdateConversation, };
//# sourceMappingURL=conversationService.d.ts.map