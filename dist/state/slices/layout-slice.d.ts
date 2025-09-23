export type SideViewType = "version-tree" | "test-case" | "tracer-view" | "artifact-view";
export type AdminLayoutSliceType = {
    sideView: SideViewType | null;
    setSideView: (sideView: SideViewType) => void;
    traceId: string | null;
    setTraceId: (traceId: string) => void;
    leftFlex: number;
    setLeftFlex: (leftFlex: number) => void;
    rightFlex: number;
    setRightFlex: (rightFlex: number) => void;
};
export declare const createAdminLayoutSlice: (set: any, get: any) => {
    sideView: string;
    setSideView: (sideView: SideViewType) => any;
    traceId: null;
    setTraceId: (traceId: string) => any;
    leftFlex: number;
    setLeftFlex: (leftFlex: number) => any;
    rightFlex: number;
    setRightFlex: (rightFlex: number) => any;
};
//# sourceMappingURL=layout-slice.d.ts.map