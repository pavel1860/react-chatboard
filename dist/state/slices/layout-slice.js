export const createAdminLayoutSlice = (set, get) => ({
    sideView: "artifact-view",
    setSideView: (sideView) => set({ sideView }),
    traceId: null,
    setTraceId: (traceId) => set({ traceId }),
    leftFlex: 1,
    setLeftFlex: (leftFlex) => set({ leftFlex }),
    rightFlex: 1,
    setRightFlex: (rightFlex) => set({ rightFlex }),
});
//# sourceMappingURL=layout-slice.js.map