import { EvaluatorConfigType } from "../services/testService";
import { MessageType, TurnType } from "../services/turnService";
type ArtifactViewType = string | null;
type PendingMessageType = {
    message: MessageType;
    conversationId: string;
    branchId: number;
};
interface StoreState {
    stateUpdateMessageId: number | null;
    refUserId: string | null;
    isUserListOpen: boolean;
    conversationId: string | null;
    turnId: number | null;
    branchId: number;
    isTestMode: boolean;
    testTurns: {
        turn: TurnType;
        evaluators: EvaluatorConfigType[];
    }[];
    artifactView: ArtifactViewType;
    isArtifactViewOpen: boolean;
    pendingMessage: PendingMessageType | null;
    isLoading: boolean;
    error: string | null;
    searchDebounceTimer?: NodeJS.Timeout;
    isAuthOpen: boolean;
    setStateUpdateMessageId: (id: number | null) => void;
    setArtifactView: (view: ArtifactViewType) => void;
    setPendingMessage: (pendingMessage: PendingMessageType | undefined) => void;
    setBranchId: (id: number | null) => void;
    setConversationId: (id: string | null) => void;
    setRefUserId: (id: string | null) => void;
    setTurnId: (id: number | null) => void;
    setIsTestMode: (isTestMode: boolean) => void;
    addTestTurn: (turn: TurnType, evaluators: EvaluatorConfigType[]) => void;
    removeTestTurn: (turnId: number) => void;
    addEvaluator: (turnId: number, evaluator: EvaluatorConfigType) => void;
    removeEvaluator: (turnId: number, evaluatorName: string) => void;
    setEvaluatorMetadata: (turnId: number, evaluatorName: string, metadata: any) => void;
    setIsUserListOpen: (isUserListOpen: boolean) => void;
    syncUrlParams: (params: {
        partitionId?: string | string[] | undefined;
        branchId?: number | undefined;
        userId?: string | string[] | undefined;
    }) => void;
    cleanup: VoidFunction;
    onAuthOpenChange: (isAuthOpen: boolean) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isSidebarOpen: boolean) => void;
    setIsArtifactViewOpen: (isArtifactViewOpen: boolean) => void;
}
export declare const useStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<StoreState>, "setState" | "devtools"> & {
    setState(partial: StoreState | Partial<StoreState> | ((state: StoreState) => StoreState | Partial<StoreState>), replace?: false | undefined, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    setState(state: StoreState | ((state: StoreState) => StoreState), replace: true, action?: (string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }) | undefined): void;
    devtools: {
        cleanup: () => void;
    };
}>;
export declare const useBotState: () => StoreState;
export {};
//# sourceMappingURL=useStore.d.ts.map