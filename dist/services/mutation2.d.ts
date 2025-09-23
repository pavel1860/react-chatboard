import { ZodSchema } from "zod";
import { SWRMutationResponse } from "swr/mutation";
interface MutationOptions<Ctx, Data> {
    ctx: Ctx;
    schema?: ZodSchema<Data>;
    method?: string;
}
export declare function sendRequest<Ctx, Params, Data>(endpoint: string, data: Params, { schema, ctx, method }: MutationOptions<Ctx, Data>): Promise<Data>;
interface UseMutationOptions<Data, Ctx> {
    ctx: Ctx;
    schema?: ZodSchema<Data>;
    method?: string;
    callbacks?: {
        onSuccess?: (data: Data) => void;
        onError?: (error: any) => void;
    };
}
export declare function useMutationHook<Ctx, Params, Data>(endpoint: string, { schema, callbacks, ctx, method }: UseMutationOptions<Data, Ctx>): SWRMutationResponse<Data, Error>;
export {};
//# sourceMappingURL=mutation2.d.ts.map