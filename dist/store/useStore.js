import { create } from "zustand";
import { devtools } from "zustand/middleware";
export const useStore = create()(devtools(
// persist(
(set, get) => ({
    stateUpdateMessageId: null,
    setStateUpdateMessageId: (id) => set({ stateUpdateMessageId: id }),
    artifactView: null,
    setArtifactView: (view) => set({ artifactView: view }),
    isArtifactViewOpen: false,
    setIsArtifactViewOpen: (isArtifactViewOpen) => set({ isArtifactViewOpen }),
    turnId: null,
    setTurnId: (id) => set({ turnId: id }),
    branchId: 1,
    setBranchId: (id) => set({ branchId: id }),
    conversationId: null,
    isTestMode: false,
    setIsTestMode: (isTestMode) => set({ isTestMode }),
    testTurns: [],
    addTestTurn: (turn, evaluators) => set({ testTurns: [...get().testTurns, { turn, evaluators }] }),
    removeTestTurn: (turnId) => set({ testTurns: get().testTurns.filter((turn) => turn.turn.id !== turnId) }),
    addEvaluator: (turnId, evaluator) => set({ testTurns: get().testTurns.map((turn) => turn.turn.id === turnId ? { ...turn, evaluators: [...turn.evaluators, evaluator] } : turn) }),
    setEvaluatorMetadata: (turnId, evaluatorName, metadata) => set({
        testTurns: get().testTurns.map((turn) => turn.turn.id === turnId ? {
            ...turn,
            evaluators: turn.evaluators.map((evaluator) => evaluator.name === evaluatorName ? {
                ...evaluator,
                metadata
            } : evaluator)
        } : turn)
    }),
    removeEvaluator: (turnId, evaluatorName) => set({
        testTurns: get().testTurns.map((turn) => turn.turn.id === turnId ? {
            ...turn,
            evaluators: turn.evaluators.filter((evaluator) => evaluator.name !== evaluatorName)
        } : turn)
    }),
    setConversationId: (id) => set({ conversationId: id }),
    refUserId: null,
    setRefUserId: (id) => set({ refUserId: id }),
    isUserListOpen: false,
    setIsUserListOpen: (isUserListOpen) => set({ isUserListOpen }),
    pendingMessage: null,
    isLoading: false,
    error: null,
    isHydrated: false,
    searchDebounceTimer: undefined,
    isAuthOpen: false,
    onAuthOpenChange: (isAuthOpen) => {
        set({ isAuthOpen });
    },
    isSidebarOpen: false,
    setIsSidebarOpen: (isSidebarOpen) => {
        set({ isSidebarOpen });
    },
    cleanup: () => {
        if (get().searchDebounceTimer) {
            clearTimeout(get().searchDebounceTimer);
        }
    },
    setPendingMessage: (pendingMessage) => {
        set({ pendingMessage });
    },
    syncUrlParams: (params) => {
        const state = get();
        // Helper function to normalize string | string[] to string | null
        const normalizeParam = (param) => {
            if (!param)
                return null;
            return Array.isArray(param) ? param[0] || null : param;
        };
        // Sync conversationId (partitionId)
        const normalizedPartitionId = normalizeParam(params.partitionId);
        if (normalizedPartitionId !== state.conversationId) {
            set({ conversationId: normalizedPartitionId });
        }
        // Sync branchId
        if (params.branchId && params.branchId !== state.branchId) {
            set({ branchId: params.branchId });
        }
        // Sync refUserId
        const normalizedUserId = normalizeParam(params.userId);
        if (normalizedUserId !== state.refUserId) {
            set({ refUserId: normalizedUserId });
        }
    },
})
//   persistConfig
// )
));
export const useBotState = () => {
    return useStore((state) => state);
};
//# sourceMappingURL=useStore.js.map