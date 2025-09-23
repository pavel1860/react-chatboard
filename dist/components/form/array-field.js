import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@heroui/react";
import { useEffect, } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { fieldExistsInSchema } from "./form-utils";
/**
 * A wrapper for arrays using useFieldArray from react-hook-form.
 * It renders each array item with an index-based prefix (e.g., "meals.0").
 * We use a render-prop for `children`.
 */
export function ArrayField({ field, children, addComponent, gap, }) {
    // @ts-ignore
    const { control, schema, isReadOnly } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: field,
    });
    useEffect(() => {
        if (!fieldExistsInSchema(schema, field)) {
            throw new Error(`Field ${field} does not exist in schema`);
        }
    }, [field, schema]);
    const addItem = (item) => {
        // If you need default item structure, you can pass it to append({ ...defaults })
        append(item || {});
    };
    return (_jsxs("div", { style: { marginBottom: "1rem", display: "flex", flexDirection: "column", gap: gap || "1rem", marginTop: "1rem" }, className: "w-full", children: [fields.map((item, index) => {
                // item has type FieldArrayWithId, so let's call it TItem for convenience
                const itemData = item;
                const itemPrefix = `${field}.${index}`;
                return (_jsx("div", { className: "w-full", style: {
                        display: "flex",
                        flexDirection: "column",
                        // gap: gap || "1rem",
                        // marginBottom: "1rem",
                        // border: "1px solid #e3e3e3",
                        // padding: "0.5rem",
                    }, children: children(itemData, index, itemPrefix, remove) }, item.id));
            }), isReadOnly ? null : addComponent ? addComponent(addItem) : _jsx(Button, { isDisabled: isReadOnly, onPress: () => addItem(), variant: "light", size: "sm", color: "primary", children: "+ Add Item" })] }));
}
//# sourceMappingURL=array-field.js.map