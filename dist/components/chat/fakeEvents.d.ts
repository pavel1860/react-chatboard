export declare function useFakeStreamStore(delay?: number): {
    events: any[];
    requestId: string | null;
    isStreaming: boolean;
    startStream: () => void;
    clearStream: () => void;
    resetStream: () => void;
    consumed: (newEvents: any[]) => void;
    lastConsumedRef: import("react").MutableRefObject<number>;
};
//# sourceMappingURL=fakeEvents.d.ts.map