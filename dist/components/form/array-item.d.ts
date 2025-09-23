import { FC, ReactNode } from "react";
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
export declare const ArrayItem: FC<ArrayItemProps>;
//# sourceMappingURL=array-item.d.ts.map