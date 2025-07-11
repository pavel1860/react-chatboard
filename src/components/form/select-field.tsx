// InputField.jsx
import React, { useEffect } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { Input, Select, SelectItem, Skeleton, Form, Button } from '@heroui/react';
import { InputFieldProps, InputStyleProps } from "./types";
import { z } from "zod";
import { fieldExistsInSchema, useFieldValues, useInputStyle } from "./form-utils";
import InputLabel from './InputLabel';





const SelectComp = ({
    type,
    label,
    field,
    fieldInfo,
    prefix,
    fieldName,
    variant,
    radius,
    size,
    labelWidth,
    // icon 
}: InputFieldProps & { fieldName: string, fieldInfo: any }) => {

    const selectValues = useFieldValues(fieldName);

    const {
            variant: inputVariant,
            radius: inputRadius,
            size: inputSize,
        } = useInputStyle({variant, radius, size});

    const {
        labelWidth: labelWidthStyle,
        inputWidth: inputWidthStyle,
    } = useInputStyle({ variant, radius, size });

    return (
        <Select
            id={fieldName}
            disallowEmptySelection
            variant={inputVariant}
            size={inputSize}
            radius={inputRadius}
            // startContent={inputStartIcon}
            // endContent={input.EndIcon}
            selectedKeys={[fieldInfo.value]}
            {...fieldInfo}
            items={selectValues}
            // label={label}
            placeholder={label}
            classNames={{
                "base": inputWidthStyle ? `w-[${inputWidthStyle}px]` : "",
                "label": labelWidthStyle ? `w-[${labelWidthStyle}px]` : ""
            }}
        >
            {
                selectValues.map((option) => (<SelectItem key={option.value}>{option.label}</SelectItem>))
            }
            {/* {Object.keys(enumValues).map((option) => (
                    <SelectItem key={option}>{enumValues[option]}</SelectItem>
                ))} */}
        </Select>
    )

};



/**
 * @param {Object} props
 * @param {string} props.type - The input type (e.g. "text", "number", etc.)
 * @param {string} props.label - A user-friendly label for the field
 * @param {string} props.field - The field name (can be nested, e.g. "meals.0.calories")
 * @param {string} [props.prefix] - Optional prefix for nested usage (ArrayField / ObjectField)
 */
export function SelectField({
    type,
    label,
    field,
    prefix,
    icon,
    labelWidth,
    ...props
}: InputFieldProps) {
    // @ts-ignore
    const { register, control, formState: { errors }, isReadOnly, schema } = useFormContext();
    // Build the final field name
    const fieldName = prefix ? `${prefix}.${field}` : field;

    useEffect(() => {
        if (!fieldExistsInSchema(schema, field)) {
            throw new Error(`Field ${field} does not exist in schema`)
        }
    }, [field, schema])

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
                        >{fieldInfo.value}</span> : SelectComp({ type, label, field, fieldInfo, prefix, fieldName, labelWidth, ...props })}

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
