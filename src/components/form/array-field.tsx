import { Button } from "@heroui/react";
import React, {
    ReactNode,
    useEffect,
} from "react";
import { useFormContext, useFieldArray, FieldValues } from "react-hook-form";
import { fieldExistsInSchema } from "./form-utils";

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
    gap?: string;
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
    gap,
}: ArrayFieldProps<TItem>) {
    // @ts-ignore
    const { control, schema, isReadOnly } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: field,
    });
    

    useEffect(() => {
        if (!fieldExistsInSchema(schema, field)) {
            throw new Error(`Field ${field} does not exist in schema`)
        }
    }, [field, schema])

    const addItem = (item?: TItem) => {
        // If you need default item structure, you can pass it to append({ ...defaults })
        append(item || {});
    };



    return (
        <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: gap || "1rem", marginTop: "1rem" }} className="w-full">
            {/* <h3>{field}</h3> */}

            {fields.map((item, index) => {
                // item has type FieldArrayWithId, so let's call it TItem for convenience
                const itemData = item as unknown as TItem;
                const itemPrefix = `${field}.${index}`;

                return (
                    <div
                        key={item.id}
                        className="w-full"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            
                            // gap: gap || "1rem",
                            // marginBottom: "1rem",
                            // border: "1px solid #e3e3e3",
                            // padding: "0.5rem",
                        }}
                    >
                        {children(itemData, index, itemPrefix, remove)}
                    </div>
                );
            })}

            { isReadOnly ? null : addComponent ? addComponent(addItem) : <Button isDisabled={isReadOnly} onPress={() => addItem()} variant="light" size="sm" color="primary">+ Add Item</Button>}
            
        </div>
    );
}
