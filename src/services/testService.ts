import { TurnSchema } from "../components/chat/schema";
import { createUseFetchModelHook, createUseFetchModelListInfiniteHook, createUseMutationHook } from "../hooks/modelHooks";
import { createUseCreateModelHook } from "../hooks/modelHooks";
import { createUseUpdateModelHook } from "../hooks/modelHooks";
import { createUseDeleteModelHook } from "../hooks/modelHooks";
import { z } from "zod";



const EvaluationSchema = z.object({
    evaluator: z.string(),
    metadata: z.any().nullable(),
    score: z.number().nullable(),
    turnEvalId: z.number().nullable(),
})

const TurnEvalPayloadSchema = z.object({    
    refTurnId: z.number().nullable(),
    refTestRunId: z.number().nullable(),
    score: z.number().nullable(),
    traceId: z.string().nullable(),
    evaluations: z.array(EvaluationSchema),
})


const TurnEvalSchema = z.object({
    id: z.number(),
    createdAt: z.preprocess(
        (val) => typeof val === "string" ? new Date(val) : val,
        z.date()
    ),
    ...TurnEvalPayloadSchema.shape,
    testRunId: z.number(),
})


const TestRunPayloadSchema = z.object({
    testCaseId: z.number(),
    branchId: z.number(),
    // turnId: z.number(),
    partitionId: z.string(),
    status: z.string(),
    score: z.number().nullable(),
    turnEvals: z.array(TurnEvalSchema),
})

const TestRunSchema = z.object({
    id: z.number(),
    createdAt: z.preprocess(
        (val) => typeof val === "string" ? new Date(val) : val,
        z.date()
    ),
    updatedAt: z.preprocess(
        (val) => typeof val === "string" ? new Date(val) : val,
        z.date()
    ),
    ...TestRunPayloadSchema.shape,

})


// const EvaluatorSchema = z.object({
//     name: z.string(),
//     parameters: z.any(),
// })

// const InputTurnSchema = z.object({
//     input: z.string(),
//     expected: z.array(z.string()),
//     evaluators: z.array(EvaluatorSchema),
// })



const EvaluatorConfigSchema = z.object({
    name: z.string(),
    metadata: z.any(),
})

const TurnEvaluatorSchema = z.object({
    turnId: z.number(),
    evaluators: z.array(EvaluatorConfigSchema),
})


const TestTurnSchema = z.object({
    // turn: TurnSchema,
    evaluators: z.array(EvaluatorConfigSchema),
})

const TestCasePayloadSchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    branchId: z.number(),
    // partitionId: z.string(),
    userId: z.string().nullable(),
    testTurns: z.array(TestTurnSchema),
})


const TestCaseSchema = z.object({
    id: z.number(),
    createdAt: z.preprocess(
        (val) => typeof val === "string" ? new Date(val) : val,
        z.date()
    ),
    updatedAt: z.preprocess(
        (val) => typeof val === "string" ? new Date(val) : val,
        z.date()
    ),
    ...TestCasePayloadSchema.shape,
    testRuns: z.array(TestRunSchema),
    // turns: z.array(TurnSchema),
})

export type EvaluationType = z.infer<typeof EvaluationSchema>
export type TurnEvalType = z.infer<typeof TurnEvalSchema>
export type EvaluatorConfigType = z.infer<typeof EvaluatorConfigSchema>
export type TurnEvaluatorType = z.infer<typeof TurnEvaluatorSchema>
export type TestRunType = z.infer<typeof TestRunSchema>
export type TestRunPayloadType = z.infer<typeof TestRunPayloadSchema>
export type TestCaseType = z.infer<typeof TestCaseSchema>
export type TestCasePayloadType = z.infer<typeof TestCasePayloadSchema>




// const useTestRunList = createUseFetchModelListInfiniteHook<TestRunType, { branchId: number }>({
//     url: "/api/ai/model/TestRun/list",
//     schema: TestRunSchema
// })


const useTestRunList = createUseFetchModelListInfiniteHook<TestRunType, { branchId: number }>({
    url: "/api/ai/model/TestRun/list",
    schema: TestRunSchema
})

const useTestRun = createUseFetchModelHook<TestRunType, { branchId: number }>({
    url: "/api/ai/model/TestRun/run_with_evals",
    schema: TestRunSchema
})

const useCreateTestRun = createUseCreateModelHook<TestRunType, TestRunPayloadType, { branchId: number }>({
    url: "/api/ai/model/TestRun/create",
    schema: TestRunSchema
})


const useUpdateTestRun = createUseUpdateModelHook<TestRunType, TestRunPayloadType, { branchId: number }>({
    url: "/api/ai/model/TestRun/update",
    schema: TestRunSchema
})


const useDeleteTestRun = createUseDeleteModelHook<{ branchId: number }>({
    url: "/api/ai/model/TestRun/delete",
    // @ts-ignore
    schema: TestRunSchema
})


const useTestCaseList = createUseFetchModelListInfiniteHook<TestCaseType, { branchId: number }>({
    // url: "/api/ai/model/TestCase/list",
    url: "/api/ai/model/TestCase/list_with_runs",
    schema: TestCaseSchema
})



const useTestCase = createUseFetchModelHook<TestCaseType, { id: number, branchId: number }>({
    url: "/api/ai/model/TestCase/record",
    schema: TestCaseSchema
})


const useCreateTestCase = createUseCreateModelHook<TestCaseType, TestCasePayloadType, { branchId: number }>({
    url: "/api/ai/model/TestCase/create",
    schema: TestCaseSchema
})


const useUpdateTestCase = createUseUpdateModelHook<TestCaseType, TestCasePayloadType, { branchId: number }>({
    url: "/api/ai/model/TestCase/update",
    schema: TestCaseSchema
})


const useDeleteTestCase = createUseDeleteModelHook<{ branchId: number }>({
    url: "/api/ai/model/TestCase/delete",
    // @ts-ignore
    schema: TestCaseSchema
})


const RunTestCasePayloadSchema = z.object({
    testCaseId: z.number(),    
})


type RunTestCasePayloadType = z.infer<typeof RunTestCasePayloadSchema>

const useRunTestCase = createUseMutationHook<RunTestCasePayloadType, TestRunType, { branchId: number }>({
    url: "/api/ai/run_test",
    method: "POST",
    schema: TestRunSchema,
    payloadSchema: RunTestCasePayloadSchema,    
})







export {
    TurnEvalSchema,
    TurnEvalPayloadSchema,
    TestRunSchema,
    TestRunPayloadSchema,
    TestCaseSchema,
    TestCasePayloadSchema,
    TurnEvaluatorSchema,
    EvaluatorConfigSchema,
    useTestRunList,
    useTestRun,
    useCreateTestRun,
    useUpdateTestRun,
    useDeleteTestRun,
    useTestCaseList,
    useTestCase,
    useCreateTestCase,
    useUpdateTestCase,
    useDeleteTestCase,
    useRunTestCase,
}   