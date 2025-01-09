// ArrayField.jsx
import React, { Children, isValidElement, cloneElement } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { ArrayFieldProps } from "./types";

/**
 * @param {Object} props
 * @param {string} props.field - The array field name (e.g. "meals")
 * @param {React.ReactNode} props.children - The fields for each array item
 * @param {Function} [props.renderItemActions] - Optional callback to render extra actions per item
 */
export function ArrayField({ field, children, renderItemActions }: ArrayFieldProps) {
    const { control } = useFormContext();

    // useFieldArray needs the 'name' to match your array path
    const { fields, append, remove } = useFieldArray({ control, name: field });

    const addItem = () => {
        // By default, we can just append an empty object or partial defaults
        append({});
    };

    const renderChildrenForIndex = (index) => {
        // Convert children to elements and pass prefix e.g. "meals.0"
        const itemPrefix = `${field}.${index}`;

        return Children.map(children, (child) => {
            if (!isValidElement(child)) return child;
            return cloneElement(child, {
                prefix: itemPrefix,
            });
        });
    };

    return (
        <div style={{ marginBottom: "1rem" }}>
            <h3>{field}</h3>

            {/* Render each item in the array */}
            {fields.map((item, index) => (
                <div key={item.id} style={{ marginBottom: "1rem", border: "1px solid #e3e3e3", padding: "0.5rem" }}>
                    {renderChildrenForIndex(index)}

                    <div style={{ marginTop: "0.5rem" }}>
                        <button type="button" onClick={() => remove(index)}>
                            Remove
                        </button>
                        {renderItemActions?.(index, remove)}
                    </div>
                </div>
            ))}

            <button type="button" onClick={addItem}>
                + Add Item
            </button>
        </div>
    );
}



// ArrayField.tsx
// import React, {
//     FC,
//     ReactNode,
//     Children,
//     isValidElement,
//     cloneElement,
// } from "react";
// import { useFormContext, useFieldArray } from "react-hook-form";
// import { ArrayItem } from "./array-item";

// export interface ArrayFieldProps {
//     /** The array field name, e.g. "meals". */
//     field: string;
//     /** The children, which should include <ArrayItem> as a wrapper. */
//     children: ReactNode;
// }

// /**
//  * Manages a list of items (via useFieldArray).
//  * Expects <ArrayItem> in its children to describe each item’s form fields.
//  */
// export const ArrayField: FC<ArrayFieldProps> = ({ field, children }) => {
//     const { control } = useFormContext();
//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: field,
//     });

//     // Add a new item to the array
//     const addItem = () => {
//         // If you need defaults, pass an object to append({ mealType: "...", ... })
//         append({});
//     };

//     return (
//         <div style={{ marginBottom: "1rem" }}>
//             <h3>{field}</h3>

//             {fields.map((item, index) => {
//                 // We'll look for <ArrayItem> in the children
//                 return Children.map(children, (child) => {
//                     if (!isValidElement(child)) return child;

//                     // If the child is an <ArrayItem />, clone it with item-specific props
//                     if (child.type === ArrayItem) {
//                         return cloneElement(child, {
//                             index,
//                             itemId: item.id,
//                             prefix: `${field}.${index}`,  // e.g. "meals.0"
//                             onRemove: remove,
//                         });
//                     }

//                     // If it’s some other element, just return as is (or ignore)
//                     return child;
//                 });
//             })}

//             <button type="button" onClick={addItem}>
//                 + Add Item
//             </button>
//         </div>
//     );
// };
