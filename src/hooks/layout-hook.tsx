import { useAdminStore } from "../stores/admin-store"




export const useLayout = () => {
    const { sideView, setSideView } = useAdminStore()

    return {
        sideView,
        setSideView,
        isTestFormOpen: sideView === "test-case",
    }
}