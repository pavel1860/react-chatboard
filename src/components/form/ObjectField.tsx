// ObjectField.jsx
import React, { Children, isValidElement, cloneElement } from "react";
import { ObjectFieldProps } from "./types";

/**
 * @param {Object} props
 * @param {string} props.field - The field name for the nested object (e.g. "food")
 * @param {React.ReactNode} props.children - The inner fields
 * @param {string} [props.prefix] - Optional prefix (for deeper nesting)
 */
export function ObjectField({ field, prefix, children }: ObjectFieldProps) {
    // Final prefix becomes something like "meals.0.food"
    const objectPrefix = prefix ? `${prefix}.${field}` : field;

    // Clone children, passing the new prefix
    const renderChildrenWithPrefix = () =>
        Children.map(children, (child) => {
            if (!isValidElement(child)) return child;
            return cloneElement(child, {
                // @ts-ignore
                prefix: objectPrefix,
            });
        });

    return <div style={{ borderLeft: "3px solid #ccc", paddingLeft: "1rem" }}>{renderChildrenWithPrefix()}</div>;
}
