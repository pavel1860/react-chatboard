import { z } from "zod";
export interface ModelContext {
    [key: string]: string | number | undefined;
}
export declare const ModelContextSchema: z.ZodObject<{
    branchId: z.ZodNumber;
    turnId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    branchId: number;
    turnId: number;
}, {
    branchId: number;
    turnId: number;
}>;
export type ModelContextType = z.infer<typeof ModelContextSchema>;
export declare function camelToSnake(str: string): string;
export declare function convertKeysToSnakeCase(obj: any): any;
export declare function snakeToCamel(str: string): string;
export declare function convertKeysToCamelCase(obj: any): any;
export declare function buildModelContextHeaders<Ctx>(ctx?: Ctx, contentType?: 'json' | 'form'): Record<string, string>;
//# sourceMappingURL=model-context.d.ts.map