import { AnyZodObject } from "zod";
export interface VersionEnv {
    headId?: number | null;
    branchId?: number | null;
    turnId?: number | null;
    partitionId?: string | null;
}
export interface FetcherOptions<T extends AnyZodObject> {
    schema: T;
    endpoint: string;
    queryParams?: Record<string, any>;
    env?: VersionEnv;
}
export declare function fetcher<T extends AnyZodObject>({ schema, endpoint, queryParams, env }: FetcherOptions<T>): Promise<T | null>;
export declare function fetcherWithHeaders(headers: any): (url: string) => Promise<any>;
//# sourceMappingURL=fetcher2.d.ts.map