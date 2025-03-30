


export type SideViewType = "version-tree" | "test-case" | "tracer-view" | "artifact-view"


export type AdminLayoutSliceType = {
    sideView: SideViewType | null
    setSideView: (sideView: SideViewType) => void
    traceId: string | null
    setTraceId: (traceId: string) => void
}



export const createAdminLayoutSlice = (set: any, get: any) => ({
        sideView: "artifact-view",
        setSideView: (sideView: SideViewType) => set({ sideView }),
        traceId: null,
        setTraceId: (traceId: string) => set({ traceId }),
    })



