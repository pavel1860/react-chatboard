


export type SideViewType = "version-tree" | "test-case" | "tracer-view" | "artifact-view"


export type AdminLayoutSliceType = {
    sideView: SideViewType | null
    setSideView: (sideView: SideViewType) => void
    traceId: string | null
    setTraceId: (traceId: string) => void
    leftFlex: number
    setLeftFlex: (leftFlex: number) => void
    rightFlex: number
    setRightFlex: (rightFlex: number) => void
}



export const createAdminLayoutSlice = (set: any, get: any) => ({
        sideView: "artifact-view",
        setSideView: (sideView: SideViewType) => set({ sideView }),
        traceId: null,
        setTraceId: (traceId: string) => set({ traceId }),
        leftFlex: 1,
        setLeftFlex: (leftFlex: number) => set({ leftFlex }),
        rightFlex: 1,
        setRightFlex: (rightFlex: number) => set({ rightFlex }),
    })



