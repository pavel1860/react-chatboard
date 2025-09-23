import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// InputField.jsx
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectItem } from '@heroui/react';
import { fieldExistsInSchema, useFieldValues, useInputStyle } from "./form-utils";
import InputLabel from './InputLabel';
const SelectComp = ({ type, label, field, fieldInfo, prefix, fieldName, variant, radius, size, labelWidth,
// icon 
 }) => {
    const selectValues = useFieldValues(fieldName);
    const { variant: inputVariant, radius: inputRadius, size: inputSize, } = useInputStyle({ variant, radius, size });
    const { labelWidth: labelWidthStyle, inputWidth: inputWidthStyle, } = useInputStyle({ variant, radius, size });
    return (_jsx(Select, { id: fieldName, disallowEmptySelection: true, variant: inputVariant, size: inputSize, radius: inputRadius, 
        // startContent={inputStartIcon}
        // endContent={input.EndIcon}
        selectedKeys: [fieldInfo.value], ...fieldInfo, items: selectValues, 
        // label={label}
        placeholder: label, classNames: {
            "base": inputWidthStyle ? `w-[${inputWidthStyle}px]` : "",
            "label": labelWidthStyle ? `w-[${labelWidthStyle}px]` : ""
        }, children: selectValues.map((option) => (_jsx(SelectItem, { children: option.label }, option.value))) }));
};
/**
 * @param {Object} props
 * @param {string} props.type - The input type (e.g. "text", "number", etc.)
 * @param {string} props.label - A user-friendly label for the field
 * @param {string} props.field - The field name (can be nested, e.g. "meals.0.calories")
 * @param {string} [props.prefix] - Optional prefix for nested usage (ArrayField / ObjectField)
 */
export function SelectField({ type, label, field, prefix, icon, labelWidth, ...props }) {
    // @ts-ignore
    const { register, control, formState: { errors }, isReadOnly, schema } = useFormContext();
    // Build the final field name
    const fieldName = prefix ? `${prefix}.${field}` : field;
    useEffect(() => {
        if (!fieldExistsInSchema(schema, field)) {
            throw new Error(`Field ${field} does not exist in schema`);
        }
    }, [field, schema]);
    return (_jsx(Controller
    //@ts-ignore
    , { 
        //@ts-ignore
        name: fieldName, control: control, render: ({ field: fieldInfo }) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(InputLabel, { fieldName: fieldName, label: label, icon: icon, labelWidth: labelWidth }), isReadOnly ?
                    _jsx("span", { className: "relative inline-flex tap-highlight-transparent flex-row items-center px-3 gap-3 data-[hover=true]:bg-default-50 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium flex-1 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background is-filled", children: fieldInfo.value }) : SelectComp({ type, label, field, fieldInfo, prefix, fieldName, labelWidth, ...props }), errors[fieldName] && (_jsx("div", { style: { color: "red", marginTop: 4 }, children: errors[fieldName].message?.toString() }))] })) }));
}
//# sourceMappingURL=select-field.js.map