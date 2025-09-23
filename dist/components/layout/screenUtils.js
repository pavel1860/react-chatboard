import { useCallback, useEffect, useState } from "react";
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
    console.log("updateVh", window.innerHeight, window.innerHeight * 0.01);
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
};
export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    });
    const [bodyDiff, setBodyDiff] = useState(0);
    const updateSize = useCallback(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        setBodyDiff(window.outerHeight - window.innerHeight);
        updateVh();
    }, [setWindowSize]);
    useEffect(() => {
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return {
        size: windowSize,
        updateSize,
        bodyDiff: bodyDiff
    };
};
//# sourceMappingURL=screenUtils.js.map