import { z } from "zod";
declare const EvaluationSchema: z.ZodObject<{
    evaluator: z.ZodString;
    metadata: z.ZodNullable<z.ZodAny>;
    score: z.ZodNullable<z.ZodNumber>;
    turnEvalId: z.ZodNullable<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    evaluator: string;
    score: number | null;
    turnEvalId: number | null;
    metadata?: any;
}, {
    evaluator: string;
    score: number | null;
    turnEvalId: number | null;
    metadata?: any;
}>;
declare const TurnEvalPayloadSchema: z.ZodObject<{
    refTurnId: z.ZodNullable<z.ZodNumber>;
    refTestRunId: z.ZodNullable<z.ZodNumber>;
    score: z.ZodNullable<z.ZodNumber>;
    traceId: z.ZodNullable<z.ZodString>;
    evaluations: z.ZodArray<z.ZodObject<{
        evaluator: z.ZodString;
        metadata: z.ZodNullable<z.ZodAny>;
        score: z.ZodNullable<z.ZodNumber>;
        turnEvalId: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        evaluator: string;
        score: number | null;
        turnEvalId: number | null;
        metadata?: any;
    }, {
        evaluator: string;
        score: number | null;
        turnEvalId: number | null;
        metadata?: any;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    traceId: string | null;
    score: number | null;
    refTurnId: number | null;
    refTestRunId: number | null;
    evaluations: {
        evaluator: string;
        score: number | null;
        turnEvalId: number | null;
        metadata?: any;
    }[];
}, {
    traceId: string | null;
    score: number | null;
    refTurnId: number | null;
    refTestRunId: number | null;
    evaluations: {
        evaluator: string;
        score: number | null;
        turnEvalId: number | null;
        metadata?: any;
    }[];
}>;
declare const TurnEvalSchema: z.ZodObject<{
    testRunId: z.ZodNumber;
    refTurnId: z.ZodNullable<z.ZodNumber>;
    refTestRunId: z.ZodNullable<z.ZodNumber>;
    score: z.ZodNullable<z.ZodNumber>;
    traceId: z.ZodNullable<z.ZodString>;
    evaluations: z.ZodArray<z.ZodObject<{
        evaluator: z.ZodString;
        metadata: z.ZodNullable<z.ZodAny>;
        score: z.ZodNullable<z.ZodNumber>;
        turnEvalId: z.ZodNullable<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        evaluator: string;
        score: number | null;
        turnEvalId: number | null;
        metadata?: any;
    }, {
        evaluator: string;
        score: number | null;
        turnEvalId: number | null;
        metadata?: any;
    }>, "many">;
    id: z.ZodNumber;
    createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
}, "strip", z.ZodTypeAny, {
    id: number;
    createdAt: Date;
    traceId: string | null;
    score: number | null;
    refTurnId: number | null;
    refTestRunId: number | null;
    evaluations: {
        evaluator: string;
        score: number | null;
        turnEvalId: number | null;
        metadata?: any;
    }[];
    testRunId: number;
}, {
    id: number;
    traceId: string | null;
    score: number | null;
    refTurnId: number | null;
    refTestRunId: number | null;
    evaluations: {
        evaluator: string;
        score: number | null;
        turnEvalId: number | null;
        metadata?: any;
    }[];
    testRunId: number;
    createdAt?: unknown;
}>;
declare const TestRunPayloadSchema: z.ZodObject<{
    testCaseId: z.ZodNumber;
    branchId: z.ZodNumber;
    partitionId: z.ZodString;
    status: z.ZodString;
    score: z.ZodNullable<z.ZodNumber>;
    turnEvals: z.ZodArray<z.ZodObject<{
        testRunId: z.ZodNumber;
        refTurnId: z.ZodNullable<z.ZodNumber>;
        refTestRunId: z.ZodNullable<z.ZodNumber>;
        score: z.ZodNullable<z.ZodNumber>;
        traceId: z.ZodNullable<z.ZodString>;
        evaluations: z.ZodArray<z.ZodObject<{
            evaluator: z.ZodString;
            metadata: z.ZodNullable<z.ZodAny>;
            score: z.ZodNullable<z.ZodNumber>;
            turnEvalId: z.ZodNullable<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }, {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }>, "many">;
        id: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
    }, "strip", z.ZodTypeAny, {
        id: number;
        createdAt: Date;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
    }, {
        id: number;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
        createdAt?: unknown;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    branchId: number;
    status: string;
    score: number | null;
    testCaseId: number;
    partitionId: string;
    turnEvals: {
        id: number;
        createdAt: Date;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
    }[];
}, {
    branchId: number;
    status: string;
    score: number | null;
    testCaseId: number;
    partitionId: string;
    turnEvals: {
        id: number;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
        createdAt?: unknown;
    }[];
}>;
declare const TestRunSchema: z.ZodObject<{
    testCaseId: z.ZodNumber;
    branchId: z.ZodNumber;
    partitionId: z.ZodString;
    status: z.ZodString;
    score: z.ZodNullable<z.ZodNumber>;
    turnEvals: z.ZodArray<z.ZodObject<{
        testRunId: z.ZodNumber;
        refTurnId: z.ZodNullable<z.ZodNumber>;
        refTestRunId: z.ZodNullable<z.ZodNumber>;
        score: z.ZodNullable<z.ZodNumber>;
        traceId: z.ZodNullable<z.ZodString>;
        evaluations: z.ZodArray<z.ZodObject<{
            evaluator: z.ZodString;
            metadata: z.ZodNullable<z.ZodAny>;
            score: z.ZodNullable<z.ZodNumber>;
            turnEvalId: z.ZodNullable<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }, {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }>, "many">;
        id: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
    }, "strip", z.ZodTypeAny, {
        id: number;
        createdAt: Date;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
    }, {
        id: number;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
        createdAt?: unknown;
    }>, "many">;
    id: z.ZodNumber;
    createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
    updatedAt: z.ZodEffects<z.ZodDate, Date, unknown>;
}, "strip", z.ZodTypeAny, {
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    score: number | null;
    testCaseId: number;
    partitionId: string;
    turnEvals: {
        id: number;
        createdAt: Date;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
    }[];
}, {
    branchId: number;
    status: string;
    id: number;
    score: number | null;
    testCaseId: number;
    partitionId: string;
    turnEvals: {
        id: number;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
        createdAt?: unknown;
    }[];
    createdAt?: unknown;
    updatedAt?: unknown;
}>;
declare const EvaluatorConfigSchema: z.ZodObject<{
    name: z.ZodString;
    metadata: z.ZodAny;
}, "strip", z.ZodTypeAny, {
    name: string;
    metadata?: any;
}, {
    name: string;
    metadata?: any;
}>;
declare const TurnEvaluatorSchema: z.ZodObject<{
    turnId: z.ZodNumber;
    evaluators: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        metadata: z.ZodAny;
    }, "strip", z.ZodTypeAny, {
        name: string;
        metadata?: any;
    }, {
        name: string;
        metadata?: any;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    turnId: number;
    evaluators: {
        name: string;
        metadata?: any;
    }[];
}, {
    turnId: number;
    evaluators: {
        name: string;
        metadata?: any;
    }[];
}>;
declare const TestCasePayloadSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    branchId: z.ZodNumber;
    userId: z.ZodNullable<z.ZodString>;
    testTurns: z.ZodArray<z.ZodObject<{
        evaluators: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            metadata: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            name: string;
            metadata?: any;
        }, {
            name: string;
            metadata?: any;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }, {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    branchId: number;
    title: string;
    description: string | null;
    userId: string | null;
    testTurns: {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }[];
}, {
    branchId: number;
    title: string;
    description: string | null;
    userId: string | null;
    testTurns: {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }[];
}>;
declare const TestCaseSchema: z.ZodObject<{
    testRuns: z.ZodArray<z.ZodObject<{
        testCaseId: z.ZodNumber;
        branchId: z.ZodNumber;
        partitionId: z.ZodString;
        status: z.ZodString;
        score: z.ZodNullable<z.ZodNumber>;
        turnEvals: z.ZodArray<z.ZodObject<{
            testRunId: z.ZodNumber;
            refTurnId: z.ZodNullable<z.ZodNumber>;
            refTestRunId: z.ZodNullable<z.ZodNumber>;
            score: z.ZodNullable<z.ZodNumber>;
            traceId: z.ZodNullable<z.ZodString>;
            evaluations: z.ZodArray<z.ZodObject<{
                evaluator: z.ZodString;
                metadata: z.ZodNullable<z.ZodAny>;
                score: z.ZodNullable<z.ZodNumber>;
                turnEvalId: z.ZodNullable<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }, {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }>, "many">;
            id: z.ZodNumber;
            createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
        }, "strip", z.ZodTypeAny, {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }, {
            id: number;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
            createdAt?: unknown;
        }>, "many">;
        id: z.ZodNumber;
        createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
        updatedAt: z.ZodEffects<z.ZodDate, Date, unknown>;
    }, "strip", z.ZodTypeAny, {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }, {
        branchId: number;
        status: string;
        id: number;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
            createdAt?: unknown;
        }[];
        createdAt?: unknown;
        updatedAt?: unknown;
    }>, "many">;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    branchId: z.ZodNumber;
    userId: z.ZodNullable<z.ZodString>;
    testTurns: z.ZodArray<z.ZodObject<{
        evaluators: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            metadata: z.ZodAny;
        }, "strip", z.ZodTypeAny, {
            name: string;
            metadata?: any;
        }, {
            name: string;
            metadata?: any;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }, {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }>, "many">;
    id: z.ZodNumber;
    createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
    updatedAt: z.ZodEffects<z.ZodDate, Date, unknown>;
}, "strip", z.ZodTypeAny, {
    branchId: number;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    userId: string | null;
    testTurns: {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }[];
    testRuns: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }[];
}, {
    branchId: number;
    id: number;
    title: string;
    description: string | null;
    userId: string | null;
    testTurns: {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }[];
    testRuns: {
        branchId: number;
        status: string;
        id: number;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
            createdAt?: unknown;
        }[];
        createdAt?: unknown;
        updatedAt?: unknown;
    }[];
    createdAt?: unknown;
    updatedAt?: unknown;
}>;
export type EvaluationType = z.infer<typeof EvaluationSchema>;
export type TurnEvalType = z.infer<typeof TurnEvalSchema>;
export type EvaluatorConfigType = z.infer<typeof EvaluatorConfigSchema>;
export type TurnEvaluatorType = z.infer<typeof TurnEvaluatorSchema>;
export type TestRunType = z.infer<typeof TestRunSchema>;
export type TestRunPayloadType = z.infer<typeof TestRunPayloadSchema>;
export type TestCaseType = z.infer<typeof TestCaseSchema>;
export type TestCasePayloadType = z.infer<typeof TestCasePayloadSchema>;
declare const useTestRunList: (params: import("../hooks/modelHooks").UseFetchModelListParams<{
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    score: number | null;
    testCaseId: number;
    partitionId: string;
    turnEvals: {
        id: number;
        createdAt: Date;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
    }[];
}, {
    branchId: number;
}> & {
    defaultFilters?: import("./query-builder").DefaultFilter<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }>[] | undefined;
}, hookConfig?: import("../hooks/modelHooks").InfiniteConfiguration<{
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    score: number | null;
    testCaseId: number;
    partitionId: string;
    turnEvals: {
        id: number;
        createdAt: Date;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
    }[];
}> | undefined) => {
    items: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }[];
    trigger: () => void;
    filters: import("./query-builder").DefaultFilter<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    } & Record<string, any>>[];
    where: <K extends string>(filter: [K, import("./query-builder").FilterOperators<({
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    } & Record<string, any>)[K]>, ({
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
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
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }[][] | undefined>;
    mutate: import("swr/infinite").SWRInfiniteKeyedMutator<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }[][]>;
    error: any;
    data: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }[][] | undefined;
    isLoading: import("swr/_internal").IsLoadingResponse<Data, Config>;
    isValidating: boolean;
};
declare const useTestRun: (params: Partial<import("../hooks/modelHooks").UseFetchModelParams<{
    branchId: number;
}>>, hookConfig?: import("../hooks/modelHooks").SingleConfiguration<{
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    score: number | null;
    testCaseId: number;
    partitionId: string;
    turnEvals: {
        id: number;
        createdAt: Date;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
    }[];
}> | undefined) => import("../hooks/modelHooks").UseFetchModelReturn<{
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    score: number | null;
    testCaseId: number;
    partitionId: string;
    turnEvals: {
        id: number;
        createdAt: Date;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
    }[];
}>;
declare const useCreateTestRun: (params?: {
    ctx?: {
        branchId: number;
    } | undefined;
    headers?: Record<string, string>;
} | undefined) => {
    trigger: import("swr/mutation").TriggerWithOptionsArgs<{
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }, {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }, any, any>;
    data: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    } | undefined;
    error: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    } | undefined;
    isMutating: boolean;
};
declare const useUpdateTestRun: (params?: import("../hooks/modelHooks").UseMutateModelParams<{
    branchId: number;
    status: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    score: number | null;
    testCaseId: number;
    partitionId: string;
    turnEvals: {
        id: number;
        createdAt: Date;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
    }[];
}, {
    branchId: number;
    status: string;
    score: number | null;
    testCaseId: number;
    partitionId: string;
    turnEvals: {
        id: number;
        createdAt: Date;
        traceId: string | null;
        score: number | null;
        refTurnId: number | null;
        refTestRunId: number | null;
        evaluations: {
            evaluator: string;
            score: number | null;
            turnEvalId: number | null;
            metadata?: any;
        }[];
        testRunId: number;
    }[];
}, {
    branchId: number;
}> | undefined) => {
    trigger: import("swr/mutation").TriggerWithOptionsArgs<{
        branchId: number;
        status: string;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }, {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }, any, any>;
    data: {
        branchId: number;
        status: string;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    } | undefined;
    error: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    } | undefined;
    isMutating: boolean;
};
declare const useDeleteTestRun: (params?: {
    ctx?: {
        branchId: number;
    } | undefined;
    headers?: Record<string, string>;
} | undefined) => {
    trigger: import("swr/mutation").TriggerWithoutArgs<{
        id: number | string;
    }, any, any, never>;
    data: {
        id: number | string;
    } | undefined;
    error: any;
    isMutating: boolean;
};
declare const useTestCaseList: (params: import("../hooks/modelHooks").UseFetchModelListParams<{
    branchId: number;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    userId: string | null;
    testTurns: {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }[];
    testRuns: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }[];
}, {
    branchId: number;
}> & {
    defaultFilters?: import("./query-builder").DefaultFilter<{
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    }>[] | undefined;
}, hookConfig?: import("../hooks/modelHooks").InfiniteConfiguration<{
    branchId: number;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    userId: string | null;
    testTurns: {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }[];
    testRuns: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }[];
}> | undefined) => {
    items: {
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    }[];
    trigger: () => void;
    filters: import("./query-builder").DefaultFilter<{
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    } & Record<string, any>>[];
    where: <K extends string>(filter: [K, import("./query-builder").FilterOperators<({
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    } & Record<string, any>)[K]>, ({
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    } & Record<string, any>)[K]]) => void;
    build: () => string;
    reset: () => void;
    queryString: string;
    size: number;
    setSize: (size: number | ((_size: number) => number)) => Promise<{
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    }[][] | undefined>;
    mutate: import("swr/infinite").SWRInfiniteKeyedMutator<{
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    }[][]>;
    error: any;
    data: {
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    }[][] | undefined;
    isLoading: import("swr/_internal").IsLoadingResponse<Data, Config>;
    isValidating: boolean;
};
declare const useTestCase: (params: Partial<import("../hooks/modelHooks").UseFetchModelParams<{
    id: number;
    branchId: number;
}>>, hookConfig?: import("../hooks/modelHooks").SingleConfiguration<{
    branchId: number;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    userId: string | null;
    testTurns: {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }[];
    testRuns: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }[];
}> | undefined) => import("../hooks/modelHooks").UseFetchModelReturn<{
    branchId: number;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    userId: string | null;
    testTurns: {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }[];
    testRuns: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }[];
}>;
declare const useCreateTestCase: (params?: {
    ctx?: {
        branchId: number;
    } | undefined;
    headers?: Record<string, string>;
} | undefined) => {
    trigger: import("swr/mutation").TriggerWithOptionsArgs<{
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    }, {
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    }, any, any>;
    data: {
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    } | undefined;
    error: {
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    } | undefined;
    isMutating: boolean;
};
declare const useUpdateTestCase: (params?: import("../hooks/modelHooks").UseMutateModelParams<{
    branchId: number;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    userId: string | null;
    testTurns: {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }[];
    testRuns: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    }[];
}, {
    branchId: number;
    title: string;
    description: string | null;
    userId: string | null;
    testTurns: {
        evaluators: {
            name: string;
            metadata?: any;
        }[];
    }[];
}, {
    branchId: number;
}> | undefined) => {
    trigger: import("swr/mutation").TriggerWithOptionsArgs<{
        branchId: number;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
    }, {
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    }, any, any>;
    data: {
        branchId: number;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
    } | undefined;
    error: {
        branchId: number;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        userId: string | null;
        testTurns: {
            evaluators: {
                name: string;
                metadata?: any;
            }[];
        }[];
        testRuns: {
            branchId: number;
            status: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            testCaseId: number;
            partitionId: string;
            turnEvals: {
                id: number;
                createdAt: Date;
                traceId: string | null;
                score: number | null;
                refTurnId: number | null;
                refTestRunId: number | null;
                evaluations: {
                    evaluator: string;
                    score: number | null;
                    turnEvalId: number | null;
                    metadata?: any;
                }[];
                testRunId: number;
            }[];
        }[];
    } | undefined;
    isMutating: boolean;
};
declare const useDeleteTestCase: (params?: {
    ctx?: {
        branchId: number;
    } | undefined;
    headers?: Record<string, string>;
} | undefined) => {
    trigger: import("swr/mutation").TriggerWithoutArgs<{
        id: number | string;
    }, any, any, never>;
    data: {
        id: number | string;
    } | undefined;
    error: any;
    isMutating: boolean;
};
declare const useRunTestCase: (params?: {
    ctx?: {
        branchId: number;
    } | undefined;
    headers?: Record<string, string>;
} | undefined) => {
    trigger: (payload: {
        testCaseId: number;
    }) => void;
    data: {
        testCaseId: number;
    } | undefined;
    error: {
        branchId: number;
        status: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        testCaseId: number;
        partitionId: string;
        turnEvals: {
            id: number;
            createdAt: Date;
            traceId: string | null;
            score: number | null;
            refTurnId: number | null;
            refTestRunId: number | null;
            evaluations: {
                evaluator: string;
                score: number | null;
                turnEvalId: number | null;
                metadata?: any;
            }[];
            testRunId: number;
        }[];
    } | undefined;
    isMutating: boolean;
};
export { TurnEvalSchema, TurnEvalPayloadSchema, TestRunSchema, TestRunPayloadSchema, TestCaseSchema, TestCasePayloadSchema, TurnEvaluatorSchema, EvaluatorConfigSchema, useTestRunList, useTestRun, useCreateTestRun, useUpdateTestRun, useDeleteTestRun, useTestCaseList, useTestCase, useCreateTestCase, useUpdateTestCase, useDeleteTestCase, useRunTestCase, };
//# sourceMappingURL=testService.d.ts.map