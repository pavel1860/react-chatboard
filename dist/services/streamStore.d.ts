export interface StreamEvent {
    type: string;
    name: string;
    attrs: any;
    payload: any;
    event: any;
    createdAt: Date;
    error: any;
    index: number;
    requestId: string;
    turnId?: number;
    branchId?: number;
    spanId?: string;
    path?: number[];
    parentEventId?: string;
}
interface StreamState {
    events: StreamEvent[];
    requestId: string | null;
    isStreaming: boolean;
    startStream: (options: {
        url: string;
        formData: FormData;
        userId: string;
        onEvent?: (event: StreamEvent) => void;
    }) => Promise<void>;
    clearStream: () => void;
}
export declare const useStreamStore: import("zustand").UseBoundStore<import("zustand").StoreApi<StreamState>>;
export declare function useStream(eventTypes?: string[]): {
    streamHookId: string;
    events: StreamEvent[];
    pullEvents: () => StreamEvent[];
    consumed: (consumedEvents: StreamEvent[], effectId?: string) => void;
    isStreaming: boolean;
    requestId: string | null;
    startStream: (options: {
        url: string;
        formData: FormData;
        userId: string;
        onEvent?: (event: StreamEvent) => void;
    }) => Promise<void>;
    clearStream: () => void;
    lastIndex: number;
};
export {};
//# sourceMappingURL=streamStore.d.ts.map