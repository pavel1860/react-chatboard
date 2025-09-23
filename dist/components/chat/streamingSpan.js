import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useStream } from '../../services/streamStore';
;
import { Spinner } from '@heroui/react';
import { useExecutionBuilder } from './processEvents';
import { SpanContainer } from '../blocks/UserSpan';
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render shows fallback UI
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        // Log error details (to console, or send to a logging service)
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            // Render fallback UI or default fallback
            return this.props.fallback || _jsx("h2", { children: "Something went wrong." });
        }
        return this.props.children;
    }
}
function randomId() {
    return Math.random().toString(36).substring(2, 10);
}
const StreamingSpanViewer = ({ requestId: requestIdProp, onSpanUpdate }) => {
    const [fakeTurn, setFakeTurn] = useState(null);
    // const [streamId, setStreamId] = useState(randomId());
    const { events, pullEvents, consumed, isStreaming, requestId, streamHookId } = useStream();
    const [count, setCount] = useState(0);
    const { processEvent, executionTree: currSpan } = useExecutionBuilder();
    useEffect(() => {
        if (!requestId)
            return;
        const effectId = randomId();
        const newEvents = pullEvents();
        for (const event of newEvents) {
            processEvent(event, streamHookId);
            setCount(count + 1);
        }
        consumed(newEvents, effectId);
    }, [events]);
    useEffect(() => {
        if (isStreaming && events.length === 0) {
            setFakeTurn(null);
            onSpanUpdate?.(null);
        }
    }, [isStreaming, events.length]);
    if (!currSpan && !isStreaming) {
        return (_jsx("div", { className: "bg-gray-50 border border-gray-200 rounded p-2", children: _jsx("div", { className: "text-xs text-gray-500 font-mono text-center py-4", children: "no streaming data" }) }));
    }
    if (!currSpan && isStreaming) {
        return (_jsx(Spinner, { classNames: { label: "text-foreground mt-4" }, variant: "wave" }));
    }
    return (_jsx("div", { children: currSpan && _jsx(SpanContainer, { span: currSpan }) }));
};
const FallbackUI = () => {
    // const { events, isStreaming, consumed } = useStream();
    return (_jsx("div", { children: _jsx("h2", { children: "Something went wrong." }) }));
};
const StreamingSpanWrapper = () => {
    return (_jsx(ErrorBoundary, { fallback: _jsx(FallbackUI, {}), children: _jsx(StreamingSpanViewer, {}) }));
};
export default StreamingSpanWrapper;
//# sourceMappingURL=streamingSpan.js.map