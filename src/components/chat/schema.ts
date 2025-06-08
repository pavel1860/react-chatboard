import { z } from "zod";



export interface ToolCall {
    id: string;
    name: string;
    tool: any;
    extra: any;
}



export const TurnCtxSchema = z.object({
    branchId: z.number(),
    turnId: z.number(),
})




const BranchPayloadSchema = z.object({
    name: z.string(),
    forkedFromIndex: z.number(),
    forkedFromTurnId: z.number(),
    frokedFromBranchId: z.number(),
    currentIndex: z.number(),    
})


const BranchSchema = z.object({
    id: z.number(),
    createdAt: z.preprocess(
        (val) => typeof val === "string" ? new Date(val) : val,
        z.date()
    ),
    updatedAt: z.preprocess(
        (val) => typeof val === "string" ? new Date(val) : val,
        z.date()
    ),
    ...BranchPayloadSchema.shape,
})




const TurnPayloadSchema = z.object({
    index: z.number(),
    status: z.string(),
    message: z.string().nullable(),    
    traceId: z.string().nullable(),
    branchId: z.number(),
})

const TurnSchema = z.object({
    id: z.number(),
    createdAt: z.preprocess(
        (val) => typeof val === "string" ? new Date(val) : val,
        z.date()
    ),
    endedAt: z.preprocess(
        (val) => typeof val === "string" ? new Date(val) : val,
        z.date()
    ).nullable(),
    ...TurnPayloadSchema.shape,
    forkedBranches: z.array(z.number()),
})









export type TurnType = z.infer<typeof TurnSchema>
export type TurnPayloadType = z.infer<typeof TurnPayloadSchema>

export type BranchType = z.infer<typeof BranchSchema>
export type BranchPayloadType = z.infer<typeof BranchPayloadSchema>




export {
    TurnSchema,
    TurnPayloadSchema,
    BranchSchema,
    BranchPayloadSchema,
}