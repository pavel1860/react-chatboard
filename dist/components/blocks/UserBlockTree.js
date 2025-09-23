import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useComponentConfig, useComponentRegistry } from "./UserComponentRegistry";
import { cn } from "@heroui/react";
import { HiddenBlock } from "./defaultComponents";
export const BlockContainer = ({ block }) => {
    const { debugOutlines } = useComponentRegistry();
    const { component, isHidden, isWrapper } = useComponentConfig(block.tags, "block");
    if (isHidden) {
        return null;
    }
    const BlockComponent = !isWrapper ? component : HiddenBlock;
    if (!BlockComponent)
        return null;
    return (_jsxs("div", { className: cn({
            "outline-solid outline-blue-500 p-2 mb-2": debugOutlines
        }), children: [debugOutlines && _jsx("div", { className: "flex gap-2", children: _jsx("div", { className: "flex gap-1", children: block.tags?.map((tag) => (_jsx("div", { className: "text-sm text-gray-500 border border-gray-500 rounded-lg px-1", children: tag }, tag))) }) }), _jsx(BlockComponent, { block: block, children: block.children?.map((child, i) => (_jsx(BlockContainer, { block: child }, i))) })] }));
};
//# sourceMappingURL=UserBlockTree.js.map