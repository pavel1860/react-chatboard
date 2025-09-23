import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// InputField.jsx
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from '@heroui/react';
import { fieldExistsInSchema, useInputStyle } from "./form-utils";
import InputLabel from './InputLabel';
const InputComp = ({ type, label, field, fieldInfo, prefix, fieldName, variant, radius, size, startContent, endContent, inputWidth, labelWidth, isReadOnly,
// icon 
 }) => {
    const { variant: inputVariant, radius: inputRadius, size: inputSize, inputWidth: inputWidthStyle, labelWidth: labelWidthStyle, isReadOnly: isReadOnlyStyle, } = useInputStyle({ variant, radius, size, inputWidth, labelWidth, isReadOnly });
    if (type === "text") {
        return (_jsx(Input, { isReadOnly: isReadOnlyStyle, id: fieldName, variant: inputVariant, radius: inputRadius, size: inputSize, ...fieldInfo, startContent: startContent, endContent: endContent, placeholder: label, classNames: {
                // "base": inputWidthStyle ? `w-[${inputWidthStyle}px]` : "",  
                "base": "w-full",
            } }));
    }
    else if (type == "number") {
        return (_jsx(Input, { id: fieldName, isReadOnly: isReadOnlyStyle, type: "number", variant: inputVariant, radius: inputRadius, size: inputSize, ...fieldInfo, onChange: (e) => {
                const value = e.target.value;
                fieldInfo.onChange(value == "" ? undefined : Number(value));
            }, startContent: startContent, endContent: endContent, placeholder: label, style: { width: inputWidth }, classNames: {
                // "base": inputWidthStyle ? `w-[${inputWidthStyle}px]` : "",                    
                "base": "w-full",
            } }));
    }
};
/**
 * @param {Object} props
 * @param {string} props.type - The input type (e.g. "text", "number", etc.)
 * @param {string} props.label - A user-friendly label for the field
 * @param {string} props.field - The field name (can be nested, e.g. "meals.0.calories")
 * @param {string} [props.prefix] - Optional prefix for nested usage (ArrayField / ObjectField)
 */
export function InputField({ type, label, field, prefix, icon, inputWidth, labelWidth, ...props }) {
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
                    _jsx("span", { className: "relative inline-flex tap-highlight-transparent flex-row items-center px-3 gap-3 data-[hover=true]:bg-default-50 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium flex-1 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background is-filled", children: fieldInfo.value }) : InputComp({ type, label, field, fieldInfo, prefix, fieldName, inputWidth, labelWidth, ...props }), errors[fieldName] && (_jsx("div", { style: { color: "red", marginTop: 4 }, children: errors[fieldName].message?.toString() }))] })) }));
}
//# sourceMappingURL=input-field.js.map