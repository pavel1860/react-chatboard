import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ArrayItem.tsx
import { Children, isValidElement, cloneElement } from "react";
/**
 * Represents one item in an array.
 * Clones its children and applies `prefix` so nested fields
 * refer to e.g. "meals.0.calories".
 */
export const ArrayItem = ({ index, itemId, prefix, onRemove, title, children, }) => {
    // This function injects the prefix into child fields (InputField, ObjectField, etc.)
    const renderChildrenWithPrefix = () => {
        return Children.map(children, (child) => {
            if (!isValidElement(child))
                return child;
            return cloneElement(child, {
                // @ts-ignore
                prefix,
            });
        });
    };
    return (_jsxs("div", { style: {
            marginBottom: "1rem",
            border: "1px solid #e3e3e3",
            padding: "0.5rem",
        }, children: [renderChildrenWithPrefix(), _jsx("div", { style: { marginTop: "0.5rem" }, children: _jsx("button", { type: "button", onClick: () => onRemove(index), children: "Remove" }) })] }, itemId));
};
//# sourceMappingURL=array-item.js.map