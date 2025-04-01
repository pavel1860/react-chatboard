import { create } from "zustand";
import { AdminLayoutSliceType, createAdminLayoutSlice } from "../state/slices/layout-slice";
import { useStore } from 'zustand';



export type LayoutStoreType = AdminLayoutSliceType


export const useBoundStore = create<LayoutStoreType>((...a) => ({
    ...createAdminLayoutSlice(...a),
}))





export const useSideView = () => {
    const sideView = useBoundStore((state) => state.sideView)
    const setSideView = useBoundStore((state) => state.setSideView)
    const traceId = useBoundStore((state) => state.traceId)
    const setTraceId = useBoundStore((state) => state.setTraceId)

    return { sideView, setSideView, traceId, setTraceId }
}

export const useViews = () => {
    const leftFlex = useBoundStore((state) => state.leftFlex)
    const setLeftFlex = useBoundStore((state) => state.setLeftFlex)
    const rightFlex = useBoundStore((state) => state.rightFlex)
    const setRightFlex = useBoundStore((state) => state.setRightFlex)
    return { leftFlex, setLeftFlex, rightFlex, setRightFlex }
}