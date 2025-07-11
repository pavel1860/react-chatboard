// ArrayItem.tsx
import React, { FC, ReactNode, Children, isValidElement, cloneElement } from "react";

export interface ArrayItemProps {
    /** Zero-based index of this array item. */
    index: number;
    /** Unique ID for this item, from useFieldArray. Typically fields[index].id */
    itemId: string;
    /** e.g. "meals.0" */
    prefix: string;
    /**
     * Function from useFieldArray that removes this item
     * when you call onRemove(index).
     */
    onRemove: (index: number) => void;
    /** title for the array item */
    title?: string; 

    /** The form fields that belong to this array item. */
    children: ReactNode;
}

/**
 * Represents one item in an array. 
 * Clones its children and applies `prefix` so nested fields
 * refer to e.g. "meals.0.calories".
 */
export const ArrayItem: FC<ArrayItemProps> = ({
    index,
    itemId,
    prefix,
    onRemove,
    title,
    children,
}) => {
    // This function injects the prefix into child fields (InputField, ObjectField, etc.)
    const renderChildrenWithPrefix = () => {
        return Children.map(children, (child) => {
            if (!isValidElement(child)) return child;
            return cloneElement(child, {
                // @ts-ignore
                prefix,
            });
        });
    };

    return (
        <div
            key={itemId}
            style={{
                marginBottom: "1rem",
                border: "1px solid #e3e3e3",
                padding: "0.5rem",
            }}
        >

            {/* {title && <h2
                className="text-xl font-bold text-slate-500"
            >{title}</h2>} */}
            {renderChildrenWithPrefix()}

            <div style={{ marginTop: "0.5rem" }}>
                <button type="button" onClick={() => onRemove(index)}>
                    Remove
                </button>
            </div>
        </div>
    );
};
