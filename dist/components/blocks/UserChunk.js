import { jsx as _jsx } from "react/jsx-runtime";
// UserChunk.tsx
import { useEffect, useState } from "react";
export const UserChunk = ({ chunk, animate = true }) => {
    const [displayed, setDisplayed] = useState("");
    useEffect(() => {
        if (!animate) {
            setDisplayed(chunk.content);
            return;
        }
        let i = 0;
        const interval = setInterval(() => {
            setDisplayed(chunk.content.slice(0, i + 1));
            i++;
            if (i >= chunk.content.length)
                clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, [chunk.content, animate]);
    return _jsx("span", { children: displayed });
};
//# sourceMappingURL=UserChunk.js.map