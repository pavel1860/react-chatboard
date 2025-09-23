import { ToolCall, TurnType } from "./schema";
interface TurnProps<T extends TurnType, M> {
    children: (item: M, index: number, items: M[]) => React.ReactNode;
    className?: string;
    turn: T;
    items: M[];
    showFooterControls?: boolean;
    showSideControls?: boolean;
    index: number;
    nextTurn: T | undefined;
    prevTurn: T | undefined;
    branchId: number;
    isSelected?: boolean;
    setBranchId: (branchId: number) => void;
    sendMessage: (content: string, toolCalls?: ToolCall[], state?: any, fromTurnId?: number | null, addBranch?: boolean, files?: any, role?: string) => Promise<void>;
    topContent?: React.ReactNode;
    bottomContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    handleApproval?: (status: "committed" | "reverted", refetchChat?: () => void) => void;
    onBranchChange?: (branchId: number) => void;
    evaluators?: React.ReactNode;
    refetchChat?: () => void;
}
interface TurnApprovalProps {
    onApprove?: () => void;
    onReject?: () => void;
    isProcessing?: boolean;
    message?: string;
}
export declare const TurnApproval: ({ onApprove, onReject, isProcessing, message }: TurnApprovalProps) => import("react/jsx-runtime").JSX.Element;
export declare const Turn: <T extends TurnType, M>({ children: itemRender, turn, items, index, nextTurn, prevTurn, branchId, setBranchId, sendMessage, showFooterControls, showSideControls, className, topContent, bottomContent, rightContent, onBranchChange, evaluators, isSelected, refetchChat, handleApproval, }: TurnProps<T, M>) => import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=turn.d.ts.map