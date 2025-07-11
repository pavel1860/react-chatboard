import { useState, useCallback, useRef } from "react";

const HISTORY_KEY = "chat_input_history";

export function useChatInputHistory({
    maxLength = 10,
}: {
    maxLength?: number;
}) {
    const [value, setValue] = useState("");
    const [history, setHistory] = useState<string[]>(() => {
        if (typeof window === "undefined") return [];
        try {
            const raw = localStorage.getItem(HISTORY_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const tempValueRef = useRef<string>("");

    // Save history to localStorage
    const saveHistory = useCallback((hist: string[]) => {
        setHistory(hist);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    }, []);

    // Add to history (on submit)
    const addToHistory = useCallback((input: string) => {
        if (!input.trim()) return;
        let newHistory = history.filter((item) => item !== input);
        newHistory.unshift(input);
        if (newHistory.length > maxLength) newHistory = newHistory.slice(0, maxLength);
        saveHistory(newHistory);
        setHistoryIndex(null);
    }, [history, maxLength, saveHistory]);

    // Handle Arrow Up/Down
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            if (!history.length) return;
            e.preventDefault();
            if (historyIndex === null) {
                tempValueRef.current = value;
                if (e.key === "ArrowUp") {
                    setValue(history[0]);
                    setHistoryIndex(0);
                }
            } else {
                let newIndex = historyIndex + (e.key === "ArrowUp" ? 1 : -1);
                if (e.key === "ArrowUp" && newIndex >= history.length) {
                    newIndex = history.length - 1;
                }
                if (e.key === "ArrowDown" && newIndex < 0) {
                    setValue(tempValueRef.current);
                    setHistoryIndex(null);
                    return;
                }
                if (newIndex >= 0 && newIndex < history.length) {
                    setValue(history[newIndex]);
                    setHistoryIndex(newIndex);
                }
            }
        }
    }, [history, historyIndex, value]);

    // Clear history (on logout)
    const clearHistory = useCallback(() => {
        setHistory([]);
        setHistoryIndex(null);
        localStorage.removeItem(HISTORY_KEY);
    }, []);

    return {
        value,
        setValue,
        handleKeyDown,
        addToHistory,
        clearHistory,
        history,
        historyIndex,
    };
} 