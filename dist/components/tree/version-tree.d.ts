interface VersionTreeProps {
    partitionId: string;
    branchId: number;
    setBranchId: (branchId: number) => void;
    setTraceId: (traceId: string) => void;
    refetchChat?: () => void;
}
declare function VersionTree({ partitionId, branchId, setBranchId, setTraceId, refetchChat }: VersionTreeProps): import("react/jsx-runtime").JSX.Element;
export default VersionTree;
//# sourceMappingURL=version-tree.d.ts.map