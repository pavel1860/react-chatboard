import { EvaluatorConfigType, TurnEvaluatorType } from "../services/testService";
import { MessageType, TurnType } from "../services/turnService";

import { create } from "zustand";
import { devtools } from "zustand/middleware";



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
  
  testTurns: {turn: TurnType, evaluators: EvaluatorConfigType[]}[];
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




export const useStore = create<StoreState>()(
  devtools(
    // persist(
    (set, get) => ({
      stateUpdateMessageId: null,
      setStateUpdateMessageId: (id: number | null) => set({ stateUpdateMessageId: id }),
      artifactView: null,
      setArtifactView: (view: ArtifactViewType) => set({ artifactView: view }),
      isArtifactViewOpen: false,
      setIsArtifactViewOpen: (isArtifactViewOpen: boolean) => set({ isArtifactViewOpen }),
      turnId: null,
      setTurnId: (id: number | null) => set({ turnId: id }),
      branchId: 1,
      setBranchId: (id: number) => set({ branchId: id }),
      conversationId: null,
      isTestMode: false,
      setIsTestMode: (isTestMode: boolean) => set({ isTestMode }),
      testTurns: [],
      addTestTurn: (turn: TurnType, evaluators: EvaluatorConfigType[]) => set({ testTurns: [...get().testTurns, { turn, evaluators }] }),
      removeTestTurn: (turnId: number) => set({ testTurns: get().testTurns.filter((turn) => turn.turn.id !== turnId) }),
      addEvaluator: (turnId: number, evaluator: EvaluatorConfigType) => set({ testTurns: get().testTurns.map((turn) => turn.turn.id === turnId ? { ...turn, evaluators: [...turn.evaluators, evaluator] } : turn) }),
      setEvaluatorMetadata: (turnId: number, evaluatorName: string, metadata: any) => set({ 
        testTurns: get().testTurns.map(
          (turn) => turn.turn.id === turnId ? { 
            ...turn, 
            evaluators: turn.evaluators.map((evaluator) => evaluator.name === evaluatorName ? { 
              ...evaluator, 
              metadata
            } : evaluator
          ) } : turn) 
      }),
      removeEvaluator: (turnId: number, evaluatorName: string) => set({ 
          testTurns: get().testTurns.map(
            (turn) => 
                turn.turn.id === turnId ? { 
                ...turn, 
                evaluators: turn.evaluators.filter((evaluator) => evaluator.name !== evaluatorName) } : turn) 
          }),
      setConversationId: (id: string | null) =>
        set({ conversationId: id }),
      refUserId: null,
      setRefUserId: (id: string | null) => set({ refUserId: id }),
      isUserListOpen: false,
      setIsUserListOpen: (isUserListOpen: boolean) => set({ isUserListOpen }),
      pendingMessage: null,
      isLoading: false,
      error: null,
      isHydrated: false,
      searchDebounceTimer: undefined,
      isAuthOpen: false,
      onAuthOpenChange: (isAuthOpen: boolean) => {
        set({ isAuthOpen });
      },
      isSidebarOpen: false,
      setIsSidebarOpen: (isSidebarOpen: boolean) => {
        set({ isSidebarOpen });
      },





      cleanup: () => {
        if (get().searchDebounceTimer) {
          clearTimeout(get().searchDebounceTimer);
        }
      },


      setPendingMessage: (pendingMessage: PendingMessageType) => {
        set({ pendingMessage });
      },

      syncUrlParams: (params) => {
        const state = get();
        
        // Helper function to normalize string | string[] to string | null
        const normalizeParam = (param: string | string[] | undefined): string | null => {
          if (!param) return null;
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
  )
);








export const useBotState = () => {
  return useStore((state) => state);
}