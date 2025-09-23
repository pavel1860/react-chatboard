import { BranchSchema, BranchPayloadSchema } from "../components/chat/schema";
import { z } from "zod";
export declare const ChoiceSchema: z.ZodObject<{
    label: z.ZodNullable<z.ZodString>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    label: string | null;
}, {
    content: string;
    label: string | null;
}>;
export declare const ChoiceListSchema: z.ZodObject<{
    task: z.ZodNullable<z.ZodString>;
    choices: z.ZodArray<z.ZodObject<{
        label: z.ZodNullable<z.ZodString>;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        content: string;
        label: string | null;
    }, {
        content: string;
        label: string | null;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    task: string | null;
    choices: {
        content: string;
        label: string | null;
    }[];
}, {
    task: string | null;
    choices: {
        content: string;
        label: string | null;
    }[];
}>;
export declare const MessagePayloadSchema: z.ZodObject<{
    content: z.ZodString;
    choices: z.ZodNullable<z.ZodObject<{
        task: z.ZodNullable<z.ZodString>;
        choices: z.ZodArray<z.ZodObject<{
            label: z.ZodNullable<z.ZodString>;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
            label: string | null;
        }, {
            content: string;
            label: string | null;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        task: string | null;
        choices: {
            content: string;
            label: string | null;
        }[];
    }, {
        task: string | null;
        choices: {
            content: string;
            label: string | null;
        }[];
    }>>;
    state: z.ZodAny;
    role: z.ZodEnum<["user", "assistant", "tool"]>;
    toolCalls: z.ZodArray<z.ZodAny, "many">;
    runId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    role: "user" | "assistant" | "tool";
    choices: {
        task: string | null;
        choices: {
            content: string;
            label: string | null;
        }[];
    } | null;
    toolCalls: any[];
    state?: any;
    runId?: string | null | undefined;
}, {
    content: string;
    role: "user" | "assistant" | "tool";
    choices: {
        task: string | null;
        choices: {
            content: string;
            label: string | null;
        }[];
    } | null;
    toolCalls: any[];
    state?: any;
    runId?: string | null | undefined;
}>;
export declare const MessageSchema: z.ZodObject<{
    partitionId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    meta: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
    content: z.ZodString;
    choices: z.ZodNullable<z.ZodObject<{
        task: z.ZodNullable<z.ZodString>;
        choices: z.ZodArray<z.ZodObject<{
            label: z.ZodNullable<z.ZodString>;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
            label: string | null;
        }, {
            content: string;
            label: string | null;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        task: string | null;
        choices: {
            content: string;
            label: string | null;
        }[];
    }, {
        task: string | null;
        choices: {
            content: string;
            label: string | null;
        }[];
    }>>;
    state: z.ZodAny;
    role: z.ZodEnum<["user", "assistant", "tool"]>;
    toolCalls: z.ZodArray<z.ZodAny, "many">;
    runId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    branchId: z.ZodNumber;
    turnId: z.ZodNumber;
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    branchId: number;
    turnId: number;
    id: number;
    content: string;
    role: "user" | "assistant" | "tool";
    choices: {
        task: string | null;
        choices: {
            content: string;
            label: string | null;
        }[];
    } | null;
    toolCalls: any[];
    partitionId?: string | null | undefined;
    state?: any;
    runId?: string | null | undefined;
    meta?: any;
}, {
    branchId: number;
    turnId: number;
    id: number;
    content: string;
    role: "user" | "assistant" | "tool";
    choices: {
        task: string | null;
        choices: {
            content: string;
            label: string | null;
        }[];
    } | null;
    toolCalls: any[];
    partitionId?: string | null | undefined;
    state?: any;
    runId?: string | null | undefined;
    meta?: any;
}>;
declare const TurnPayloadSchema: z.ZodObject<{
    partitionId: z.ZodString;
    index: z.ZodNumber;
    status: z.ZodString;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    traceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    branchId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    branchId: number;
    status: string;
    index: number;
    partitionId: string;
    message?: string | null | undefined;
    traceId?: string | null | undefined;
}, {
    branchId: number;
    status: string;
    index: number;
    partitionId: string;
    message?: string | null | undefined;
    traceId?: string | null | undefined;
}>;
declare const TurnSchema: z.ZodObject<{
    messages: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        partitionId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        meta: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
        content: z.ZodString;
        choices: z.ZodNullable<z.ZodObject<{
            task: z.ZodNullable<z.ZodString>;
            choices: z.ZodArray<z.ZodObject<{
                label: z.ZodNullable<z.ZodString>;
                content: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                content: string;
                label: string | null;
            }, {
                content: string;
                label: string | null;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        }, {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        }>>;
        state: z.ZodAny;
        role: z.ZodEnum<["user", "assistant", "tool"]>;
        toolCalls: z.ZodArray<z.ZodAny, "many">;
        runId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        branchId: z.ZodNumber;
        turnId: z.ZodNumber;
        id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        branchId: number;
        turnId: number;
        id: number;
        content: string;
        role: "user" | "assistant" | "tool";
        choices: {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        } | null;
        toolCalls: any[];
        partitionId?: string | null | undefined;
        state?: any;
        runId?: string | null | undefined;
        meta?: any;
    }, {
        branchId: number;
        turnId: number;
        id: number;
        content: string;
        role: "user" | "assistant" | "tool";
        choices: {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        } | null;
        toolCalls: any[];
        partitionId?: string | null | undefined;
        state?: any;
        runId?: string | null | undefined;
        meta?: any;
    }>, "many">>>;
    forkedBranches: z.ZodArray<z.ZodNumber, "many">;
    span: z.ZodNullable<z.ZodType<any, z.ZodTypeDef, any>>;
    index: z.ZodNumber;
    status: z.ZodString;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    traceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    branchId: z.ZodNumber;
    id: z.ZodNumber;
    createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
    endedAt: z.ZodNullable<z.ZodEffects<z.ZodDate, Date, unknown>>;
}, "strip", z.ZodTypeAny, {
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    index: number;
    endedAt: Date | null;
    forkedBranches: number[];
    message?: string | null | undefined;
    span?: any;
    traceId?: string | null | undefined;
    messages?: {
        branchId: number;
        turnId: number;
        id: number;
        content: string;
        role: "user" | "assistant" | "tool";
        choices: {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        } | null;
        toolCalls: any[];
        partitionId?: string | null | undefined;
        state?: any;
        runId?: string | null | undefined;
        meta?: any;
    }[] | null | undefined;
}, {
    branchId: number;
    status: string;
    id: number;
    index: number;
    forkedBranches: number[];
    message?: string | null | undefined;
    createdAt?: unknown;
    span?: any;
    traceId?: string | null | undefined;
    endedAt?: unknown;
    messages?: {
        branchId: number;
        turnId: number;
        id: number;
        content: string;
        role: "user" | "assistant" | "tool";
        choices: {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        } | null;
        toolCalls: any[];
        partitionId?: string | null | undefined;
        state?: any;
        runId?: string | null | undefined;
        meta?: any;
    }[] | null | undefined;
}>;
export type ChoiceType = z.infer<typeof ChoiceSchema>;
export type ChoiceListType = z.infer<typeof ChoiceListSchema>;
export type MessagePayloadType = z.infer<typeof MessagePayloadSchema>;
export type MessageType = z.infer<typeof MessageSchema>;
export type TurnType = z.infer<typeof TurnSchema>;
export type TurnPayloadType = z.infer<typeof TurnPayloadSchema>;
export type BranchType = z.infer<typeof BranchSchema>;
export type BranchPayloadType = z.infer<typeof BranchPayloadSchema>;
declare const useTurnList: (params: import("../hooks/modelHooks").UseFetchModelListParams<unknown, {
    branchId: number;
}> & {
    defaultFilters?: import("./query-builder").DefaultFilter<unknown>[] | undefined;
}, hookConfig?: import("../hooks/modelHooks").InfiniteConfiguration<unknown> | undefined) => {
    items: unknown[];
    trigger: () => void;
    filters: import("./query-builder").DefaultFilter<Record<string, any>>[];
    where: <K extends string>(filter: [K, "==" | ">" | "<" | ">=" | "<=" | "!=" | "contains", any]) => void;
    build: () => string;
    reset: () => void;
    queryString: string;
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<unknown[][] | undefined>;
    mutate: import("swr/infinite").SWRInfiniteKeyedMutator<unknown[][]>;
    error: any;
    data: unknown[][] | undefined;
    isLoading: import("swr/_internal").IsLoadingResponse<Data, Config>;
    isValidating: boolean;
};
declare const useVersionTurnList: (params: import("../hooks/modelHooks").UseFetchModelListParams<{
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    index: number;
    endedAt: Date | null;
    forkedBranches: number[];
    message?: string | null | undefined;
    span?: any;
    traceId?: string | null | undefined;
    messages?: {
        branchId: number;
        turnId: number;
        id: number;
        content: string;
        role: "user" | "assistant" | "tool";
        choices: {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        } | null;
        toolCalls: any[];
        partitionId?: string | null | undefined;
        state?: any;
        runId?: string | null | undefined;
        meta?: any;
    }[] | null | undefined;
}, {
    branchId: number;
}> & {
    defaultFilters?: import("./query-builder").DefaultFilter<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }>[] | undefined;
}, hookConfig?: import("../hooks/modelHooks").InfiniteConfiguration<{
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    index: number;
    endedAt: Date | null;
    forkedBranches: number[];
    message?: string | null | undefined;
    span?: any;
    traceId?: string | null | undefined;
    messages?: {
        branchId: number;
        turnId: number;
        id: number;
        content: string;
        role: "user" | "assistant" | "tool";
        choices: {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        } | null;
        toolCalls: any[];
        partitionId?: string | null | undefined;
        state?: any;
        runId?: string | null | undefined;
        meta?: any;
    }[] | null | undefined;
}> | undefined) => {
    items: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[];
    trigger: () => void;
    filters: import("./query-builder").DefaultFilter<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    } & Record<string, any>>[];
    where: <K extends string>(filter: [K, import("./query-builder").FilterOperators<({
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    } & Record<string, any>)[K]>, ({
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    } & Record<string, any>)[K]]) => void;
    build: () => string;
    reset: () => void;
    queryString: string;
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[][] | undefined>;
    mutate: import("swr/infinite").SWRInfiniteKeyedMutator<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[][]>;
    error: any;
    data: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[][] | undefined;
    isLoading: import("swr/_internal").IsLoadingResponse<Data, Config>;
    isValidating: boolean;
};
export { useTurnList, useVersionTurnList };
declare const useTurnApproval: (params?: {
    ctx?: {
        branchId: number;
    } | undefined;
    headers?: Record<string, string>;
} | undefined) => {
    trigger: (payload: unknown) => void;
    data: unknown;
    error: unknown;
    isMutating: boolean;
};
declare const useTurnMessages: (params: import("../hooks/modelHooks").UseFetchModelListParams<{
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    index: number;
    endedAt: Date | null;
    forkedBranches: number[];
    message?: string | null | undefined;
    span?: any;
    traceId?: string | null | undefined;
    messages?: {
        branchId: number;
        turnId: number;
        id: number;
        content: string;
        role: "user" | "assistant" | "tool";
        choices: {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        } | null;
        toolCalls: any[];
        partitionId?: string | null | undefined;
        state?: any;
        runId?: string | null | undefined;
        meta?: any;
    }[] | null | undefined;
}, {
    branchId: number;
    partitionId: string;
}> & {
    defaultFilters?: import("./query-builder").DefaultFilter<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }>[] | undefined;
}, hookConfig?: import("../hooks/modelHooks").InfiniteConfiguration<{
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    index: number;
    endedAt: Date | null;
    forkedBranches: number[];
    message?: string | null | undefined;
    span?: any;
    traceId?: string | null | undefined;
    messages?: {
        branchId: number;
        turnId: number;
        id: number;
        content: string;
        role: "user" | "assistant" | "tool";
        choices: {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        } | null;
        toolCalls: any[];
        partitionId?: string | null | undefined;
        state?: any;
        runId?: string | null | undefined;
        meta?: any;
    }[] | null | undefined;
}> | undefined) => {
    items: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[];
    trigger: () => void;
    filters: import("./query-builder").DefaultFilter<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    } & Record<string, any>>[];
    where: <K extends string>(filter: [K, import("./query-builder").FilterOperators<({
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    } & Record<string, any>)[K]>, ({
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    } & Record<string, any>)[K]]) => void;
    build: () => string;
    reset: () => void;
    queryString: string;
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[][] | undefined>;
    mutate: import("swr/infinite").SWRInfiniteKeyedMutator<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[][]>;
    error: any;
    data: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[][] | undefined;
    isLoading: import("swr/_internal").IsLoadingResponse<Data, Config>;
    isValidating: boolean;
};
declare const useTurnBlocks: (params: import("../hooks/modelHooks").UseFetchModelListParams<{
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    index: number;
    endedAt: Date | null;
    forkedBranches: number[];
    message?: string | null | undefined;
    span?: any;
    traceId?: string | null | undefined;
    messages?: {
        branchId: number;
        turnId: number;
        id: number;
        content: string;
        role: "user" | "assistant" | "tool";
        choices: {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        } | null;
        toolCalls: any[];
        partitionId?: string | null | undefined;
        state?: any;
        runId?: string | null | undefined;
        meta?: any;
    }[] | null | undefined;
}, {
    branchId: number;
    partitionId: string;
}> & {
    defaultFilters?: import("./query-builder").DefaultFilter<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }>[] | undefined;
}, hookConfig?: import("../hooks/modelHooks").InfiniteConfiguration<{
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    index: number;
    endedAt: Date | null;
    forkedBranches: number[];
    message?: string | null | undefined;
    span?: any;
    traceId?: string | null | undefined;
    messages?: {
        branchId: number;
        turnId: number;
        id: number;
        content: string;
        role: "user" | "assistant" | "tool";
        choices: {
            task: string | null;
            choices: {
                content: string;
                label: string | null;
            }[];
        } | null;
        toolCalls: any[];
        partitionId?: string | null | undefined;
        state?: any;
        runId?: string | null | undefined;
        meta?: any;
    }[] | null | undefined;
}> | undefined) => {
    items: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[];
    trigger: () => void;
    filters: import("./query-builder").DefaultFilter<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    } & Record<string, any>>[];
    where: <K extends string>(filter: [K, import("./query-builder").FilterOperators<({
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    } & Record<string, any>)[K]>, ({
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    } & Record<string, any>)[K]]) => void;
    build: () => string;
    reset: () => void;
    queryString: string;
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[][] | undefined>;
    mutate: import("swr/infinite").SWRInfiniteKeyedMutator<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[][]>;
    error: any;
    data: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        index: number;
        endedAt: Date | null;
        forkedBranches: number[];
        message?: string | null | undefined;
        span?: any;
        traceId?: string | null | undefined;
        messages?: {
            branchId: number;
            turnId: number;
            id: number;
            content: string;
            role: "user" | "assistant" | "tool";
            choices: {
                task: string | null;
                choices: {
                    content: string;
                    label: string | null;
                }[];
            } | null;
            toolCalls: any[];
            partitionId?: string | null | undefined;
            state?: any;
            runId?: string | null | undefined;
            meta?: any;
        }[] | null | undefined;
    }[][] | undefined;
    isLoading: import("swr/_internal").IsLoadingResponse<Data, Config>;
    isValidating: boolean;
};
export { useTurnMessages, useTurnApproval, useTurnBlocks };
//# sourceMappingURL=turnService.d.ts.map