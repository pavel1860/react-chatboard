import { RunTreeContext } from "../types/run-tree";
export declare function fetcher(endpoint: string, data: any): Promise<any>;
export declare function useGetRuns(limit: number, offset: number, runNames: string[]): any;
export declare function useGetTree(id: string | null): {
    runTree: RunTreeContext | null;
    error: any;
    loading: boolean;
};
export declare function useTrace(run_id: string): {
    data: any;
    error: any;
    isLoading: boolean;
};
//# sourceMappingURL=traces-service.d.ts.map