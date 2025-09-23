import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const VisibilityContext = createContext(null);
export function UserVisibilityProvider({ children, defaultVisibleTags = [], showAll = false, }) {
    const [visible, setVisible] = useState(new Set(defaultVisibleTags));
    const show = (tag) => {
        setVisible((prev) => new Set(prev).add(tag));
    };
    const hide = (tag) => {
        setVisible((prev) => {
            const next = new Set(prev);
            next.delete(tag);
            return next;
        });
    };
    const isVisible = (tags) => {
        if (showAll)
            return true;
        if (!tags || tags.length === 0)
            return false; // nothing is visible by default
        return tags.some((t) => visible.has(t));
    };
    const setVisibleTags = (tags) => {
        setVisible(new Set(tags));
    };
    return (_jsx(VisibilityContext.Provider, { value: { visible, show, hide, isVisible, setVisibleTags }, children: children }));
}
export function useVisibility() {
    const ctx = useContext(VisibilityContext);
    if (!ctx)
        throw new Error("useVisibility must be used inside UserVisibilityProvider");
    return ctx;
}
//# sourceMappingURL=UserVisibilityContext.js.map