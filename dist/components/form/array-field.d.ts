import { ReactNode } from "react";
import { FieldValues } from "react-hook-form";
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
    children: (item: TItem, index: number, prefix: string, remove: (index: number) => void) => ReactNode;
    gap?: string;
}
/**
 * A wrapper for arrays using useFieldArray from react-hook-form.
 * It renders each array item with an index-based prefix (e.g., "meals.0").
 * We use a render-prop for `children`.
 */
export declare function ArrayField<TItem extends FieldValues>({ field, children, addComponent, gap, }: ArrayFieldProps<TItem>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=array-field.d.ts.map