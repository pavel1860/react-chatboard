import { useStore } from "../store/useStore";
export const useLayout = () => {
    const { isSidebarOpen, setIsSidebarOpen } = useStore();
    return {
        isSidebarOpen,
        setIsSidebarOpen
    };
};
//# sourceMappingURL=layout-hook.js.map