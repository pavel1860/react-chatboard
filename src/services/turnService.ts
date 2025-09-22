import { 
    TurnCtxSchema, 
    TurnSchema as BaseTurnSchema,
    TurnPayloadSchema as BaseTurnPayloadSchema,
    BranchSchema,
    BranchPayloadSchema,
} from "../components/chat/schema";
import { createUseFetchModelListInfiniteHook, createUseMutationHook } from "../hooks/modelHooks";
import { z } from "zod";





export const ChoiceSchema = z.object({
    label: z.string().nullable(),
    content: z.string()
})

export const ChoiceListSchema = z.object({
    task: z.string().nullable(),
    choices: z.array(ChoiceSchema)
})

export const MessagePayloadSchema = z.object({
    content: z.string(),
    choices: ChoiceListSchema.nullable(),
    state: z.any(),
    role: z.enum(["user", "assistant", "tool"]),
    toolCalls: z.array(z.any()),
    runId: z.string().optional().nullable(),
})


export const MessageSchema = z.object({
    id: z.number(),
    ...TurnCtxSchema.shape,
    ...MessagePayloadSchema.shape,
    partitionId: z.string().optional().nullable(),
    meta: z.any().optional().nullable(),
})










const TurnPayloadSchema = z.object({
    ...BaseTurnPayloadSchema.shape,
    partitionId: z.string(),
})

const TurnSchema = z.object({
    ...BaseTurnSchema.shape,
    messages: z.array(MessageSchema).optional().nullable(),
})





export type ChoiceType = z.infer<typeof ChoiceSchema>
export type ChoiceListType = z.infer<typeof ChoiceListSchema>
export type MessagePayloadType = z.infer<typeof MessagePayloadSchema>
export type MessageType = z.infer<typeof MessageSchema>



export type TurnType = z.infer<typeof TurnSchema>
export type TurnPayloadType = z.infer<typeof TurnPayloadSchema>

export type BranchType = z.infer<typeof BranchSchema>
export type BranchPayloadType = z.infer<typeof BranchPayloadSchema>






const useTurnList = createUseFetchModelListInfiniteHook({
    url: "/api/ai/model/Turn/list",
    schema: TurnSchema
})


const useVersionTurnList = createUseFetchModelListInfiniteHook<TurnType, { branchId: number }>({
    url: "/api/ai/model/Turn/version_list",
    schema: TurnSchema
})

export {
    useTurnList,
    useVersionTurnList
}




const useTurnApproval = createUseMutationHook({
    url: "/api/ai/model/Turn/approval",
    method: "PUT",
    payloadSchema: z.object({
        id: z.number(),
        status: z.enum(["committed", "reverted"])
    }),
    schema: TurnSchema
})



const useTurnMessages = createUseFetchModelListInfiniteHook<TurnType, { branchId: number, partitionId: string }>({
    url: "/api/ai/model/Turn/messages",
    schema: TurnSchema
})


const useTurnBlocks = createUseFetchModelListInfiniteHook<TurnType, { branchId: number, partitionId: string }>({
    url: "/api/ai/model/Turn/spans",
    schema: TurnSchema
})


export {
    useTurnMessages,
    useTurnApproval,
    useTurnBlocks
}