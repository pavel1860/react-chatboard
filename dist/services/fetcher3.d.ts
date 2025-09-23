import { ZodTypeAny } from "zod";
export interface ApiError {
    status: number;
    message: string;
    details?: unknown;
}
export interface FetcherOptions<Ctx, Params, Model> {
    schema: ZodTypeAny;
    params?: Params extends Record<string, unknown> ? Record<string, unknown> : never;
    headers?: Record<string, string>;
    ctx: Ctx;
}
export declare function fetcher<Ctx, Params, Model>(endpoint: string, { schema, params, ctx, headers }: FetcherOptions<Ctx, Params, Model>): Promise<Model>;
//# sourceMappingURL=fetcher3.d.ts.map