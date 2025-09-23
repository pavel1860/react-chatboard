import { z } from "zod";
export interface ToolCall {
    id: string;
    name: string;
    tool: any;
    extra: any;
}
export declare const TurnCtxSchema: z.ZodObject<{
    branchId: z.ZodNumber;
    turnId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    branchId: number;
    turnId: number;
}, {
    branchId: number;
    turnId: number;
}>;
declare const BranchPayloadSchema: z.ZodObject<{
    name: z.ZodString;
    forkedFromIndex: z.ZodNumber;
    forkedFromTurnId: z.ZodNumber;
    frokedFromBranchId: z.ZodNumber;
    currentIndex: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    forkedFromIndex: number;
    forkedFromTurnId: number;
    frokedFromBranchId: number;
    currentIndex: number;
}, {
    name: string;
    forkedFromIndex: number;
    forkedFromTurnId: number;
    frokedFromBranchId: number;
    currentIndex: number;
}>;
declare const BranchSchema: z.ZodObject<{
    name: z.ZodString;
    forkedFromIndex: z.ZodNumber;
    forkedFromTurnId: z.ZodNumber;
    frokedFromBranchId: z.ZodNumber;
    currentIndex: z.ZodNumber;
    id: z.ZodNumber;
    createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
    updatedAt: z.ZodEffects<z.ZodDate, Date, unknown>;
}, "strip", z.ZodTypeAny, {
    name: string;
    forkedFromIndex: number;
    forkedFromTurnId: number;
    frokedFromBranchId: number;
    currentIndex: number;
    id: number;
    createdAt: Date;
    updatedAt: Date;
}, {
    name: string;
    forkedFromIndex: number;
    forkedFromTurnId: number;
    frokedFromBranchId: number;
    currentIndex: number;
    id: number;
    createdAt?: unknown;
    updatedAt?: unknown;
}>;
export declare const BlockChunkSchema: z.ZodObject<{
    Type: z.ZodString;
    index: z.ZodNumber;
    content: z.ZodString;
    logprob: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    Type: string;
    index: number;
    content: string;
    logprob?: number | null | undefined;
}, {
    Type: string;
    index: number;
    content: string;
    logprob?: number | null | undefined;
}>;
export declare const BlockSentSchema: z.ZodObject<{
    Type: z.ZodLiteral<"BlockSent">;
    index: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    path: z.ZodArray<z.ZodNumber, "many">;
    content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    children: z.ZodOptional<z.ZodArray<z.ZodObject<{
        Type: z.ZodString;
        index: z.ZodNumber;
        content: z.ZodString;
        logprob: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        Type: string;
        index: number;
        content: string;
        logprob?: number | null | undefined;
    }, {
        Type: string;
        index: number;
        content: string;
        logprob?: number | null | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    path: number[];
    Type: "BlockSent";
    index?: number | null | undefined;
    content?: string | null | undefined;
    children?: {
        Type: string;
        index: number;
        content: string;
        logprob?: number | null | undefined;
    }[] | undefined;
}, {
    path: number[];
    Type: "BlockSent";
    index?: number | null | undefined;
    content?: string | null | undefined;
    children?: {
        Type: string;
        index: number;
        content: string;
        logprob?: number | null | undefined;
    }[] | undefined;
}>;
export declare const BlockSchema: z.ZodType<any>;
export declare const BlockListSchema: z.ZodType<any>;
export declare const LogSchema: z.ZodObject<{
    id: z.ZodNumber;
    createdAt: z.ZodEffects<z.ZodDate, Date, unknown>;
    message: z.ZodString;
    level: z.ZodEnum<["info", "warning", "error"]>;
}, "strip", z.ZodTypeAny, {
    message: string;
    id: number;
    createdAt: Date;
    level: "info" | "warning" | "error";
}, {
    message: string;
    id: number;
    level: "info" | "warning" | "error";
    createdAt?: unknown;
}>;
export declare const SpanEventSchema: z.ZodType<any>;
export declare const SpanSchema: z.ZodType<any>;
declare const TurnPayloadSchema: z.ZodObject<{
    index: z.ZodNumber;
    status: z.ZodString;
    message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    traceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    branchId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    branchId: number;
    status: string;
    index: number;
    message?: string | null | undefined;
    traceId?: string | null | undefined;
}, {
    branchId: number;
    status: string;
    index: number;
    message?: string | null | undefined;
    traceId?: string | null | undefined;
}>;
declare const TurnSchema: z.ZodObject<{
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
}>;
export type BlockType = z.infer<typeof BlockSchema>;
export type BlockListType = z.infer<typeof BlockListSchema>;
export type BlockSentType = z.infer<typeof BlockSentSchema>;
export type BlockChunkType = z.infer<typeof BlockChunkSchema>;
export type SpanType = z.infer<typeof SpanSchema>;
export type SpanEventSchema = z.infer<typeof SpanEventSchema>;
export type LogSchema = z.infer<typeof LogSchema>;
export type TurnType = z.infer<typeof TurnSchema>;
export type TurnPayloadType = z.infer<typeof TurnPayloadSchema>;
export type BranchType = z.infer<typeof BranchSchema>;
export type BranchPayloadType = z.infer<typeof BranchPayloadSchema>;
export { TurnSchema, TurnPayloadSchema, BranchSchema, BranchPayloadSchema, };
//# sourceMappingURL=schema.d.ts.map