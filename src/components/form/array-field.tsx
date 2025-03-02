// // ArrayField.jsx
// import React, { Children, isValidElement, cloneElement } from "react";
// import { useFormContext, useFieldArray } from "react-hook-form";
// import { ArrayFieldProps } from "./types";

// /**
//  * @param {Object} props
//  * @param {string} props.field - The array field name (e.g. "meals")
//  * @param {React.ReactNode} props.children - The fields for each array item
//  * @param {Function} [props.renderItemActions] - Optional callback to render extra actions per item
//  */
// export function ArrayField({ field, children, renderItemActions }: ArrayFieldProps) {
//     const { control } = useFormContext();

//     // useFieldArray needs the 'name' to match your array path
//     const { fields, append, remove } = useFieldArray({ control, name: field });

//     const addItem = () => {
//         // By default, we can just append an empty object or partial defaults
//         append({});
//     };

//     const renderChildrenForIndex = (index) => {
//         // Convert children to elements and pass prefix e.g. "meals.0"
//         const itemPrefix = `${field}.${index}`;

//         return Children.map(children, (child) => {
//             if (!isValidElement(child)) return child;
//             return cloneElement(child, {
//                 prefix: itemPrefix,
//             });
//         });
//     };

//     return (
//         <div style={{ marginBottom: "1rem" }}>
//             <h3>{field}</h3>

//             {/* Render each item in the array */}
//             {fields.map((item, index) => (
//                 <div key={item.id} style={{ marginBottom: "1rem", border: "1px solid #e3e3e3", padding: "0.5rem" }}>
//                     {renderChildrenForIndex(index)}

//                     <div style={{ marginTop: "0.5rem" }}>
//                         <button type="button" onClick={() => remove(index)}>
//                             Remove
//                         </button>
//                         {renderItemActions?.(index, remove)}
//                     </div>
//                 </div>
//             ))}

//             <button type="button" onClick={addItem}>
//                 + Add Item
//             </button>
//         </div>
//     );
// }


import { Button } from "@nextui-org/react";
import React, {
    FC,
    ReactNode,
    Children,
    isValidElement,
    cloneElement,
} from "react";
import { useFormContext, useFieldArray, FieldValues } from "react-hook-form";

/**
 * For arrays, we typically know the shape of items. But for a generic example,
 * we'll just pass the item as an unknown record plus an index, prefix, etc.
 * 
 * You can refine the `TItem` type if you want stronger typing
 * e.g., `interface MealItem { mealType: string; ... }`.
 */
export interface ArrayFieldProps<TItem extends FieldValues> {
    /**
     * The array field name (e.g., "meals").
     * This will be used in `useFieldArray` and to prefix child fields.
     */
    field: string;
    addComponent?: (addItem: () => void) => ReactNode;
    /**
     * A function that renders each item. 
     * 
     * @param item The partial data for the array item from `fields[index]`.
     * @param index The array index for the item.
     * @param prefix The prefix for nested fields (e.g. `"meals.0"`).
     * @param remove The function to remove an item at a given index.
     */
    children: (
        item: TItem,
        index: number,
        prefix: string,
        remove: (index: number) => void
    ) => ReactNode;
}

/**
 * A wrapper for arrays using useFieldArray from react-hook-form.
 * It renders each array item with an index-based prefix (e.g., "meals.0").
 * We use a render-prop for `children`.
 */
export function ArrayField<TItem extends FieldValues>({
    field,
    children,
    addComponent,
}: ArrayFieldProps<TItem>) {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: field,
    });

    const addItem = () => {
        // If you need default item structure, you can pass it to append({ ...defaults })
        append({});
    };

    return (
        <div style={{ marginBottom: "1rem" }}>
            {/* <h3>{field}</h3> */}

            {fields.map((item, index) => {
                // item has type FieldArrayWithId, so let's call it TItem for convenience
                const itemData = item as unknown as TItem;
                const itemPrefix = `${field}.${index}`;

                return (
                    <div
                        key={item.id}
                        style={{
                            marginBottom: "1rem",
                            border: "1px solid #e3e3e3",
                            padding: "0.5rem",
                        }}
                    >
                        {children(itemData, index, itemPrefix, remove)}
                    </div>
                );
            })}

            {/* <button type="button" onClick={addItem}>
                + Add Item
            </button> */}
            {addComponent ? addComponent(addItem) : <Button onPress={addItem} variant="light" size="sm" color="primary">+ Add Item</Button>}
            
        </div>
    );
}
