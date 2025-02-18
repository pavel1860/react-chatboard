import { create } from 'zustand'
import { createArtifactLogSlice, ArtifactLogStoreType } from "../state/slices/artifact-log-slice";



export type AdminStoreType = ArtifactLogStoreType




export const useAdminStore = create<AdminStoreType>((...a) => ({
    ...createArtifactLogSlice(...a),
}))