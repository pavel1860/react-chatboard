import { useEffect, useState } from "react";



export function useIsLargeScreen() {
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };

        // Check initially
        checkScreenSize();

        // Add event listener
        window.addEventListener("resize", checkScreenSize);

        // Cleanup
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return isLargeScreen;
}





export const updateVh = () => {
    console.log("updateVh", window.innerHeight, window.innerHeight * 0.01)
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
};


interface WindowSize {
    width: number;
    height: number;
}

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: 0,
        height: 0,
    });

    useEffect(() => {
        const updateSize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
            updateVh();
        };
        updateSize();
        
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return windowSize;
};
