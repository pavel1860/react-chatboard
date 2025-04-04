import createHeadModelService from "./head-model-service";
import createModelService from "../model/services/model-service";
import {useMutationHook} from './mutation'
import { z } from 'zod';





export const EvaluatorSchema = z.object({
    id: z.number(),
    name: z.string(),
    task: z.string(),
    rules: z.array(z.string()).default([]),
    model: z.string(),
    databaseType: z.literal("postgres").optional(),
});






export const TestTurnSchema = z.object({
    input: z.string(),
    output: z.string(),
    // evaluators: z.array(z.string()),
})

// export type TestTurnType = z.infer<typeof TestTurnSchema>;





// export type TestCaseType = z.infer<typeof TestCaseSchema>;





const {
    useModelList: useGetEvaluatorList,
    useModel: useGetEvaluator,
    useCreateModel: useCreateEvaluator,
    useUpdateModel: useUpdateEvaluator,
    useDeleteModel: useDeleteEvaluator,
} = createModelService("Evaluator", EvaluatorSchema, { baseUrl: "/api/ai/evaluators" })

export {
    useGetEvaluatorList,
    useGetEvaluator,
    useCreateEvaluator,
    useUpdateEvaluator,
    useDeleteEvaluator,
}


export type EvaluatorType = z.infer<typeof EvaluatorSchema>;



export const TestCaseBaseSchema = z.object({
    title: z.string(),
    description: z.string(),
    input_turns: z.array(TestTurnSchema),
})



const {
    HeadModelSchema: TestCaseSchema,
    useHeadModelList: useGetTestCaseList,
    useHeadModel: useGetTestCase,
    useCreateHeadModel: useCreateTestCase,
    useUpdateHeadModel: useUpdateTestCase,
    useDeleteHeadModel: useDeleteTestCase,
} = createHeadModelService("TestCase", TestCaseBaseSchema, { baseUrl: "/api/ai/testing" })

export type TestCaseType = z.infer<typeof TestCaseSchema>;

export {
    TestCaseSchema,
    useGetTestCaseList,
    useGetTestCase,
    useCreateTestCase,
    useUpdateTestCase,
    useDeleteTestCase,
}



export const useRunTestCase = () => {
    
    const { 
        trigger: runTestCase, 
        isMutating: isRunningTestCase, 
        error: runTestCaseError
    } = useMutationHook({ 
        // endpoint: `/api/ai/testing/TestCase/run`
        endpoint: `/api/ai/testing/run`
    })
    
    return {
        runTestCase,
        isRunningTestCase,
        runTestCaseError,
    }
}


export const EvalResultSchema = z.object({
    reasoning: z.string(),
    score: z.number(),
})

export const TurnResultSchema = z.object({
    output: z.string(),
    evaluations: z.array(EvalResultSchema),
    score: z.number(),
})


export const TestRunBaseSchema = z.object({
    message: z.string(),
    results: z.array(TurnResultSchema),
    final_score: z.number(),
    status: z.enum(["started", "success", "failure"]),
    test_case_id: z.number(),
})


export type TestRunType = z.infer<typeof TestRunSchema>;

const {
    HeadModelSchema: TestRunSchema,
    useHeadModelList: useTestRunList,
    useHeadModel: useTestRun,
    useCreateHeadModel: useCreateTestRun,
    useUpdateHeadModel: useUpdateTestRun,
    useDeleteHeadModel: useDeleteTestRun,
} = createHeadModelService("TestRun", TestRunBaseSchema, { baseUrl: "/api/ai/testing" })


export {
    TestRunSchema,
    useTestRunList,
    useTestRun,
    useCreateTestRun,
    useUpdateTestRun,
    useDeleteTestRun,
}

