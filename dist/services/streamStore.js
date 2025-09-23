// streamStore.ts
import { useEffect, useRef, useState } from 'react';
import { convertKeysToCamelCase } from '../model/services/model-context';
import { create } from 'zustand';
export const useStreamStore = create((set, get) => ({
    events: [],
    requestId: null,
    isStreaming: false,
    startStream: async ({ url, formData, userId, onEvent }) => {
        try {
            const requestId = crypto.randomUUID();
            set({ isStreaming: true, events: [], requestId });
            const res = await fetch(url, {
                method: "POST",
                body: formData,
                headers: {
                    "X-Auth-User": userId,
                    "X-Request-Id": requestId
                },
            });
            if (!res.body) {
                set({ isStreaming: false });
                return;
            }
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";
                for (const line of lines) {
                    // console.log(line);
                    if (!line.trim())
                        continue;
                    try {
                        const parsed = convertKeysToCamelCase(JSON.parse(line));
                        // parsed.requestId = parsed.request_id
                        // delete parsed.request_id
                        // parsed.createdAt = new Date(parsed.created_at)
                        // delete parsed.created_at
                        set((state) => ({ events: [...state.events, parsed] }));
                        onEvent?.(parsed);
                    }
                    catch (err) {
                        console.warn("Stream event parse error", err, line);
                    }
                }
            }
            set({ isStreaming: false });
        }
        catch (err) {
            console.error("Stream error", err);
            set({ isStreaming: false });
            return;
        }
    },
    clearStream: () => set({ events: [], requestId: null }),
}));
function randomId() {
    return Math.random().toString(36).substring(2, 10);
}
export function useStream(eventTypes) {
    const lastIndexRef = useRef(-1);
    const [eventTypeSet, setEventTypeSet] = useState(new Set());
    const [consumingRequestId, setConsumingRequestId] = useState(null);
    const { events, requestId, isStreaming, startStream, clearStream } = useStreamStore();
    const [streamHookId, setStreamHookId] = useState(randomId());
    useEffect(() => {
        if (eventTypes) {
            setEventTypeSet(new Set(eventTypes));
        }
    }, [eventTypes]);
    useEffect(() => {
        console.log(`useStream(${streamHookId})`, "comparing requestId", requestId, "and consumingRequestId", consumingRequestId);
        if (requestId !== consumingRequestId && isStreaming) {
            setConsumingRequestId(requestId);
            lastIndexRef.current = -1;
        }
    }, [requestId, isStreaming]);
    const consumed = (consumedEvents, effectId) => {
        if (consumedEvents.length === 0 || !consumingRequestId)
            return;
        let prevIndex = lastIndexRef.current;
        const lastIndex = consumedEvents[consumedEvents.length - 1].index;
        if (prevIndex > lastIndex) {
            console.warn("Stream event index out of order", prevIndex, lastIndex);
        }
        lastIndexRef.current = lastIndex;
    };
    const pullEvents = () => {
        if (!consumingRequestId) {
            return [];
        }
        let newEvents = events.filter(e => e.index > lastIndexRef.current);
        if (eventTypeSet.size > 0) {
            newEvents = newEvents.filter(e => eventTypeSet.has(e.type));
        }
        return newEvents;
    };
    return {
        streamHookId,
        events: consumingRequestId ? events : [],
        pullEvents,
        consumed,
        isStreaming,
        requestId: consumingRequestId,
        startStream,
        clearStream,
        lastIndex: lastIndexRef.current,
    };
}
//# sourceMappingURL=streamStore.js.map