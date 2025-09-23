import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// InputField.jsx
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Textarea } from '@heroui/react';
import { fieldExistsInSchema, useInputStyle } from "./form-utils";
import InputLabel from './InputLabel';
export function TextField({ type, label, field, prefix, icon, classNames, labelWidth, inputWidth, ...props }) {
    // @ts-ignore
    const { register, control, formState: { errors }, isReadOnly, schema } = useFormContext();
    // Build the final field name
    const fieldName = prefix ? `${prefix}.${field}` : field;
    const { variant, radius, size, } = props;
    const { variant: inputVariant, radius: inputRadius, size: inputSize, inputWidth: inputWidthStyle, labelWidth: labelWidthStyle, } = useInputStyle({ variant, radius, size, inputWidth, labelWidth });
    useEffect(() => {
        if (!fieldExistsInSchema(schema, field)) {
            throw new Error(`Field ${field} does not exist in schema`);
        }
    }, [field, schema]);
    return (_jsx(Controller
    //@ts-ignore
    , { 
        //@ts-ignore
        name: fieldName, control: control, render: ({ field: fieldInfo }) => (_jsxs("div", { className: "flex items-center gap-3 w-full", children: [_jsx(InputLabel, { fieldName: fieldName, label: label, icon: icon, labelWidth: labelWidth }), isReadOnly ?
                    _jsx("span", { className: "relative inline-flex tap-highlight-transparent flex-row items-center px-3 gap-3 data-[hover=true]:bg-default-50 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium flex-1 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background is-filled", children: fieldInfo.value }) : _jsx(Textarea, { id: fieldName, type: "number", variant: inputVariant, radius: inputRadius, size: inputSize, ...fieldInfo, placeholder: label, 
                    // classNames={classNames}
                    classNames: {
                        // "base": inputWidthStyle ? `w-[${inputWidthStyle}px]` : "w-full",
                        // "base": "w-[500px]",                              
                        "base": "w-full",
                    } }), errors[fieldName] && (_jsx("div", { style: { color: "red", marginTop: 4 }, children: errors[fieldName].message?.toString() }))] })) }));
}
//# sourceMappingURL=text-field.js.map