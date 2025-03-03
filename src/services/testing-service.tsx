import createModelService from "./model-service";
import {useMutationHook} from './mutation'
import { z } from 'zod';





export const EvaluatorBaseSchema = z.object({
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
    ModelArtifactSchema: EvaluatorSchema,
    useGetModelList: useGetEvaluatorList,
    useGetModel: useGetEvaluator,
    useCreateModel: useCreateEvaluator,
    useUpdateModel: useUpdateEvaluator,
    useDeleteModel: useDeleteEvaluator,
} = createModelService("Evaluator", EvaluatorBaseSchema, { isArtifact: false, baseUrl: "/api/ai/evaluators" })

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
    ModelArtifactSchema: TestCaseSchema,
    useGetModelList: useGetTestCaseList,
    useGetModel: useGetTestCase,
    useCreateModel: useCreateTestCase,
    useUpdateModel: useUpdateTestCase,
    useDeleteModel: useDeleteTestCase,
} = createModelService("TestCase", TestCaseBaseSchema, { isArtifact: false, isHead: true, baseUrl: "/api/ai/testing" })

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
    
    const { trigger: runTestCase, isMutating: isRunningTestCase, error: runTestCaseError } = useMutationHook({ endpoint: `/api/ai/testing/TestCase/run`})
    
    return {
        runTestCase,
        isRunningTestCase,
        runTestCaseError,
    }
}