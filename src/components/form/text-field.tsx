// InputField.jsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Input, Select, SelectItem, Skeleton, Form, Button, Textarea } from '@heroui/react';
import { InputFieldProps, InputStyleProps } from "./types";
import { useInputStyle } from "./form-utils";
import PromptTextEditor from "../promptEditor/editors/promptTextEditor";
import InputLabel from './InputLabel';









export function TextField({ 
    type, 
    label, 
    field, 
    prefix,
    icon,
    classNames,
    labelWidth,
    inputWidth,
    ...props
}: InputFieldProps) {
    const { register, control, formState: { errors }, isReadOnly } = useFormContext();
    // Build the final field name
    const fieldName = prefix ? `${prefix}.${field}` : field;
    const {
        variant,
        radius,
        size,
    } = props;
    const {
        variant: inputVariant,
        radius: inputRadius,
        size: inputSize,
        inputWidth: inputWidthStyle,
        labelWidth: labelWidthStyle,
    } = useInputStyle({variant, radius, size, inputWidth, labelWidth});
    
    return (
        <Controller
            //@ts-ignore
            name={fieldName as keyof z.infer<T>}
            control={control}
            render={({ field: fieldInfo }) => (
                <div className="flex items-center gap-3">
                    <InputLabel
                        fieldName={fieldName}
                        label={label}
                        icon={icon}
                        labelWidth={labelWidth}
                    />
                    {isReadOnly ? 
                        <span
                            className="relative inline-flex tap-highlight-transparent flex-row items-center px-3 gap-3 data-[hover=true]:bg-default-50 group-data-[focus=true]:bg-default-100 h-10 min-h-10 rounded-medium flex-1 transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background is-filled"
                        >{fieldInfo.value}</span> : <Textarea
                            id={fieldName}
                            type="number"
                            variant={inputVariant}
                            radius={inputRadius}
                            size={inputSize}
                            {...fieldInfo}
                            placeholder={label}
                            // classNames={classNames}
                            classNames={{
                                "base": inputWidthStyle ? `w-[${inputWidthStyle}px]` : "w-full",
                                // "base": "w-[500px]",                              
                            }}
                        />}

                    {errors[fieldName] && (
                        <div style={{ color: "red", marginTop: 4 }}>
                            {errors[fieldName].message?.toString()}
                        </div>
                    )}
                </div>
            )} 
        />
    );
}
