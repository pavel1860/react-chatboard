import { useStore } from "react-chatboard/src/store/useStore";







export const useLayout = () => {
    
    const { isSidebarOpen, setIsSidebarOpen } = useStore();

    return {
        isSidebarOpen,
        setIsSidebarOpen
    }
}