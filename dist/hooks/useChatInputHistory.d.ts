export declare function useChatInputHistory({ maxLength, }: {
    maxLength?: number;
}): {
    value: string;
    setValue: import("react").Dispatch<import("react").SetStateAction<string>>;
    handleKeyDown: (e: React.KeyboardEvent) => void;
    addToHistory: (input: string) => void;
    clearHistory: () => void;
    history: string[];
    historyIndex: number | null;
};
//# sourceMappingURL=useChatInputHistory.d.ts.map