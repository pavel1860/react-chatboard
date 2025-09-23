import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BlockContainer } from "./UserBlockTree";
import { useComponentConfig, useComponentRegistry } from "./UserComponentRegistry";
import { cn } from "@heroui/react";
import { HiddenSpan } from "./defaultComponents";
export const SpanContainer = ({ span }) => {
    const { debugOutlines } = useComponentRegistry();
    const { component, isHidden, isWrapper } = useComponentConfig(span.tags || [], "span");
    if (isHidden) {
        return null;
    }
    const SpanComponent = !isWrapper ? component : HiddenSpan;
    if (!SpanComponent)
        return null;
    return (
    // <div className={cn("border border-red-500 rounded p-2 mb-2", {
    //   "outline outline-red-500": debugOutlines
    // })}>
    _jsxs("div", { className: cn({
            "outline-dashed outline-red-500 p-2 mb-2": debugOutlines
            // "border border-red-500 rounded p-2 mb-2": debugOutlines
        }), children: [debugOutlines && _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "text-md text-gray-500", children: span.name }), _jsx("div", { className: "flex gap-1", children: span.tags?.map((tag) => (_jsx("div", { className: "text-sm text-gray-500 border border-gray-500 rounded-lg px-1", children: tag }, tag))) })] }), _jsx(SpanComponent, { span: span, children: span.events.map((ev, i) => {
                    if (ev.eventType === "block" && ev.data) {
                        return _jsx(BlockContainer, { block: ev.data }, i);
                    }
                    if (ev.eventType === "stream" && ev.data) {
                        return _jsx(BlockContainer, { block: ev.data }, i);
                    }
                    if (ev.eventType === "span" && ev.data) {
                        return _jsx(SpanContainer, { span: ev.data }, i);
                    }
                    // For now we skip logs/stream events in user-facing view
                    return null;
                }) })] }));
};
//# sourceMappingURL=UserSpan.js.map