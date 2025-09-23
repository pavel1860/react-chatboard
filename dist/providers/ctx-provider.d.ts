export type AdminCtx = {
    branchId: number;
    partitionId?: string;
    refUserId?: string;
};
export type Ctx = {
    branchId: number;
    partitionId?: string;
    refUserId?: string;
};
export declare const useCtxUrlParams: () => {
    branchId: number | undefined;
    partitionId: string | string[] | undefined;
    userId: string | string[] | undefined;
    propertyId: string | string[] | undefined;
};
export declare const useAdminUrlParams: () => {
    partitionId: string | string[] | null;
    branchId: number | null;
    refUserId: string | string[] | null;
    traceId: string | string[] | null;
    testCaseId: number | null;
    testRunId: number | null;
};
export declare function useSyncUrlParams(): void;
interface CtxProviderProps {
    children: React.ReactNode;
}
declare const CtxProvider: ({ children }: CtxProviderProps) => import("react/jsx-runtime").JSX.Element;
declare const useAdminCtx: () => {
    setBranchId: (id: number | null) => void;
    setRefUserId: (id: string | null) => void;
    setConversationId: (partitionId: string) => void;
    refUserId: string | undefined;
    partitionId: string | undefined;
    isUserListOpen: boolean;
    setIsUserListOpen: (isUserListOpen: boolean) => void;
    branchId: number;
};
declare const useCtx: () => {
    setBranchId: (id: number | null) => void;
    setConversationId: (partitionId: string) => void;
    partitionId: string | undefined;
    branchId: number;
    refUserId?: string;
};
export { CtxProvider, useCtx, useAdminCtx, };
//# sourceMappingURL=ctx-provider.d.ts.map