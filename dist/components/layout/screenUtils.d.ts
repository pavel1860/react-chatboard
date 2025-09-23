export declare function useIsLargeScreen(): boolean;
export declare const updateVh: () => void;
interface WindowSize {
    width: number;
    height: number;
}
export declare const useWindowSize: () => {
    size: WindowSize;
    updateSize: () => void;
    bodyDiff: number;
};
export {};
//# sourceMappingURL=screenUtils.d.ts.map