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


export const BlockChunkSchema = z.object({
    Type: z.string(),
    // path: z.array(z.number()),
    index: z.number(),
    content: z.string(),
    logprob: z.number().optional().nullable(),    
  });
  
export const BlockSentSchema = z.object({
    Type: z.literal("BlockSent"),
    index: z.number().optional().nullable(),
    path: z.array(z.number()),
    content: z.string().nullable().optional(),
    children: z.array(BlockChunkSchema).optional(),
});
  
  // Forward declare with z.lazy
export const BlockSchema: z.ZodType<any> = z.lazy(() =>
z.object({
    Type: z.literal("Block"),
    path: z.array(z.number()).optional(),
    tags: z.array(z.string()).optional(),
    content: BlockSentSchema,
    // children: z.array(z.union([BlockSchema, BlockSentSchema])),
    children: z.array(BlockSchema),
    postfix: BlockSentSchema.optional().nullable(),
    role: z.string().nullable().optional(),
    styles: z.array(z.string()).optional(),    
    attrs: z.record(z.any()).optional(),
    
    
    id: z.string().nullable().optional(),
})
);
  
export const BlockListSchema: z.ZodType<any> = z.lazy(() =>
z.object({
    Type: z.literal("BlockList").optional(),
    index: z.number().optional(),
    children: z.array(
    z.union([BlockSchema, BlockSentSchema, BlockChunkSchema])
    ),
    defaultSep: z.string().optional(),
    })
);


export const LogSchema = z.object({
    id: z.number(),
    createdAt: z.preprocess(
        (val) => typeof val === "string" ? new Date(val) : val,
        z.date()
    ),
    message: z.string(),
    level: z.enum(["info", "warning", "error"]),
})


export const SpanEventSchema: z.ZodType<any> = z.lazy(() =>
z.object({
    id: z.number(),
    eventType: z.enum(["block", "span", "log", "model", "stream"]),
    data: z.union([SpanSchema, BlockSchema, LogSchema]).nullable().optional(),
    index: z.number(),
})
);


export const SpanSchema: z.ZodType<any> = z.object({
    id: z.string(),
    name: z.string(),
    parentSpanId: z.string().nullable().optional(),
    turnId: z.number(),
    branchId: z.number(),
    startTime: z.any(),
    endTime: z.any(),
    tags: z.array(z.string()).optional().nullable(),
    metadata: z.any().nullable().optional(),
    status: z.enum(["running", "completed", "failed"]),
    events: z.array(SpanEventSchema),
})




const TurnPayloadSchema = z.object({
    index: z.number(),
    status: z.string(),
    message: z.string().nullable().optional(),    
    traceId: z.string().nullable().optional(),
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
    // spans: z.array(SpanSchema).optional().nullable(),
    span: SpanSchema.nullable(),
})








export type BlockType = z.infer<typeof BlockSchema>
export type BlockListType = z.infer<typeof BlockListSchema>
export type BlockSentType = z.infer<typeof BlockSentSchema>
export type BlockChunkType = z.infer<typeof BlockChunkSchema>

export type SpanType = z.infer<typeof SpanSchema>
export type SpanEventSchema = z.infer<typeof SpanEventSchema>
export type LogSchema = z.infer<typeof LogSchema>
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